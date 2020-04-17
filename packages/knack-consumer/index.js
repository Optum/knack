const fs = require('fs');
const {promisify} = require('util');
const Kafka = require('node-rdkafka');
const {TaskTimer} = require('tasktimer');

const readFileAsync = promisify(fs.readFile);
const {Console} = console;
const defaultLogger = new Console({stdout: process.stdout, stderr: process.stderr});

// TODO: make these values configurable
const NON_FLOW_MODE_MSG_NUM = 1;
const NON_FLOW_MODE_INTERVAL_MS = 100;

let consumer = {};
let taskTimer;

const defaultConsumerConfig = {
	'client.id': 'my-kafka-client-v1',
	'group.id': 'my-kafka-group-v1',
	'metadata.broker.list': 'localhost:9092',
	'socket.keepalive.enable': true,
	'enable.auto.commit': true
};

const defaultTopicConfig = {
	'auto.offset.reset': 'earliest',
	// eslint-disable-next-line camelcase
	event_cb: () => {}
};

const readFileAsJson = async filePath => {
	try {
		// NOTE: could also load the path as a module to support functions like event_cb
		const configString = await readFileAsync(filePath);
		return JSON.parse(configString);
	} catch (_) {}
};

const getDefaultConfigs = async () => {
	let consumerConfig = defaultConsumerConfig;
	let topicConfig = defaultTopicConfig;

	if (process.env.KNACK_CONSUMER_CONFIG_PATH) {
		const configJson = await readFileAsJson(process.env.KNACK_CONSUMER_CONFIG_PATH);
		if (configJson) {
			consumerConfig = configJson;
		}
	}

	if (process.env.KNACK_CONSUMER_TOPIC_CONFIG_PATH) {
		const configJson = await readFileAsJson(process.env.KNACK_CONSUMER_TOPIC_CONFIG_PATH);
		if (configJson) {
			topicConfig = configJson;
		}
	}

	return {
		consumer: consumerConfig,
		topic: topicConfig
	};
};

let log = defaultLogger;

const connect = async config => {
	const {logger, topics, flowMode, consumerConfig, topicConfig, onData} = config;

	if (!Array.isArray(topics)) {
		throw new TypeError('topics must be an array');
	}

	if (typeof onData !== 'function') {
		throw new TypeError('onData must be a function');
	}

	if (logger) {
		log = logger;
	}

	let defaultConfigs;

	if (!consumerConfig) {
		if (!defaultConfigs) {
			defaultConfigs = await getDefaultConfigs();
		}

		config.consumerConfig = defaultConfigs.consumer;
	}

	if (!topicConfig) {
		if (!defaultConfigs) {
			defaultConfigs = await getDefaultConfigs();
		}

		config.topicConfig = defaultConfigs.topic;
	}

	return new Promise((resolve, reject) => {
		consumer = new Kafka.KafkaConsumer(config.consumerConfig, config.topicConfig);
		consumer.on('ready', () => {
			consumer.subscribe(topics);
			if (flowMode) {
				// Flowing mode
				// consume messages as soon as they are available
				consumer.consume();
			} else {
				// Non-flowing mode
				taskTimer = new TaskTimer(NON_FLOW_MODE_INTERVAL_MS);
				taskTimer.on('tick', () => {
					consumer.consume(NON_FLOW_MODE_MSG_NUM);
				});
				taskTimer.start();
			}

			log.info(`subscribed to topics: ${topics.join(', ')} with flowMode: ${flowMode || false}`);

			resolve(consumer);
		});

		consumer.on('data', onData);

		consumer.on('event.error', error => {
			log.error(error);
			reject(error);
		});

		consumer.on('event.log', message => {
			log.debug(message);
		});

		consumer.connect();
	});
};

module.exports = {
	getConsumer: () => {
		return consumer;
	},
	disconnect: () => {
		return new Promise((resolve, reject) => {
			if (taskTimer) {
				taskTimer
					.stop()
					.removeAllListeners();
			}

			if (consumer.disconnect) {
				consumer.on('disconnected', error => {
					if (error) {
						return reject(error);
					}

					return resolve(consumer);
				});
				consumer.disconnect();
			} else {
				return resolve(consumer);
			}
		});
	},
	connect,
	getDefaultConfigs
};

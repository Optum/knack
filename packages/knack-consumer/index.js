const Kafka = require('node-rdkafka');
const {TaskTimer} = require('tasktimer');

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

let log = defaultLogger;

const connect = async config => {
	const {logger, topics, flowMode, consumerConfig, topicConfig, onData} = config;

	if (!Array.isArray(topics)) {
		throw new TypeError('topics must be an array');
	}

	if (typeof onData !== 'function') {
		throw new TypeError('onData must be a function');
	}

	if (!consumerConfig) {
		config.consumerConfig = defaultConsumerConfig;
	}

	if (!topicConfig) {
		config.topicConfig = defaultTopicConfig;
	}

	if (logger) {
		log = logger;
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

		consumer.on('event.log', msg => {
			log.debug(msg);
		});

		consumer.connect();
	});
};

module.exports = {
	getConsumer: () => {
		return consumer;
	},
	disconnect: () => {
		if (consumer.disconnect) {
			consumer.disconnect();
		}

		if (taskTimer) {
			process.nextTick(() => {
				taskTimer
					.stop()
					.removeAllListeners();
			});
		}
	},
	connect
};

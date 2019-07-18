const knackConsumer = require('knack-consumer');
const KnackSr = require('knack-sr');
const {parseRecord} = require('./parseRecord');

const {Console} = console;
const defaultLogger = new Console({stdout: process.stdout, stderr: process.stderr});

let consumer = {};

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

const resolveSchemas = async (sr, topic) => {
	const schemas = {};

	// try to get key schema
	try {
		const keySchema = await sr.getSchemaBySubject(`${topic}-key`);
		schemas.key = keySchema.schema;
	} catch (_) {
		log.info(`no key schema found for topic ${topic}`);
	}

	// try to get value schema
	try {
		const valueSchema = await sr.getSchemaBySubject(`${topic}-value`);
		schemas.value = valueSchema.schema;
	} catch (_) {
		log.info(`no value schema found for topic ${topic}`);
	}

	return schemas;
};

const connect = async config => {
	const {logger, subscriptions, flowMode, consumerConfig, topicConfig, schemaRegistryInfo} = config;
	if (!Array.isArray(subscriptions)) {
		throw new TypeError('subscriptions must be an array');
	}

	const topics = [];
	const subscriptionMap = {};

	const sr = new KnackSr(schemaRegistryInfo);

	for (const subscription of subscriptions) {
		topics.push(subscription.topic);
		// eslint-disable-next-line no-await-in-loop
		subscription.schemas = await resolveSchemas(sr, subscription.topic);
		subscriptionMap[subscription.topic] = subscription;
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

	const onData = async record => {
		try {
			const {handler, schemas} = subscriptionMap[record.topic];

			const {key, value} = await parseRecord({
				key: record.key,
				value: record.value,
				keySchema: schemas.key,
				valueSchema: schemas.value
			});

			await handler({
				key,
				value,
				timestamp: record.timestamp,
				topic: record.topic
			});
		} catch (error) {
			log.error(error);

			// stop consuming on error
			knackConsumer.disconnect();

			// TODO: impl error handling abstraction
			// that allows configurable behaivors.
			// examples:
			//  - allow for certain errors to cause a shutdown
			//  - allow for certain errors to be handled by a configured handlers
			//  - allow these configurations to be async
			//  - allow shutdown to exit without consuming another message
		}
	};

	consumer = await knackConsumer.connect({
		logger,
		topics,
		flowMode,
		consumerConfig: config.consumerConfig,
		topicConfig: config.topicConfig,
		onData
	});

	return consumer;
};

module.exports = {
	getConsumer: () => {
		return consumer;
	},
	disconnect: () => {
		knackConsumer.disconnect();
	},
	connect
};

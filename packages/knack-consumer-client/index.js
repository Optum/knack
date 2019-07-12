const knackConsumer = require('knack-consumer');
const {parseRecord} = require('./parseRecord');

const NON_FLOW_MODE_MSG_NUM = 1;

let consumer = {};

const defaultConsumerConfig = {
	'client.id': 'my-kafka-client-v1',
	'group.id': 'my-kafka-group-v1',
	'metadata.broker.list': 'localhost:9092',
	'enable.auto.commit': true,
	'socket.keepalive.enable': true,
	'auto.offset.reset': 'beginning'
};

let log = console;

const connect = async config => {
	const {logger, subscriptions, flowMode, consumerConfig} = config;

	if (!Array.isArray(subscriptions)) {
		throw new TypeError('subscriptions must be an array');
	}

	const subscriptionMap = {};

	subscriptions.map(s => {
		subscriptionMap[s.topic] = s;
		return s.topic;
	});

	if (!consumerConfig) {
		config.consumerConfig = defaultConsumerConfig;
	}

	if (logger) {
		log = logger;
	}

	const onData = async record => {
		try {
			log.info('got a message');
			// TODO: update parseRecord call param to adhere to the following model
			// by use the record.topic to attempt to get the schema from knack-sr
			// {keySchema, valueSchema, key, value}
			const {key, value} = await parseRecord(record);

			await subscriptionMap[record.topic].handler({
				key,
				value,
				timestamp: record.timestamp,
				topic: record.topic
			});

			if (!config.consumerConfig['enable.auto.commit']) {
				// Commit offset after handler completes
				consumer.commitMessage(record);
			}
		} catch (error) {
			log.error(error);

			// NOTE: impl error handling abstraction
			// that allows configurable behaivors.
			// examples:
			//  - allow for certain errors to cause a shutdown
			//  - allow for certain errors to be handled by a configured handlers
			//  - allow these configurations to be async
			//  - allow shutdown to exit without consuming another message
		}

		if (!flowMode) {
			// Non-flowing mode
			consumer.consume(NON_FLOW_MODE_MSG_NUM);
		}
	};

	consumer = await knackConsumer.connect({logger, subscriptions, flowMode, consumerConfig, onData});

	return consumer;
};

module.exports = {
	getConsumer: () => {
		return consumer;
	},
	connect
};

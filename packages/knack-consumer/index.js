const Kafka = require('node-rdkafka');

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
	const {logger, subscriptions, flowMode, consumerConfig, onData} = config;

	if (!Array.isArray(subscriptions)) {
		throw new TypeError('subscriptions must be an array');
	}

	// TODO: check onData to be a function

	const subscriptionMap = {};

	const topics = subscriptions.map(s => {
		subscriptionMap[s.topic] = s;
		return s.topic;
	});

	if (!consumerConfig) {
		config.consumerConfig = defaultConsumerConfig;
	}

	if (logger) {
		log = logger;
	}

	return new Promise((resolve, reject) => {
		consumer = new Kafka.KafkaConsumer(config.consumerConfig, {});
		consumer.on('ready', () => {
			consumer.subscribe(topics);

			if (flowMode) {
				// Flowing mode
				// consume messages as soon as they are available
				consumer.consume();
			} else {
				// Non-flowing mode
				consumer.consume(NON_FLOW_MODE_MSG_NUM);
			}

			log.info(`subscribed to topics: ${topics.join(', ')}`);

			resolve(consumer);
		});

		consumer.on('data', onData);

		consumer.on('event.error', err => {
			log.error(
				Object.assign(err, {
					message: 'error from kafka consumer'
				})
			);
			reject(err);
		});

		consumer.connect();
	});
};

module.exports = {
	getConsumer: () => {
		return consumer;
	},
	connect
};

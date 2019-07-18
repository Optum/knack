const knackConsumerClient = require('knack-consumer-client');

// TOOD: make consumer and topic config configurable
const defaultConsumerConfig = {
	'client.id': 'my-kafka-client-v2',
	'group.id': 'my-kafka-group-v2',
	'metadata.broker.list': 'localhost:9092',
	'socket.keepalive.enable': true,
	'enable.auto.commit': true
	// debug: 'consumer,cgrp,topic,fetch,msg'
};

const defaultTopicConfig = {
	'auto.offset.reset': 'earliest',
	// eslint-disable-next-line camelcase
	event_cb: () => {}
};

const main = async topic => {
	try {
		const handler = async ({key, value, timestamp, topic}) => {
			console.log('key', key);
			console.log('value', value);
			console.log('timestamp', timestamp);
			console.log('topic', topic);
		};

		const subscription = {
			topic,
			handler
		};

		await knackConsumerClient.connect({
			subscriptions: [subscription],
			flowMode: true,
			consumerConfig: defaultConsumerConfig,
			topicConfig: defaultTopicConfig
		});

		process.on('SIGINT', () => {
			console.log('\ninterrupt signal detected');
			console.log('disconnecting consumer');
			knackConsumerClient.disconnect();
		});

		return {
			message: `consumer connected to ${topic}`,
			noExit: true
		};
	} catch (error) {
		return {
			errorMessage: `Error connecting consumer to topic ${topic}`,
			error
		};
	}
};

module.exports = main;

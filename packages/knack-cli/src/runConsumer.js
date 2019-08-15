const {readJson} = require('fs-extra');
const knackConsumerClient = require('@optum/knack-consumer-client');

// TOOD: make consumer and topic config configurable
const defaultConsumerConfig = {
	'client.id': 'knack-test-client-v1',
	'group.id': 'knack-test-group-v1',
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

const getConfigs = async ({consumerConfigPath, topicConfigPath}) => {
	let consumerConfig = defaultConsumerConfig;
	let topicConfig = defaultTopicConfig;

	if (consumerConfigPath) {
		consumerConfig = await readJson(consumerConfigPath);
		console.log('using provided consumer config');
		console.log(consumerConfig);
	}

	if (topicConfigPath) {
		topicConfig = await readJson(topicConfigPath);
		console.log('using provided topic config');
		console.log(topicConfig);
	}

	return {
		consumerConfig,
		topicConfig
	};
};

const main = async ({topic, consumerConfig: consumerConfigPath, topicConfig: topicConfigPath, srUrl}) => {
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

		const {consumerConfig, topicConfig} = await getConfigs({
			consumerConfigPath,
			topicConfigPath
		});

		let srOptions;

		if (srUrl) {
			srOptions = {
				url: srUrl
			};
		}

		await knackConsumerClient.connect({
			subscriptions: [subscription],
			flowMode: true,
			consumerConfig,
			topicConfig, 
			srOptions
		});

		process.on('SIGINT', async () => {
			console.log('\ninterrupt signal detected');
			console.log('disconnecting consumer');
			try {
				await knackConsumerClient.disconnect();
			} catch (_) {}
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

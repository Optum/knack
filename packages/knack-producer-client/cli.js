#!/usr/bin/env node
const KafkaProducerClient = require('.');

const count = 5;
const topic = 'test-client-topic-v1';

const main = async () => {
	await KafkaProducerClient.connectInstance();

	const producer = KafkaProducerClient.instance();

	const tasks = [];

	for (let i = 1; i <= count; i++) {
		const key = {id: `${Date.now()}`};
		const value = {
			text: `Hello from number ${i}`
		};

		tasks.push(producer.publish({
			topic,
			key,
			value
		}));
	}

	await Promise.all(tasks);

	await KafkaProducerClient.disconnectInstances();

	console.log(`${tasks.length} messages sent to ${topic}`);
};

main();

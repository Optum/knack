const KafkaConsumerClient = require('.');

const defaultOptions = {
	protocol: 'http',
	domain: 'localhost:8081',
	config: {
		'metadata.broker.list': ['localhost:9092'],
		debug: 'all',
		// eslint-disable-next-line camelcase
		event_cb: true
	},
	topicConfig: {}
};

// Const count = 5;
const topic = 'test-client-topic-v1';

const delay = async () => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, 5000);
	});
};

process.on('uncaughtException', error => {
	console.log(error);
});

process.on('unhandledRejection', (reason, p) => {
	console.log(reason, p);
});

const main = async () => {
	try {
		const handler = async (key, value) => {
			console.log('key', key);
			console.log('value', value);
		};

		const subscription = {
			topic,
			handler,
			flowMode: false,
			consumeCount: 1
		};

		console.log('connecting consumer...');
		await KafkaConsumerClient.connectAndWire(subscription, defaultOptions);
		console.log('consumer connected.');

		console.log('waiting for messages...');
		await delay();
	} catch (error) {
		console.log(error);
	}
};

main();

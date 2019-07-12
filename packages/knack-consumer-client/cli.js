const knackConsumerClient = require('.');

const defaultConsumerConfig = {
	'client.id': 'my-kafka-client-v1',
	'group.id': 'my-kafka-group-v1',
	'metadata.broker.list': 'localhost:9092',
	'enable.auto.commit': true,
	'socket.keepalive.enable': true,
	'auto.offset.reset': 'smallest'
};

const topic = 'test-client-topic-v1';

const main = async () => {
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
			// TODO: impl topic level flow settings
			// flowMode: false,
			// consumeCount: 1
		};

		console.log('connecting consumer...');

		await knackConsumerClient.connect({
			subscriptions: [subscription],
			flowMode: true,
			consumerConfig: defaultConsumerConfig
		});

		console.log('consumer connected');
	} catch (error) {
		console.log(error);
	}
};

main();

const test = require('ava');
const {EventEmitter} = require('events');
const {spy} = require('sinon');
const proxyquire = require('proxyquire');

const silentTestLogger = {
	trace: () => {},
	debug: () => {},
	info: () => {},
	warn: () => {},
	error: () => {},
	fatal: () => {}
};

function buildConsumerMock() {
	class ConsumerMock extends EventEmitter {
		constructor(consumerConfig, topicConfig) {
			super();
			this.consumerConfig = consumerConfig;
			this.topicConfig = topicConfig;
			this.connectEventName = 'ready';
			this.disconnectEventName = 'disconnected';
			this.consume = spy(this.consume.bind(this));
			this.connect = spy(this.connect.bind(this));
			this.disconnect = spy(this.disconnect.bind(this));
			this.subscribe = spy(this.subscribe.bind(this));
		}

		consume() {}

		connect() {
			this.emit(this.connectEventName);
		}

		disconnect() {
			this.emit(this.disconnectEventName);
		}

		subscribe() {}
	}

	Object.setPrototypeOf(ConsumerMock, spy());

	return ConsumerMock;
}

test.before('setup test', t => {
	proxyquire
		.noCallThru()
		.noPreserveCache();

	const KafkaConsumer = buildConsumerMock();

	t.context.knackConsumer = proxyquire('..', {
		'node-rdkafka': {
			KafkaConsumer
		}
	});

	t.pass();
});

test('connect disconnect with custom settings', async t => {
	const {knackConsumer} = t.context;

	const testConsumerConfig = {
		'client.id': 'unit-test-client-v1',
		'group.id': 'unit-test-group-v1',
		'metadata.broker.list': 'brokerhost:9092'
	};

	const testTopicConfig = {
		'auto.offset.reset': 'smallest'
	};

	const testConsumer = await knackConsumer.connect({
		topics: ['unit-test-topic'],
		consumerConfig: testConsumerConfig,
		topicConfig: testTopicConfig,
		logger: silentTestLogger,
		onData: () => {}
	});

	t.truthy(testConsumer, 'consumer not defined');
	t.truthy(testConsumer.connect.calledOnce);

	t.deepEqual(
		testConsumer.constructor.lastCall.thisValue.consumerConfig,
		testConsumerConfig,
		'consumer config used was not expected');

	t.deepEqual(
		testConsumer.constructor.lastCall.thisValue.topicConfig,
		testTopicConfig,
		'topic config used was not expected');

	await knackConsumer.disconnect();

	t.truthy(testConsumer.disconnect.calledOnce);
});


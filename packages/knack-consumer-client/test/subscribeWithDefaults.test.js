const test = require('ava');
const {EventEmitter} = require('events');
const {spy} = require('sinon');
const proxyquire = require('proxyquire');
const nock = require('nock');

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

	let consumerMock;
	const KnackConsumer = {};
	const connect = ({consumerConfig, topicConfig, onData}) => {
		if (!consumerMock) {
			consumerMock = new ConsumerMock(consumerConfig, topicConfig);
		}

		consumerMock.connect();
		consumerMock.on('data', onData);
		return consumerMock;
	};

	const disconnect = () => {
		if (!consumerMock) {
			return;
		}

		consumerMock.disconnect();
		return consumerMock;
	};

	const getConsumer = () => {
		return consumerMock;
	};

	KnackConsumer.connect = spy(connect.bind(KnackConsumer));
	KnackConsumer.disconnect = spy(disconnect.bind(KnackConsumer));
	KnackConsumer.getConsumer = spy(getConsumer.bind(KnackConsumer));

	return KnackConsumer;
}

test.before('setup test', t => {
	proxyquire
		.noCallThru()
		.noPreserveCache();

	const KnackConsumer = buildConsumerMock();

	t.context.knackConsumerClient = proxyquire('..', {
		'@optum/knack-consumer': KnackConsumer
	});

	t.context.stringAvroSchema = {
		id: 123,
		schema: '{"type": "string"}'
	};

	t.context.nockScopeKey = nock('http://localhost:8081')
		.get('/subjects/unit-test-topic-key/versions/latest')
		.reply(200, t.context.stringAvroSchema);

	t.context.nockScopeValue = nock('http://localhost:8081')
		.get('/subjects/unit-test-topic-value/versions/latest')
		.reply(200, t.context.stringAvroSchema);

	t.pass();
});

test('connect, consume, disconnect with defaults', async t => {
	const {knackConsumerClient} = t.context;

	const testConsumer = await knackConsumerClient.connect({
		subscriptions: [{
			topic: 'unit-test-topic',
			handler: () => {}
		}],
		logger: silentTestLogger
	});

	t.truthy(testConsumer, 'consumer not defined');
	t.truthy(testConsumer.connect.calledOnce);

	const defaultConfigs = await knackConsumerClient.getDefaultConfigs();

	t.deepEqual(
		testConsumer.constructor.lastCall.thisValue.consumerConfig,
		defaultConfigs.consumer,
		'consumer config used was not expected');

	t.deepEqual(
		testConsumer.constructor.lastCall.thisValue.topicConfig,
		defaultConfigs.topic,
		'topic config used was not expected');

	await knackConsumerClient.disconnect();

	t.truthy(testConsumer.disconnect.calledOnce);
});

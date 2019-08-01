const test = require('ava');
const proxyquire = require('proxyquire');
const nock = require('nock');
const {silentTestLogger, knackMocker} = require('./utils');

test.before('setup test', t => {
	proxyquire
		.noCallThru()
		.noPreserveCache();

	const KnackConsumer = knackMocker.buildConsumerMock();

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

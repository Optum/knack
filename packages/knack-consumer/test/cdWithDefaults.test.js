const test = require('ava');
const proxyquire = require('proxyquire');
const {silentTestLogger, nodeRdMocker} = require('./utils');

test.before('setup test', t => {
	proxyquire
		.noCallThru()
		.noPreserveCache();

	const KafkaConsumer = nodeRdMocker.buildConsumerMock();

	t.context.knackConsumer = proxyquire('..', {
		'node-rdkafka': {
			KafkaConsumer
		}
	});

	t.pass();
});

test('connect disconnect with defaults', async t => {
	const {knackConsumer} = t.context;

	const testConsumer = await knackConsumer.connect({
		topics: ['unit-test-topic'],
		logger: silentTestLogger,
		onData: () => {}
	});

	t.truthy(testConsumer, 'consumer not defined');
	t.truthy(testConsumer.connect.calledOnce);

	const defaultConfigs = await knackConsumer.getDefaultConfigs();

	t.deepEqual(
		testConsumer.constructor.lastCall.thisValue.consumerConfig,
		defaultConfigs.consumer,
		'consumer config used was not expected');

	t.deepEqual(
		testConsumer.constructor.lastCall.thisValue.topicConfig,
		defaultConfigs.topic,
		'topic config used was not expected');

	await knackConsumer.disconnect();

	t.truthy(testConsumer.disconnect.calledOnce);
});

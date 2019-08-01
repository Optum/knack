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


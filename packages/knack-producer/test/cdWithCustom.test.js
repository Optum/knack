const test = require('ava');
const proxyquire = require('proxyquire');
const {nodeRdMocker} = require('./utils');

test.before('setup test', t => {
	proxyquire
		.noCallThru()
		.noPreserveCache();

	const KafkaProducer = nodeRdMocker.buildProducerMock();

	const KnackProducer = proxyquire('../knackProducer', {
		'node-rdkafka': {
			Producer: KafkaProducer
		}
	});

	t.context.KnackProducer = KnackProducer;

	t.pass();
});

test('connect disconnect with custom settings', async t => {
	const {KnackProducer} = t.context;

	const testOptions = {
		producerConfig: {
			'metadata.broker.list': ['brokerhost:9092']
		}
	};

	const testProducer = new KnackProducer(testOptions);

	await testProducer.connect();

	t.truthy(testProducer, 'producer not defined');
	t.truthy(testProducer.connect.calledOnce);

	await testProducer.disconnect();

	t.truthy(testProducer.disconnect.calledOnce);
});


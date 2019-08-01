const test = require('ava');
const proxyquire = require('proxyquire');
const {nodeRdMocker} = require('./utils');

test.before('setup test', t => {
	proxyquire
		.noCallThru()
		.noPreserveCache();

	const KnackProducer = nodeRdMocker.buildProducerMock();

	const KnackProducerClient = proxyquire('..', {
		'@optum/knack-producer': {
			KnackProducer
		}
	});

	t.context.KnackProducerClient = KnackProducerClient;

	t.pass();
});

test('connect disconnect with default settings', async t => {
	const {KnackProducerClient} = t.context;

	await KnackProducerClient.connectInstance();

	const testProducerClient = KnackProducerClient.instance();

	t.truthy(testProducerClient.producer.connect.calledOnce);

	await KnackProducerClient.disconnectInstances();

	t.truthy(testProducerClient.producer.disconnect.calledOnce);
});


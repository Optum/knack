const test = require('ava');
const {EventEmitter} = require('events');
const {spy} = require('sinon');
const proxyquire = require('proxyquire');

function buildProducerMock() {
	class ProducerMock extends EventEmitter {
		constructor(producerConfig) {
			super();
			this.producerConfig = producerConfig;
			this.connectEventName = 'ready';
			this.disconnectEventName = 'disconnected';
			this.produce = spy(this.produce.bind(this));
			this.connect = spy(this.connect.bind(this));
			this.disconnect = spy(this.disconnect.bind(this));
		}

		produce() {}

		connect() {
			this.emit(this.connectEventName);
		}

		disconnect() {
			this.emit(this.disconnectEventName);
		}
	}

	Object.setPrototypeOf(ProducerMock, spy());

	return ProducerMock;
}

test.before('setup test', t => {
	proxyquire
		.noCallThru()
		.noPreserveCache();

	const KnackProducer = buildProducerMock();

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


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

	const KafkaProducer = buildProducerMock();

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


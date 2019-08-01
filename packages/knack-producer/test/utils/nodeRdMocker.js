const {EventEmitter} = require('events');
const {spy} = require('sinon');

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

module.exports = {
	buildProducerMock
};

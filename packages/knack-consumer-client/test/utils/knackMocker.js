const {EventEmitter} = require('events');
const {spy} = require('sinon');

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

module.exports = {
	buildConsumerMock
};

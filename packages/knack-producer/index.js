const pEvent = require('p-event');
const Kafka = require('node-rdkafka');

const defaultOptions = {
	config: {
		'metadata.broker.list': ['localhost:9092']
	}
};

class KafkaProducer extends Kafka.Producer {
	constructor(options = defaultOptions) {
		super(options.config);
		this._options = options;
	}

	get options() {
		return this._options;
	}

	async connect() {
		const connectEvent = pEvent(this, 'ready');
		super.connect();
		const connection = await Promise.resolve(connectEvent);
		return connection;
	}

	async disconnect() {
		const disconnectEvent = pEvent(this, 'disconnected');
		super.disconnect();
		const disconnection = await Promise.resolve(disconnectEvent);
		return disconnection;
	}
}

module.exports = KafkaProducer;

const pEvent = require('p-event');
const Kafka = require('node-rdkafka');

const defaultOptions = {
	producerConfig: {
		'metadata.broker.list': ['localhost:9092']
	}
};

class KnackProducer extends Kafka.Producer {
	constructor(options = defaultOptions) {
		super(options.producerConfig);
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

	readMetadata(options) {
		return new Promise((resolve, reject) => {
			super.getMetadata(options || {
				timeout: 10000
			}, (error, metadata) => {
				if (error) {
					return reject(error);
				}

				return resolve(metadata);
			});
		});
	}
}

KnackProducer.defaultOptions = defaultOptions;

module.exports = KnackProducer;

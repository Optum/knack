const QuickLRU = require('quick-lru');
const KafkaProducer = require('knack-producer');
const SchemaRegistry = require('knack-sr');
const {toAvroBuffer} = require('knack-avro');

const cache = new QuickLRU({maxSize: 1000});

const defaultOptions = {
	protocol: 'http',
	domain: 'localhost:8081',
	config: {
		'metadata.broker.list': ['localhost:9092']
	}
};

const resolveProducer = (options = defaultOptions) => {
	const cacheKey = `p-${options.config['metadata.broker.list']}`;
	let producer = cache.get(cacheKey);
	if (!producer) {
		producer = new KafkaProducerClient(options);
		cache.set(cacheKey, producer);
	}

	return producer;
};

class KafkaProducerClient {
	constructor(options = defaultOptions) {
		this._options = options;
		this._producer = new KafkaProducer(this.options);
		const {protocol, domain} = this.options;
		this._sr = new SchemaRegistry({protocol, domain});
	}

	static async connectInstance(options = defaultOptions) {
		const producer = resolveProducer(options);
		const connection = await producer.connect();
		return connection;
	}

	static disconnectInstances() {
		const tasks = [];
		for (const p of cache.values()) {
			if (p.disconnect) {
				tasks.push(p.disconnect());
			}
		}

		return Promise.all(tasks);
	}

	static instance(options = defaultOptions) {
		return resolveProducer(options);
	}

	get options() {
		return this._options;
	}

	get producer() {
		return this._producer;
	}

	get schemaRegistry() {
		return this._sr;
	}

	async encode({topic, type, val}) {
		const subject = `${topic}-${type}`;
		const cacheKey = `s-${subject}`;

		let schema = cache.get(cacheKey);
		if (!schema) {
			schema = await this.schemaRegistry.getSchemaBySubject(subject);
			cache.set(cacheKey, schema);
		}

		return toAvroBuffer(val, schema.schema, schema.id);
	}

	async connect() {
		const connection = await this.producer.connect();
		return connection;
	}

	async produce(...args) {
		return this.producer.produce(...args);
	}

	async publish({topic, key, value}) {
		const encodedKey = await this.encode({topic, type: 'key', val: key});
		const encodedValue = await this.encode({topic, type: 'value', val: value});

		return this.producer.produce(topic, null, encodedValue, encodedKey, Date.now());
	}

	async disconnect() {
		const disconnection = await this.producer.disconnect();
		return disconnection;
	}
}

module.exports = KafkaProducerClient;

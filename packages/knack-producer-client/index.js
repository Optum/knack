const QuickLRU = require('quick-lru');
const KnackProducers = require('@optum/knack-producer');
const SchemaRegistry = require('@optum/knack-sr');
const {toAvroBuffer} = require('@optum/knack-avro');

const cache = new QuickLRU({maxSize: 1000});

const defaultOptions = {
	scheme: 'http',
	domain: 'localhost:8081',
	producerConfig: {
		'metadata.broker.list': ['localhost:9092']
	}
};

const resolveProducer = (options = defaultOptions) => {
	const cacheKey = `p-${options.producerConfig['metadata.broker.list']}`;
	let producer = cache.get(cacheKey);
	if (!producer) {
		producer = new KnackProducerClient(options);
		cache.set(cacheKey, producer);
	}

	return producer;
};

class KnackProducerClient {
	constructor(options = defaultOptions) {
		this._options = options;
		const {scheme, domain, useHighLevelProducer} = options;

		if (useHighLevelProducer) {
			const {KnackHighLevelProducer} = KnackProducers;
			this._producer = new KnackHighLevelProducer(options);
		} else {
			const {KnackProducer} = KnackProducers;
			this._producer = new KnackProducer(options);
		}

		this._sr = new SchemaRegistry({scheme, domain});
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
			// NOTE: add option to disable throwing an error when 404 returns
			// from sr ... this way it will support publishing json, strings, etc.
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

module.exports = KnackProducerClient;

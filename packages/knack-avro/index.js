const avro = require('avsc');

const MAGIC_BYTE = 0;

const typeStore = {};

const options = {
	resolveType: undefined,
	mapDecoded: undefined
};

const mapDecoded = (decoded, schemaId) => {
	if (options.mapDecoded) {
		return options.mapDecoded(decoded, schemaId);
	}

	return {
		value: decoded.value,
		schemaId
	};
};

const resolveType = schema => {
	if (options.resolveType) {
		return options.resolveType(schema);
	}

	let avroSchema = schema;
	if (typeof schema === 'string') {
		avroSchema = JSON.parse(schema);
	}

	let storeKey = schema;
	if (typeof schema === 'object') {
		storeKey = JSON.stringify(schema);
	}

	let type = typeStore[storeKey];
	if (!type) {
		type = avro.Type.forSchema(avroSchema);
		typeStore[storeKey] = type;
	}

	return type;
};

/**
 * Encode a value
 * @param {String|Object} val - a value to be encode
 * @param {String|Object} schema - avro schema
 * @param {Number} schemaId - id of the schema
 * @param {Number} [optLength] - lenght of buffer to allocate
 * @returns {Buffer} Avro encoded buffer
 */
const toAvroBuffer = (val, schema, schemaId, optLength) => {
	const length = optLength || 1024;
	const buf = Buffer.alloc(length);

	const type = resolveType(schema);

	buf[0] = MAGIC_BYTE;
	buf.writeInt32BE(schemaId, 1);

	const pos = type.encode(val, buf, 5);

	if (pos < 0) {
		return toAvroBuffer(val, type, schemaId, length - pos);
	}

	return buf.slice(0, pos);
};

/**
 * Decode a buffer
 * @param {String|Object} schema - avro schema
 * @param {Buffer} encodedBuffer - avro encoded buffer
 * @returns {Object} with a value and schemaId
 */
const fromAvroBuffer = (schema, encodedBuffer) => {
	if (encodedBuffer[0] !== MAGIC_BYTE) {
		throw new TypeError('message not serialized with magic byte');
	}

	const type = resolveType(schema);

	const schemaId = encodedBuffer.readInt32BE(1);
	const decoded = type.decode(encodedBuffer, 5);
	return mapDecoded(decoded, schemaId);
};

module.exports = {
	toAvroBuffer,
	fromAvroBuffer,
	options
};

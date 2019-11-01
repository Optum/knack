const avro = require('avsc');

const MAGIC_BYTE = 0;

const typeStore = {};

const options = {
	resolveType: undefined,
	mapDecoded: undefined
};

const collectInvalidPaths = (type, val) => {
	const paths = [];
	type.isValid(val, {
		function(path, object) {
			paths.push(path.join(':') + ' is ' + object);
		}
	});
	return paths;
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

const toAvroBuffer = (val, schema, schemaId, optLength) => {
	const length = optLength || 1024;
	const buf = Buffer.alloc(length);

	const type = resolveType(schema);

	buf[0] = MAGIC_BYTE;
	buf.writeInt32BE(schemaId, 1);

	const invalidPaths = collectInvalidPaths(type, val);
	if (invalidPaths.length > 0) {
		throw new TypeError('invalid path(s) in object: ' + invalidPaths.join(', '));
	}

	const pos = type.encode(val, buf, 5);

	if (pos < 0) {
		return toAvroBuffer(val, type, schemaId, length - pos);
	}

	return buf.slice(0, pos);
};

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

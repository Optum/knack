const {fromAvroBuffer} = require('@optum/knack-avro');

const tryParse = str => {
	try {
		return JSON.parse(str);
	} catch (_) {
		return str;
	}
};

const parseData = async (schema, data) => {
	if (schema) {
		const decoded = fromAvroBuffer(schema, data);
		return decoded.value;
	}

	return tryParse(data.toString());
};

const parseRecord = async ({keySchema, valueSchema, key, value}) => {
	const parsedKey = await parseData(keySchema, key);
	const parsedValue = await parseData(valueSchema, value);
	return {
		key: parsedKey,
		value: parsedValue
	};
};

module.exports = {
	parseRecord
};

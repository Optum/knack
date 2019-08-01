const fs = require('fs-extra');
const {fromAvroBuffer, toAvroBuffer} = require('@optum/knack-avro');

const main = async (avscPath, dataPath, show = false) => {
	const avscSchemaJson = await fs.readJson(avscPath);
	const dataJson = await fs.readJson(dataPath);
	const placeHolderSchemaId = 123;

	const msgBuffer = toAvroBuffer(dataJson, avscSchemaJson, placeHolderSchemaId);

	let message = `validated data with a resulting buffer length of ${msgBuffer.length}`;

	if (show) {
		const {value} = fromAvroBuffer(avscSchemaJson, msgBuffer);
		message += `\n${JSON.stringify(value, null, 2)}`;
	}

	return {
		message
	};
};

module.exports = main;

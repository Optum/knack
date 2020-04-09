const {toJsonSchemaType} = require('./toJsonSchemaType');

const fromAvscType = avscType => {
	const jsonSchemaType = toJsonSchemaType(avscType);
	return JSON.parse(JSON.stringify(jsonSchemaType, null, 4));
};

module.exports = {
	fromAvscType
};

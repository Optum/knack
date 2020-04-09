const {fromAvscType} = require('./fromAvscType');

const JSON_SCHEMA_DRAFT_URI = 'http://json-schema.org/draft-07/schema';

const toJsonSchema = avscType => {
	const jsonSchema = fromAvscType(avscType);
	return {
		$schema: JSON_SCHEMA_DRAFT_URI,
		...jsonSchema
	};
};

module.exports = {
	toJsonSchema
};

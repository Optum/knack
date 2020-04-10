const {
	astToEsMappings,
	astToJsonSchema,
	avscToAst,
	encodeDecode,
	streams,
	toJsonSchema,
	toElasticMapping
} = require('./src');

const {
	toAvroBuffer,
	fromAvroBuffer,
	options: encodeDecodeOptions
} = encodeDecode;

module.exports = {
	astToEsMappings,
	astToJsonSchema,
	avscToAst,
	toAvroBuffer,
	fromAvroBuffer,
	encodeDecodeOptions,
	streams,
	toJsonSchema,
	toElasticMapping
};

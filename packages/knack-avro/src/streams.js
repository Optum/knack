const {toElasticMapping} = require('./avscToElasticMapping');
const {toJsonSchema} = require('./avscToJsonSchema');

module.exports = {
	avscToEsMappings: toElasticMapping,
	avscToJsonSchema: toJsonSchema
};

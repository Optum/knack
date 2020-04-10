const {toElasticMappingType} = require('./toElasticMappingType');

const fromAvscType = avscType => {
	const elasticMappingType = toElasticMappingType(avscType);
	return JSON.parse(JSON.stringify(elasticMappingType, null, 4));
};

module.exports = {
	fromAvscType
};

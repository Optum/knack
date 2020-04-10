const {fromAvscType} = require('./fromAvscType');

const toElasticMapping = avscType => {
	const elasticMapping = fromAvscType(avscType);

	let mappings = {};

	if (elasticMapping.properties) {
		mappings.properties = elasticMapping.properties;
	} else {
		mappings = elasticMapping;
	}

	return {
		mappings
	};
};

module.exports = {
	toElasticMapping
};

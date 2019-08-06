const {pipe} = require('ramda');
const avscToAst = require('./avscToAst');
const astToEsMappings = require('./astToEsMappings');
const astToJsonSchema = require('./astToJsonSchema');

module.exports = {
	avscToEsMappings: pipe(avscToAst, astToEsMappings),
	avscToJsonSchema: pipe(avscToAst, astToJsonSchema)
};

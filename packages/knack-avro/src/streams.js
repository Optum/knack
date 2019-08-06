const {pipe} = require('ramda');
const avscToAst = require('./avscToAst');
const astToEsMappings = require('./astToEsMappings');
const astToJsonSchema = require('./astToJsonSchema');
const astToJoiObject = require('./astToJoiObject');

module.exports = {
	avscToEsMappings: pipe(avscToAst, astToEsMappings),
	avscToJsonSchema: pipe(avscToAst, astToJsonSchema),
	avscToJoiObject: pipe(avscToAst, astToJoiObject)
};

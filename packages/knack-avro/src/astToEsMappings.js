const isObjectEmpty = require('is-object-empty');

const getIfNotEmpty = props => isObjectEmpty(props) ? undefined : props;

const convertFromAstType = astType => {
	if (astType === 'string') {
		// the default should be configurable
		return 'keyword';
	}

	if (astType === 'record' || astType === 'array') {
		// the default should be configurable
		return 'nested';
	}

	return astType;
};

const mapField = field => {
	const {name, typeName, avroTypeName, props} = field;
	const fieldWrapper = {};
	fieldWrapper[name] = {
		type: convertFromAstType(typeName || avroTypeName),
		properties: getIfNotEmpty(props)
	};
	return fieldWrapper;
};

const buildMappings = node => {
	const {fields} = node;
	let props = {};

	if (Array.isArray(fields)) {
		for (const field of fields) {
			props = {...props, ...buildMappings(field)};
		}
	}

	return mapField({...node, props});
};

const main = ast => {
	const mappings = buildMappings(ast.tree);
	return {
		mappings: {
			properties: mappings[ast.tree.name].properties
		}
	};
};

module.exports = main;

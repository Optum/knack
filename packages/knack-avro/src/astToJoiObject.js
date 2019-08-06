const isObjectEmpty = require('is-object-empty');

const getIfNotEmpty = props => isObjectEmpty(props) ? undefined : props;

const convertFromAstType = astType => {
	if (astType === 'record') {
		return 'object';
	}

	if (astType === 'long') {
		return 'number';
	}

	if (astType === 'map') {
		return 'object';
	}

	return astType;
};

const mapField = field => {
	const {name, typeName, avroTypeName, props} = field;
	const fieldWrapper = {};
	fieldWrapper[name] = {
		type: convertFromAstType(typeName || avroTypeName)
	};

	if (fieldWrapper[name].type === 'array') {
		fieldWrapper[name].items = getIfNotEmpty(props);
	} else {
		fieldWrapper[name].properties = getIfNotEmpty(props);
	}

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
	const {properties, type} = mappings[ast.tree.name];

	return {
		$schema: 'http://json-schema.org/schema#',
		$id: `https://${ast.namespace || 'mydomain.com'}/schemas/${ast.name}`,
		type,
		properties
	};
};

module.exports = main;

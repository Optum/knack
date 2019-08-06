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

const parseProps = ({avroItemTypeName, itemTypeName, props}, ast) => {
	const p = getIfNotEmpty(props);

	if (!p && avroItemTypeName === 'record') {
		const fieldTypeRef = ast.getAstType(itemTypeName);
		const {properties} = buildMappings(fieldTypeRef, ast);
		return properties;
	}

	return p;
};

const mapField = (field, ast) => {
	const {name, typeName, avroTypeName, avroItemTypeName, itemTypeName, props} = field;
	const fieldWrapper = {};
	fieldWrapper[name] = {
		type: convertFromAstType(typeName || avroTypeName),
		properties: parseProps({avroItemTypeName, itemTypeName, props}, ast)
	};
	return fieldWrapper;
};

const buildMappings = (node, ast) => {
	const {fields} = node;
	let props = {};

	if (Array.isArray(fields)) {
		for (const field of fields) {
			props = {...props, ...buildMappings(field, ast)};
		}
	}

	return mapField({...node, props}, ast);
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

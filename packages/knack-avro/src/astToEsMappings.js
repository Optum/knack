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

const parseProps = ({avroItemTypeName, name, props}, ast, rootName, parents) => {
	const p = getIfNotEmpty(props);

	if (!p && avroItemTypeName === 'record' && (parents.has(name) === false)) {
		const fieldTypeRef = ast.getAstType(name);
		const {properties} = buildMappings(fieldTypeRef, ast, rootName, parents);
		return properties;
	}

	return p;
};

const mapField = (field, ast, rootName, parents) => {
	const {name, typeName, avroTypeName, avroItemTypeName, itemTypeName, props} = field;
	const fieldWrapper = {};
	fieldWrapper[name] = {
		type: convertFromAstType(typeName || avroTypeName),
		properties: parseProps({avroItemTypeName, name, itemTypeName, props}, ast, rootName, parents)
	};
	return fieldWrapper;
};

const buildMappings = (node, ast, rootName, parents) => {
	const {fields, name} = node;
	let props = {};

	if (rootName === name) {
		parents.clear();
	}

	parents.add(name);

	if (Array.isArray(fields)) {
		for (const field of fields) {
			if (field.avroItemTypeName === 'record') {
				parents.add(field.name);
				props = {...props, ...buildMappings(field, ast, rootName, parents)};
			} else {
				props = {...props, ...buildMappings(field, ast, rootName, parents)};
			}
		}
	}

	return mapField({...node, props}, ast, rootName, parents);
};

const main = ast => {
	const mappings = buildMappings(ast.tree, ast, ast.tree.name, new Set());
	return {
		mappings: {
			properties: mappings[ast.tree.name].properties
		}
	};
};

module.exports = main;

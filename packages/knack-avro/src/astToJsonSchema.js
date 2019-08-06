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

const parseProps = ({avroItemTypeName, name, props}, ast, rootName, parents) => {
	const p = getIfNotEmpty(props);

	if (!p && avroItemTypeName === 'record' && (parents.has(name) === false)) {
		const fieldTypeRef = ast.getAstType(name);
		const {properties} = buildMappings(fieldTypeRef, ast, rootName, parents);
		return properties;
	}

	return p;
};

const clenseName = name => {
	if (name === 'id') {
		return '_id';
	}

	return name;
};

const mapField = (field, ast, rootName, parents) => {
	const {name, typeName, itemTypeName, avroItemTypeName, avroTypeName, props} = field;
	const fieldWrapper = {};
	const fieldKey = clenseName(name);
	fieldWrapper[fieldKey] = {
		type: convertFromAstType(typeName || avroTypeName)
	};
	const properties = parseProps({avroItemTypeName, name, itemTypeName, props}, ast, rootName, parents);
	if (fieldWrapper[fieldKey].type === 'array') {
		fieldWrapper[fieldKey].items = properties;
	} else {
		fieldWrapper[fieldKey].properties = properties;
	}

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
			props = {...props, ...buildMappings(field, ast, rootName, parents)};
		}
	}

	return mapField({...node, props}, ast, rootName, parents);
};

const main = ast => {
	const mappings = buildMappings(ast.tree, ast, ast.tree.name, new Set());
	const {properties, type} = mappings[ast.tree.name];

	return {
		$schema: 'http://json-schema.org/schema#',
		$id: `https://${ast.tree.namespace || 'mydomain.com'}/schemas/${ast.tree.name}`,
		type,
		properties
	};
};

module.exports = main;

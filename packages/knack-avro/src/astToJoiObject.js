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

const integerValidation = ({optional = true, description = null, minimum = null, maximum = null, greater = null, less = null}) => {
	let s = 'Joi.number().integer()';

	if (!optional) {
		s += '.required()';
	}

	if (minimum !== null) {
		s += `.min(${minimum})`;
	}

	if (maximum !== null) {
		s += `.max(${maximum})`;
	}

	if (greater !== null) {
		s += `.greater(${greater})`;
	}

	if (less !== null) {
		s += `.less(${less})`;
	}

	if (description !== null) {
		s += `.description("${description}")`;
	}

	return s;
};

const numberValidation = ({optional = true, description = null, minimum = null, maximum = null, greater = null, less = null}) => {
	let s = 'Joi.number()';

	if (!optional) {
		s += '.required()';
	}

	if (minimum !== null) {
		s += `.min(${minimum})`;
	}

	if (maximum !== null) {
		s += `.max(${maximum})`;
	}

	if (greater !== null) {
		s += `.greater(${greater})`;
	}

	if (less !== null) {
		s += `.less(${less})`;
	}

	if (description !== null) {
		s += `.description("${description}")`;
	}

	return s;
};

const booleanValidation = ({optional = true, description = null}) => {
	let s = 'Joi.boolean()';

	if (!optional) {
		s += '.required()';
	}

	if (description !== null) {
		s += `.description("${description}")`;
	}

	return s;
};

const dateValidation = ({optional = true, description = null}) => {
	let s = 'Joi.date()';

	if (!optional) {
		s += '.required()';
	}

	if (description !== null) {
		s += `.description("${description}")`;
	}

	return s;
};

const timeValidation = ({optional = true, description = null}) => {
	let s = 'Joi.date().timestamp()';

	if (!optional) {
		s += '.required()';
	}

	if (description !== null) {
		s += `.description("${description}")`;
	}

	return s;
};

const stringValidation = ({optional = true, description = null, minimum = null, maximum = null, valid = []}) => {
	let s = 'Joi.string()';

	if (!optional) {
		s += '.required()';
	}

	if (minimum !== null) {
		s += `.min(${minimum})`;
	}

	if (maximum !== null) {
		s += `.max(${maximum})`;
	}

	if (Array.isArray(valid) && valid.length > 0) {
		s += `.valid(${JSON.stringify(valid)})`;
	}

	if (description !== null) {
		s += `.description("${description}")`;
	}

	return s;
};

const emailValidation = ({optional = true, description = null}) => {
	let s = 'Joi.string().email()';

	if (!optional) {
		s += '.required()';
	}

	if (description !== null) {
		s += `.description("${description}")`;
	}

	return s;
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

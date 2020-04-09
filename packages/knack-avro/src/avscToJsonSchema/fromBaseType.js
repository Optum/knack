const slugify = require('@sindresorhus/slugify');

const fromBaseType = (type, typeName) => {
	const nTypeName = type.name && type.name.includes('.') ?
		type.name.split('.')[type.name.split('.').length - 1] :
		type.typeName;
	return {
		$id: `#/${slugify(`${type.name || type.typeName}`, {
			separator: '/',
			lowercase: true
		})}`,
		type: typeName || 'string',
		title: `${nTypeName}`,
		description: type.doc || ''
	};
};

module.exports = {
	fromBaseType
};

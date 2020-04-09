const fromBaseType = (type, typeName) => {
	return {
		type: typeName || 'text'
	};
};

module.exports = {
	fromBaseType
};

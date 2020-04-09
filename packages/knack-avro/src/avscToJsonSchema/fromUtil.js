const {fromBaseType} = require('./fromBaseType');

const fromBooleanType = type => {
	return fromBaseType(type, 'boolean');
};

const fromLongType = type => {
	return fromBaseType(type, 'number');
};

const fromDoubleType = type => {
	return fromBaseType(type, 'number');
};

const fromFloatType = type => {
	return fromBaseType(type, 'number');
};

const fromIntType = type => {
	return fromBaseType(type, 'integer');
};

const fromStringType = type => {
	return fromBaseType(type);
};

const fromNullType = type => {
	return fromBaseType(type, 'null');
};

// const fromFixedType = (type: avsc.types.FixedType): JsonType => {
// }
// const fromLogicalType = (type: avsc.types.LogicalType): JsonType => {
// }
// const fromMapType = (type: avsc.types.MapType): JsonObject => {
// }

const fromEnumType = type => {
	return {
		enum: type.symbols,
		...fromBaseType(type, 'string')
	};
};

module.exports = {
	fromBooleanType,
	fromLongType,
	fromDoubleType,
	fromFloatType,
	fromIntType,
	fromStringType,
	fromNullType,
	fromEnumType
};

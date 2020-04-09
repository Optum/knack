const avsc = require('avsc');
const {fromBaseType} = require('./fromBaseType');
const {
	fromEnumType,
	fromNullType,
	fromStringType,
	fromIntType,
	fromFloatType,
	fromDoubleType,
	fromLongType,
	fromBooleanType
} = require('./fromUtil');

const fromFields = fields => {
	const jsonProps = {};
	for (const field of fields) {
		jsonProps[field.name] = toJsonSchemaType(field.type);
	}

	return jsonProps;
};

const toJsonSchemaType = avscType => {
	if (avscType instanceof avsc.types.RecordType) {
		return {
			...fromBaseType(avscType, 'object'),
			required: [],
			properties: fromFields(avscType.fields)
		};
	}

	if (avscType instanceof avsc.types.ArrayType) {
		return {
			...fromBaseType(avscType, 'array'),
			items: toJsonSchemaType(avscType.itemsType)
		};
	}

	if (avscType instanceof avsc.types.EnumType) {
		return fromEnumType(avscType);
	}

	// if (avscType instanceof avsc.types.MapType) {
	//     return fromMapType(avscType)
	// }
	// if (avscType instanceof avsc.types.LogicalType) {
	//     return fromLogicalType(avscType)
	// }
	// if (avscType instanceof avsc.types.FixedType) {
	//     return fromFixedType(avscType)
	// }
	if (avscType instanceof avsc.types.UnwrappedUnionType) {
		if (avscType.types[0] instanceof avsc.types.NullType) {
			// if the first one is null, assume (for now) the last element is the "optional"
			// element type of this field
			// console.log(
			//     `${avscType.types.length}x types in uninion with first unwrapped union NullType: ${avscType.typeName}`
			// )
		}

		return toJsonSchemaType(avscType.types[avscType.types.length - 1]);
	}

	if (avscType instanceof avsc.types.WrappedUnionType) {
		if (avscType.types[0] instanceof avsc.types.NullType) {
			// if the first one is null, assume (for now) the last element is the "optional"
			// element type of this field
			// console.log(
			//     `${avscType.types.length}x types in uninion with first wrapped union NullType: ${avscType.name}`
			// )
		}

		return toJsonSchemaType(avscType.types[avscType.types.length - 1]);
	}

	if (avscType instanceof avsc.types.NullType) {
		return fromNullType(avscType);
	}

	if (avscType instanceof avsc.types.StringType) {
		return fromStringType(avscType);
	}

	if (avscType instanceof avsc.types.IntType) {
		return fromIntType(avscType);
	}

	if (avscType instanceof avsc.types.FloatType) {
		return fromFloatType(avscType);
	}

	if (avscType instanceof avsc.types.DoubleType) {
		return fromDoubleType(avscType);
	}

	if (avscType instanceof avsc.types.LongType) {
		return fromLongType(avscType);
	}

	if (avscType instanceof avsc.types.BooleanType) {
		return fromBooleanType(avscType);
	}

	return fromBaseType(avscType);
};

module.exports = {
	toJsonSchemaType
};

import avsc, {types, Type} from 'avsc'
import {fromBaseType} from './fromBaseType'
import {
    fromEnumType,
    fromNullType,
    fromStringType,
    fromIntType,
    fromFloatType,
    fromDoubleType,
    fromLongType,
    fromBooleanType
} from './fromUtil'
import {ElasticMappingType} from '../types'

const fromFields = (fields: types.Field[]): ElasticMappingType => {
    const jsonProps: ElasticMappingType = {}
    for (const field of fields) {
        jsonProps[field.name] = toElasticMappingType(field.type)
    }

    return jsonProps
}

export const toElasticMappingType = (avscType: Type): ElasticMappingType => {
    if (avscType instanceof avsc.types.RecordType) {
        return {
            ...fromBaseType('nested'),
            properties: fromFields(avscType.fields)
        }
    }

    if (avscType instanceof avsc.types.ArrayType) {
        return {
            ...fromBaseType('nested'),
            properties: toElasticMappingType(avscType.itemsType)
        }
    }

    if (avscType instanceof avsc.types.EnumType) {
        return fromEnumType()
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

        return toElasticMappingType(avscType.types[avscType.types.length - 1])
    }

    if (avscType instanceof avsc.types.WrappedUnionType) {
        if (avscType.types[0] instanceof avsc.types.NullType) {
            // if the first one is null, assume (for now) the last element is the "optional"
            // element type of this field
            // console.log(
            //     `${avscType.types.length}x types in uninion with first wrapped union NullType: ${avscType.name}`
            // )
        }

        return toElasticMappingType(avscType.types[avscType.types.length - 1])
    }

    if (avscType instanceof avsc.types.NullType) {
        return fromNullType()
    }

    if (avscType instanceof avsc.types.StringType) {
        return fromStringType()
    }

    if (avscType instanceof avsc.types.IntType) {
        return fromIntType()
    }

    if (avscType instanceof avsc.types.FloatType) {
        return fromFloatType()
    }

    if (avscType instanceof avsc.types.DoubleType) {
        return fromDoubleType()
    }

    if (avscType instanceof avsc.types.LongType) {
        return fromLongType()
    }

    if (avscType instanceof avsc.types.BooleanType) {
        return fromBooleanType()
    }

    return fromBaseType()
}

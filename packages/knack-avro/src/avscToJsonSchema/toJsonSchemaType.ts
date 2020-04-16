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
import {JsonType, ToJsonSchemaResult, ToJsonSchemaFieldsResult} from '../types'

const fromFields = (
    fields: types.Field[],
    jsonFields: JsonType[]
): ToJsonSchemaFieldsResult => {
    const required: string[] = []
    const jsonProps: JsonType = {}
    for (const field of fields) {
        const jsonField = jsonFields.find((f) => f.name === field.name)
        const jst = toJsonSchemaType(field.type, jsonField?.default)
        jsonProps[field.name] = jst.result

        if (jst.required) {
            required.push(field.name)
        }
    }

    return {
        result: jsonProps,
        required
    }
}

export const toJsonSchemaType = (
    avscType: Type,
    defaultValue?: any
): ToJsonSchemaResult => {
    if (avscType instanceof avsc.types.RecordType) {
        const json = avscType.toJSON() as JsonType
        const jstfResult = fromFields(avscType.fields, json.fields)
        return {
            result: {
                ...fromBaseType(avscType, 'object'),
                required: jstfResult.required,
                properties: jstfResult.result
            }
        }
    }

    if (avscType instanceof avsc.types.ArrayType) {
        const jst = toJsonSchemaType(avscType.itemsType, defaultValue)
        return {
            result: {
                ...fromBaseType(avscType, 'array'),
                items: jst.result
            }
        }
    }

    if (avscType instanceof avsc.types.EnumType) {
        return {
            result: fromEnumType(avscType, defaultValue)
        }
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
        const jsr = toJsonSchemaType(
            avscType.types[avscType.types.length - 1],
            defaultValue
        )
        if (avscType.types[0] instanceof avsc.types.NullType) {
            return {
                result: jsr.result,
                required: false
            }
        }

        return {
            result: jsr.result,
            required: true
        }
    }

    if (avscType instanceof avsc.types.WrappedUnionType) {
        const jsr = toJsonSchemaType(
            avscType.types[avscType.types.length - 1],
            defaultValue
        )
        if (avscType.types[0] instanceof avsc.types.NullType) {
            return {
                result: jsr.result,
                required: false
            }
        }

        return {
            result: jsr.result,
            required: true
        }
    }

    if (avscType instanceof avsc.types.NullType) {
        return {
            result: fromNullType(avscType)
        }
    }

    if (avscType instanceof avsc.types.StringType) {
        return {
            result: fromStringType(avscType, defaultValue),
            required: true
        }
    }

    if (avscType instanceof avsc.types.IntType) {
        return {
            result: fromIntType(avscType, defaultValue),
            required: true
        }
    }

    if (avscType instanceof avsc.types.FloatType) {
        return {
            result: fromFloatType(avscType, defaultValue),
            required: true
        }
    }

    if (avscType instanceof avsc.types.DoubleType) {
        return {
            result: fromDoubleType(avscType, defaultValue),
            required: true
        }
    }

    if (avscType instanceof avsc.types.LongType) {
        return {
            result: fromLongType(avscType, defaultValue),
            required: true
        }
    }

    if (avscType instanceof avsc.types.BooleanType) {
        return {
            result: fromBooleanType(avscType, defaultValue),
            required: true
        }
    }

    return {
        result: fromBaseType(avscType, defaultValue)
    }
}

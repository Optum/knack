import avsc, {types} from 'avsc'
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
import {
    JsonType,
    ToJsonSchemaResult,
    ToJsonSchemaFieldsResult,
    TypeWithAltDoc
} from '../types'

const fromFields = (
    fields: types.Field[],
    jsonFields: JsonType[]
): ToJsonSchemaFieldsResult => {
    const required: string[] = []
    const jsonProps: JsonType = {}
    for (const field of fields) {
        const jsonField = jsonFields.find((f) => f.name === field.name)
        const withAltDoc: TypeWithAltDoc = {
            type: field.type,
            altDoc: jsonField?.doc
        }

        const jst = toJsonSchemaType(withAltDoc)
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
    typeWithAltDoc: TypeWithAltDoc
): ToJsonSchemaResult => {
    const {type: avscType} = typeWithAltDoc
    if (avscType instanceof avsc.types.RecordType) {
        const json = avscType.toJSON() as JsonType
        const jstfResult = fromFields(avscType.fields, json.fields)
        return {
            result: {
                ...fromBaseType(typeWithAltDoc, 'object'),
                required: jstfResult.required,
                properties: jstfResult.result
            }
        }
    }

    if (avscType instanceof avsc.types.ArrayType) {
        const jst = toJsonSchemaType({
            type: avscType.itemsType
        })
        return {
            result: {
                ...fromBaseType(typeWithAltDoc, 'array'),
                items: jst.result
            }
        }
    }

    if (avscType instanceof avsc.types.EnumType) {
        return {
            result: fromEnumType(typeWithAltDoc)
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
        const jsr = toJsonSchemaType({
            type: avscType.types[avscType.types.length - 1],
            altDoc: typeWithAltDoc.altDoc
        })
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
        const jsr = toJsonSchemaType({
            type: avscType.types[avscType.types.length - 1],
            altDoc: typeWithAltDoc.altDoc
        })
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
            result: fromNullType(typeWithAltDoc)
        }
    }

    if (avscType instanceof avsc.types.StringType) {
        return {
            result: fromStringType(typeWithAltDoc),
            required: true
        }
    }

    if (avscType instanceof avsc.types.IntType) {
        return {
            result: fromIntType(typeWithAltDoc),
            required: true
        }
    }

    if (avscType instanceof avsc.types.FloatType) {
        return {
            result: fromFloatType(typeWithAltDoc),
            required: true
        }
    }

    if (avscType instanceof avsc.types.DoubleType) {
        return {
            result: fromDoubleType(typeWithAltDoc),
            required: true
        }
    }

    if (avscType instanceof avsc.types.LongType) {
        return {
            result: fromLongType(typeWithAltDoc),
            required: true
        }
    }

    if (avscType instanceof avsc.types.BooleanType) {
        return {
            result: fromBooleanType(typeWithAltDoc),
            required: true
        }
    }

    return {
        result: fromBaseType(typeWithAltDoc)
    }
}

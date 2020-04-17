import {types} from 'avsc'
import {fromBaseType} from './fromBaseType'
import {JsonSchemaType, JsonSchemaEnum, TypeWithAltDoc} from '../types'

export const fromBooleanType = (
    typeWithAltDoc: TypeWithAltDoc
): JsonSchemaType => {
    return fromBaseType(typeWithAltDoc, 'boolean')
}

export const fromLongType = (
    typeWithAltDoc: TypeWithAltDoc
): JsonSchemaType => {
    return fromBaseType(typeWithAltDoc, 'number')
}

export const fromDoubleType = (
    typeWithAltDoc: TypeWithAltDoc
): JsonSchemaType => {
    return fromBaseType(typeWithAltDoc, 'number')
}

export const fromFloatType = (
    typeWithAltDoc: TypeWithAltDoc
): JsonSchemaType => {
    return fromBaseType(typeWithAltDoc, 'number')
}

export const fromIntType = (typeWithAltDoc: TypeWithAltDoc): JsonSchemaType => {
    return fromBaseType(typeWithAltDoc, 'integer')
}

export const fromStringType = (
    typeWithAltDoc: TypeWithAltDoc
): JsonSchemaType => {
    return fromBaseType(typeWithAltDoc, 'string')
}

export const fromNullType = (
    typeWithAltDoc: TypeWithAltDoc
): JsonSchemaType => {
    return fromBaseType(typeWithAltDoc, 'null')
}

// const fromFixedType = (type: avsc.types.FixedType): JsonType => {
// }
// const fromLogicalType = (type: avsc.types.LogicalType): JsonType => {
// }
// const fromMapType = (type: avsc.types.MapType): JsonObject => {
// }

export const fromEnumType = (
    typeWithAltDoc: TypeWithAltDoc
): JsonSchemaEnum => {
    const type = typeWithAltDoc.type as types.EnumType
    return {
        enum: type.symbols,
        ...fromBaseType(typeWithAltDoc, 'string')
    }
}

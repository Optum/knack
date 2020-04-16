import {Type, types} from 'avsc'
import {fromBaseType} from './fromBaseType'
import {JsonSchemaType, JsonSchemaEnum} from '../types'

export const fromBooleanType = (
    type: Type,
    defaultValue: any
): JsonSchemaType => {
    return fromBaseType(type, 'boolean', defaultValue)
}

export const fromLongType = (type: Type, defaultValue: any): JsonSchemaType => {
    return fromBaseType(type, 'number', defaultValue)
}

export const fromDoubleType = (
    type: Type,
    defaultValue: any
): JsonSchemaType => {
    return fromBaseType(type, 'number', defaultValue)
}

export const fromFloatType = (
    type: Type,
    defaultValue: any
): JsonSchemaType => {
    return fromBaseType(type, 'number', defaultValue)
}

export const fromIntType = (type: Type, defaultValue: any): JsonSchemaType => {
    return fromBaseType(type, 'integer', defaultValue)
}

export const fromStringType = (
    type: Type,
    defaultValue: any
): JsonSchemaType => {
    return fromBaseType(type, 'string', defaultValue)
}

export const fromNullType = (type: Type): JsonSchemaType => {
    return fromBaseType(type, 'null')
}

// const fromFixedType = (type: avsc.types.FixedType): JsonType => {
// }
// const fromLogicalType = (type: avsc.types.LogicalType): JsonType => {
// }
// const fromMapType = (type: avsc.types.MapType): JsonObject => {
// }

export const fromEnumType = (
    type: types.EnumType,
    defaultValue?: any
): JsonSchemaEnum => {
    return {
        enum: type.symbols,
        ...fromBaseType(type, 'string', defaultValue)
    }
}

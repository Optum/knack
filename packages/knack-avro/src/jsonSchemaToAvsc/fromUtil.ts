import {fromBaseType} from './fromBaseType'
import {
    AvroSchemaType,
    JsonSchemaType,
    JsonSchemaEnum,
    JsonSchemaExtra
} from '../types'

export const fromBooleanType = (
    type: JsonSchemaType,
    extra: JsonSchemaExtra
): AvroSchemaType => {
    return fromBaseType(type, 'boolean', extra)
}

export const fromNumberType = (
    type: JsonSchemaType,
    extra: JsonSchemaExtra
): AvroSchemaType => {
    // TODO: figure out a way to allow an options object that defines "number -> double" or "number -> float" or "number -> int"
    return fromBaseType(type, 'double', extra)
}

export const fromIntType = (
    type: JsonSchemaType,
    extra: JsonSchemaExtra
): AvroSchemaType => {
    return fromBaseType(type, 'int', extra)
}

export const fromStringType = (
    type: JsonSchemaType,
    extra: JsonSchemaExtra
): AvroSchemaType => {
    return fromBaseType(type, 'string', extra)
}

export const fromNullType = (
    type: JsonSchemaType,
    extra: JsonSchemaExtra
): AvroSchemaType => {
    return fromBaseType(type, 'null', extra)
}

export const fromEnumType = (
    type: JsonSchemaEnum,
    extra: JsonSchemaExtra
): AvroSchemaType => {
    return {
        symbols: type.enum,
        ...fromBaseType(type, 'enum', extra)
    }
}

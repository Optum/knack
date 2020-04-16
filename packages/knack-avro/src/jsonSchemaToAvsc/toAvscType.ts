import {fromBaseType} from './fromBaseType'
import {
    fromEnumType,
    fromNullType,
    fromStringType,
    fromNumberType,
    fromIntType,
    fromBooleanType
} from './fromUtil'
import {
    AvroSchemaType,
    JsonSchemaArray,
    JsonSchemaType,
    JsonSchemaObject,
    JsonSchemaEnum,
    JsonSchemaExtra
} from '../types'

export const toAvroSchemaType = (
    jsonSchemaType: JsonSchemaType,
    extra: JsonSchemaExtra
): AvroSchemaType => {
    if (jsonSchemaType.type === 'object') {
        const objectType = jsonSchemaType as JsonSchemaObject
        if (!objectType.properties) {
            throw new TypeError(
                `json schema type "object" requires "properties". id: ${jsonSchemaType.$id} title: ${jsonSchemaType.title}`
            )
        }

        const fields: AvroSchemaType[] = []

        const propExtra = JSON.parse(JSON.stringify(extra)) as JsonSchemaExtra
        propExtra.required = objectType.required

        for (const propKey of Object.keys(objectType.properties)) {
            const prop = objectType.properties[propKey]
            propExtra.name = propKey
            fields.push(toAvroSchemaType(prop, propExtra))
        }

        return {
            ...fromBaseType(jsonSchemaType, 'record', extra),
            fields
        }
    }

    if (jsonSchemaType.type === 'array') {
        const arrayType = jsonSchemaType as JsonSchemaArray

        if (!arrayType.items || !arrayType.items.type) {
            throw new TypeError(
                `json schema type "array" requires "items" with "items.type" to be set when converting to avsc (avro). id: ${jsonSchemaType.$id} title: ${jsonSchemaType.title}`
            )
        }

        return {
            ...fromBaseType(jsonSchemaType, 'array', extra),
            items: toAvroSchemaType(arrayType.items, extra)
        }
    }

    if (jsonSchemaType.type === 'number') {
        return fromNumberType(jsonSchemaType, extra)
    }

    if (jsonSchemaType.type === 'string') {
        const enumType = jsonSchemaType as JsonSchemaEnum

        if (!enumType.enum) {
            return fromStringType(jsonSchemaType, extra)
        }

        return fromEnumType(enumType, extra)
    }

    if (jsonSchemaType.type === 'integer') {
        return fromIntType(jsonSchemaType, extra)
    }

    if (jsonSchemaType.type === 'boolean') {
        return fromBooleanType(jsonSchemaType, extra)
    }

    if (jsonSchemaType.type === 'null') {
        return fromNullType(jsonSchemaType, extra)
    }

    throw new TypeError(`unknown json schema type: ${jsonSchemaType.type}`)
}

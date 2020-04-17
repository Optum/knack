import {Type} from 'avsc'
import {fromAvscType} from './fromAvscType'
import {JsonSchemaType} from '../types'

const JSON_SCHEMA_DRAFT_URI = 'http://json-schema.org/draft-07/schema'

export const toJsonSchema = (avscType: Type): JsonSchemaType => {
    const jsonSchema = fromAvscType(avscType)

    return {
        $schema: JSON_SCHEMA_DRAFT_URI,
        ...jsonSchema
    }
}

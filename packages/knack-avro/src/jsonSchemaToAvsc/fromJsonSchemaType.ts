import {toAvroSchemaType} from './toAvscType'
import {JsonSchemaType, AvroSchemaType} from '../types'

export const fromJsonSchemaType = (
    jsonSchemaType: JsonSchemaType
): AvroSchemaType => {
    const avscType = toAvroSchemaType(jsonSchemaType, {})
    return avscType
}

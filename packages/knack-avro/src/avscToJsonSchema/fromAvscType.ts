import {Type} from 'avsc'
import {toJsonSchemaType} from './toJsonSchemaType'
import {JsonSchemaType} from '../types'

export const fromAvscType = (avscType: Type): JsonSchemaType => {
    const jsonSchemaType = toJsonSchemaType(avscType)
    return JSON.parse(JSON.stringify(jsonSchemaType.result)) as JsonSchemaType
}

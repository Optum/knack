import avsc, {Type} from 'avsc'
import {fromJsonSchemaType} from './fromJsonSchemaType'
import {JsonSchemaType} from '../types'

const DEFAULT_AVRO_SCHEMA_NAMESPACE = 'io.knack.avro'

export const toAvscType = (jsonSchemaType: JsonSchemaType): Type => {
    let avroSchemaForError: any = null
    try {
        const avroSchemaType = fromJsonSchemaType(jsonSchemaType)
        avroSchemaType.namespace = DEFAULT_AVRO_SCHEMA_NAMESPACE
        avroSchemaForError = avroSchemaType
        return avsc.Type.forSchema(avroSchemaType as any)
    } catch (error) {
        if (avroSchemaForError) {
            console.log('invalid avro schema', avroSchemaForError)
        }

        throw error
    }
}

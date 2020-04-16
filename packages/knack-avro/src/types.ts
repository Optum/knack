import {Type, Schema} from 'avsc'

export type JsonType = {
    [x: string]: any
}

export type Decoded = {
    value: JsonType
    offset: number
}

export type MappedDecoded = {
    value: JsonType
    schemaId: number
}

export type MapDecoded = (
    decoded: Decoded,
    schemaId: number
) => MappedDecoded | JsonType

export type ResolveType = (schema: Schema) => Type

export interface EncodeDecodeOptions {
    resolveType?: ResolveType
    mapDecoded?: MapDecoded
}

export type TypeStore = {
    [x: string]: Type
}

export type Defaults = string | null

export interface JsonSchemaType {
    $schema?: string
    $id: string
    type: string
    title: string
    description: string
    default?: Defaults
    examples?: Defaults
}

export interface JsonSchemaProperties {
    [x: string]: JsonSchemaType
}

export type JsonSchemaString = JsonSchemaType
export type JsonSchemaBoolean = JsonSchemaType
export type JsonSchemaInt = JsonSchemaType
export type JsonSchemaNumber = JsonSchemaType

export interface JsonSchemaRange extends JsonSchemaType {
    minimum?: string
    exclusiveMinimum?: string
    maximum?: string
    exclusiveMaximum?: string
}

export interface JsonSchemaEnum extends JsonSchemaType {
    enum: string[]
}

export interface JsonSchemaArray extends JsonSchemaType {
    items: JsonSchemaType
}

export interface JsonSchemaObject extends JsonSchemaType {
    required: string[]
    properties: JsonSchemaProperties
}

export interface ElasticMappingType {
    [x: string]: ElasticMappingType | string | undefined
    type?: string
    properties?: ElasticMappingType
}

export interface ElasticMappingWrapperType {
    mappings: ElasticMappingType
}

export interface AvroSchemaType {
    type: string | string[]
    name: string
    doc?: string
    namespace?: string
    default?: string | number | boolean | null
    symbols?: string[]
    fields?: AvroSchemaType[]
    items?: AvroSchemaType
}

export interface JsonSchemaExtra {
    name?: string
    required?: string[]
}

export interface ToJsonSchemaResult {
    result: JsonSchemaType | JsonSchemaObject | JsonSchemaArray
    required?: boolean
}

export interface ToJsonSchemaFieldsResult {
    result: JsonType
    required?: string[]
}

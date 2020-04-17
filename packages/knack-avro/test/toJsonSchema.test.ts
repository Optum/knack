import {join} from 'path'
import test from 'ava'
import fs from 'fs-extra'
import avsc from 'avsc'
import {toJsonSchema} from '../src'

const testAvscWithSimpleFilePath = join(
    __dirname,
    'data',
    'avsc',
    'withSimpleArray.json'
)
const testAvscWithObjs = join(
    __dirname,
    'data',
    'avsc',
    'withObjectArraysAndProps.json'
)
const testJsonSchemaWithSimpleArrayFilePath = join(
    __dirname,
    'data',
    'jsonSchema',
    'fromAvscWithSimpleArray.json'
)
const testJsonSchemaWithObjsPath = join(
    __dirname,
    'data',
    'jsonSchema',
    'fromAvscWithObjs.json'
)

test('create json schema from avsc type as expected', async (t) => {
    const avscTypeJson = await fs.readJson(testAvscWithSimpleFilePath)
    const avscType = avsc.Type.forSchema(avscTypeJson)
    const jsonSchema = toJsonSchema(avscType)
    const testJsonSchema = await fs.readJson(
        testJsonSchemaWithSimpleArrayFilePath
    )
    t.is(
        JSON.stringify(jsonSchema),
        JSON.stringify(testJsonSchema),
        'result json schema did not equal test json schema'
    )
})

test('create json schema with complex objects from avsc type as expected', async (t) => {
    const avscTypeJson = await fs.readJson(testAvscWithObjs)
    const avscType = avsc.Type.forSchema(avscTypeJson)
    const jsonSchema = toJsonSchema(avscType)

    const testJsonSchema = await fs.readJson(testJsonSchemaWithObjsPath)
    t.is(
        JSON.stringify(jsonSchema),
        JSON.stringify(testJsonSchema),
        'result json schema did not equal test json schema'
    )
})

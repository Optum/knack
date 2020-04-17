import {join} from 'path'
import test from 'ava'
import fs from 'fs-extra'
import avsc from 'avsc'
import {toJsonSchema} from '../src'

const testAvscFilePath = join(__dirname, 'data', 'avsc', 'withSimpleArray.json')
const testJsonSchemaFilePath = join(
    __dirname,
    'data',
    'jsonSchema',
    'fromAvscWithSimpleArray.json'
)

test('create json schema from avsc type as expected', async (t) => {
    const avscTypeJson = await fs.readJson(testAvscFilePath)
    const avscType = avsc.Type.forSchema(avscTypeJson)
    const jsonSchema = toJsonSchema(avscType)
    const testJsonSchema = await fs.readJson(testJsonSchemaFilePath)
    t.is(
        JSON.stringify(jsonSchema),
        JSON.stringify(testJsonSchema),
        'result json schema did not equal test json schema'
    )
})

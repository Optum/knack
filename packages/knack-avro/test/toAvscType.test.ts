import {join} from 'path'
import test from 'ava'
import fs from 'fs-extra'
import avsc from 'avsc'
import {toAvscType, JsonSchemaType} from '../src'

const testAvscFilePath = join(__dirname, 'testAvsc2.json')
const testJsonSchemaFilePath = join(__dirname, 'testJsonSchema2.json')

test('create avsc type from json schema', async (t) => {
    const avscTypeJson = await fs.readJson(testAvscFilePath)
    const avscType = avsc.Type.forSchema(avscTypeJson)
    const testJsonSchema = await fs.readJson(testJsonSchemaFilePath)

    const testAvscType = toAvscType(testJsonSchema as JsonSchemaType)

    t.is(
        JSON.stringify(avscType),
        JSON.stringify(testAvscType),
        'result avsc type did not match expected'
    )
})

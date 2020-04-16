import {join} from 'path'
import test from 'ava'
import fs from 'fs-extra'
import {fromAvroBuffer, toAvroBuffer} from '../src'
import {TestData} from './types'
import {MappedDecoded} from '../src/types'

const testAvscFilePath = join(__dirname, 'testAvsc.json')
const testDataFilePath = join(__dirname, 'testData.json')

test('encode decode data with no nulls', async (t) => {
    const avscSchemaJson = await fs.readJson(testAvscFilePath)
    const dataJson = (await fs.readJson(testDataFilePath)) as TestData
    const placeHolderSchemaId = 123

    const messageBuffer = toAvroBuffer(
        dataJson,
        avscSchemaJson,
        placeHolderSchemaId
    )

    t.true(messageBuffer.length > 0, 'expected buffer size range to meet')

    const {value} = fromAvroBuffer(
        avscSchemaJson,
        messageBuffer
    ) as MappedDecoded

    t.truthy(value, 'value must be defined')

    t.is(value.content, dataJson.content, 'input did not matchout output')
    t.is(!value.channel, !dataJson.channel, 'input did not matchout output')
})

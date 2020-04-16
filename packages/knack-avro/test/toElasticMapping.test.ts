import {join} from 'path'
import test from 'ava'
import fs from 'fs-extra'
import avsc from 'avsc'
import {toElasticMapping} from '../src'

const testAvscFilePath = join(__dirname, 'testAvsc.json')
const testEsMappingsFilePath = join(__dirname, 'testEsMapping.json')

test('create elastic mapping from avsc type as expected', async (t) => {
    const avscTypeJson = await fs.readJson(testAvscFilePath)
    const avscType = avsc.Type.forSchema(avscTypeJson)

    const elasticMapping = toElasticMapping(avscType)

    const testEsMappings = await fs.readJson(testEsMappingsFilePath)
    t.is(
        JSON.stringify(elasticMapping),
        JSON.stringify(testEsMappings),
        'result es mapping did not equal test es mapping'
    )
})

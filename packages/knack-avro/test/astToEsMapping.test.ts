import test from 'ava'
import {astToEsMappings} from '../src'

test('astToEsMapping should throw because it is no longer used', (t) => {
    t.throws(astToEsMappings)
})

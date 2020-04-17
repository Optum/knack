import test from 'ava'
import {astToJsonSchema} from '../src'

test('astToJsonSchema should throw because it is no longer used', (t) => {
    t.throws(astToJsonSchema)
})

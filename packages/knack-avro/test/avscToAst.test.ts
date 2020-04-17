import test from 'ava'
import {avscToAst} from '../src'

test('avscToAst should throw because it is no longer used', (t) => {
    t.throws(avscToAst)
})

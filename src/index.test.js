import test from 'ava'
import memoize from './index'

const stringMaps = [{}, Map]
const objectMaps = [Map, WeakMap]

test('single argument -> string', t => {
  for (let map of stringMaps) {
    const fn = memoize([map], foo => {
      return [foo]
    })

    const result = fn('foo')
    t.is(result, fn('foo'))
    t.is(result[0], 'foo')
    t.not(result, fn('bar'))
  }
})

test('single argument -> object', t => {
  for (let map of objectMaps) {
    const fn = memoize([map], foo => {
      return [foo]
    })

    const val = {}
    const result = fn(val)
    t.is(result, fn(val))
    t.is(result[0], val)
    t.not(result, fn({}))
  }
})

test('two arguments -> string', t => {
  for (let map1 of stringMaps) {
    for (let map2 of stringMaps) {
      const fn = memoize([map1, map2], foo => {
        return [foo]
      })

      const result = fn('foo', 'bar')
      t.is(result, fn('foo', 'bar'))
      t.is(result[0], 'foo')
      t.not(result, fn('bar', 'bar'))
      t.not(result, fn('foo', 'baz'))
    }
  }
})

test('two arguments -> object', t => {
  for (let map1 of objectMaps) {
    for (let map2 of objectMaps) {
      const fn = memoize([map1, map2], foo => {
        return [foo]
      })

      const valA = {},
        valB = {}
      const result = fn(valA, valB)
      t.is(result, fn(valA, valB))
      t.is(result[0], valA)
      t.not(result, fn(valA, {}))
      t.not(result, fn({}, valB))
    }
  }
})

test('several arguments -> string', t => {
  for (let map1 of stringMaps) {
    for (let map2 of stringMaps) {
      for (let map3 of stringMaps) {
        const fn = memoize([map1, map2, map3], foo => {
          return [foo]
        })

        const result = fn('foo', 'bar', 'baz')
        t.is(result, fn('foo', 'bar', 'baz'))
        t.is(result[0], 'foo')
        t.not(result, fn('foo', 'bar', 'boz'))
        t.not(result, fn('foo', 'buz', 'bar'))
      }
    }
  }
})

test('several arguments -> object', t => {
  for (let map1 of objectMaps) {
    for (let map2 of objectMaps) {
      for (let map3 of objectMaps) {
        const fn = memoize([map1, map2, map3], foo => {
          return [foo]
        })

        const valA = {},
          valB = {},
          valC = {}
        const result = fn(valA, valB, valC)
        t.is(result, fn(valA, valB, valC))
        t.is(result[0], valA)
        t.not(result, fn(valA, valB, {}))
        t.not(result, fn(valA, {}, {}))
      }
    }
  }
})

import memoize from './index'

const stringMaps = [{}, Map]
const objectMaps = [Map, WeakMap]

test('single argument -> string', () => {
  for (let map of stringMaps) {
    const fn = memoize([map], foo => {
      return [foo]
    })

    const result = fn('foo')
    expect(result).toBe(fn('foo'))
    expect(result[0]).toBe('foo')
    expect(result).not.toBe(fn('bar'))
  }
})

test('single argument -> object', () => {
  for (let map of objectMaps) {
    const fn = memoize([map], foo => {
      return [foo]
    })

    const val = {}
    const result = fn(val)
    expect(result).toBe(fn(val))
    expect(result[0]).toBe(val)
    expect(result).not.toBe(fn({}))
  }
})

test('two arguments -> string', () => {
  for (let map1 of stringMaps) {
    for (let map2 of stringMaps) {
      const fn = memoize([map1, map2], foo => {
        return [foo]
      })

      const result = fn('foo', 'bar')
      expect(result).toBe(fn('foo', 'bar'))
      expect(result[0]).toBe('foo')
      expect(result).not.toBe(fn('bar', 'bar'))
      expect(result).not.toBe(fn('foo', 'baz'))
    }
  }
})

test('two arguments -> object', () => {
  for (let map1 of objectMaps) {
    for (let map2 of objectMaps) {
      const fn = memoize([map1, map2], foo => {
        return [foo]
      })

      const valA = {},
        valB = {}
      const result = fn(valA, valB)
      expect(result).toBe(fn(valA, valB))
      expect(result[0]).toBe(valA)
      expect(result).not.toBe(fn(valA, {}))
      expect(result).not.toBe(fn({}, valB))
    }
  }
})

test('several arguments -> string', () => {
  for (let map1 of stringMaps) {
    for (let map2 of stringMaps) {
      for (let map3 of stringMaps) {
        const fn = memoize([map1, map2, map3], foo => {
          return [foo]
        })

        const result = fn('foo', 'bar', 'baz')
        expect(result).toBe(fn('foo', 'bar', 'baz'))
        expect(result[0]).toBe('foo')
        expect(result).not.toBe(fn('foo', 'bar', 'boz'))
        expect(result).not.toBe(fn('foo', 'buz', 'bar'))
      }
    }
  }
})

test('several arguments -> object', () => {
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
        expect(result).toBe(fn(valA, valB, valC))
        expect(result[0]).toBe(valA)
        expect(result).not.toBe(fn(valA, valB, {}))
        expect(result).not.toBe(fn(valA, {}, {}))
      }
    }
  }
})

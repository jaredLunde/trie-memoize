import memoize from './index'

const stringMaps = [{}, Map]
const objectMaps = [Map, WeakMap]

test('single argument -> string', () => {
  for (const map of stringMaps) {
    const fn = memoize([map], (foo: string): string[] => {
      return [foo]
    })

    const result = fn('foo')
    expect(result).toBe(fn('foo'))
    expect(result[0]).toBe('foo')
    expect(result).not.toBe(fn('bar'))
  }
})

test('single argument -> object', () => {
  for (const map of objectMaps) {
    const fn = memoize([map], (foo) => {
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
  for (const map1 of stringMaps) {
    for (const map2 of stringMaps) {
      const fn = memoize([map1, map2], (foo, bar) => {
        return [foo, bar]
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
  for (const map1 of objectMaps) {
    for (const map2 of objectMaps) {
      const fn = memoize([map1, map2], (foo, bar) => {
        return [foo, bar]
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
  for (const map1 of stringMaps) {
    for (const map2 of stringMaps) {
      for (const map3 of stringMaps) {
        const fn = memoize([map1, map2, map3], (foo, bar, baz) => {
          return [foo, bar, baz]
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
  for (const map1 of objectMaps) {
    for (const map2 of objectMaps) {
      for (const map3 of objectMaps) {
        const fn = memoize([map1, map2, map3], (foo, bar, baz) => {
          return [foo, bar, baz]
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

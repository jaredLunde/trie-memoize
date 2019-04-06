# trie-memoize
A memoization algorithm in which each function argument represents a new
key in a mapping, creating a trie of caches - the depth of which defined
by your setup. As such, it is incredibly fast with O(n arguments) lookup
performance and very memory-efficient when structures like `WeakMaps` are
used.

This memoization function only works for functions where the exact
number of arguments is known and constant.

## Installation
`yarn add trie-memoize` or `npm i trie-memoize`

## Usage
```js
const m1 = memoize([{}], v => v.toUpperCase())
m1('foo')  // FOO uncached
m1('foo')  // FOO cached

const m2 = memoize([{}, Map], (v1, v2) => `${v1}-${v2}`)
m2('foo', 'bar')  // foo-bar, uncached
m2('foo', 'bar')  // foo-bar, cached

const m3 = memoize(
  [WeakMap, Map, WeakMap], 
  (v1, v2, v3) => `${JSON.stringify(v1)}-${JSON.stringify(v1)}-${JSON.stringify(v3)}`
)
let v1 = {}, v2 = 'foo', v3 = {}
m3(v1, v2, v3)  // {}-"foo"-{} uncached
m3(v1, v2, v3)  // {}-"foo"-{} cached
```

### `memoize(caches <Array>, fn <Function>)`
- `caches` `<Array>`
    - An array of plain objects or constructors used for caching each level of the tree.
      The first array element will be the cache for the first argument of the function,
      call, and so on. Therefore, the length of this array must be the same as the 
      length of arguments your memoized function accepts.
    - You may provide your own cache (i.e. not `Map`, `WeakMap`, `{}`). The only requirement
      is that it has `get` and `set` methods.
- `fn` `<Function>` 
    - The function being memoized

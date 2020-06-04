<hr>
<div align="center">
  <h1 align="center">
    trie-memoize
  </h1>
</div>

<p align="center">
  <a href="https://bundlephobia.com/result?p=trie-memoize">
    <img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/trie-memoize?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Types" href="https://www.npmjs.com/package/trie-memoize">
    <img alt="Types" src="https://img.shields.io/npm/types/trie-memoize?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Code coverage report" href="https://codecov.io/gh/jaredLunde/trie-memoize">
    <img alt="Code coverage" src="https://img.shields.io/codecov/c/gh/jaredLunde/trie-memoize?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Build status" href="https://travis-ci.org/jaredLunde/trie-memoize">
    <img alt="Build status" src="https://img.shields.io/travis/jaredLunde/trie-memoize?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/trie-memoize">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/trie-memoize?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="License" href="https://jaredlunde.mit-license.org/">
    <img alt="MIT License" src="https://img.shields.io/npm/l/trie-memoize?style=for-the-badge&labelColor=24292e">
  </a>
</p>

<pre align="center">npm i trie-memoize</pre>
<hr>

A memoization algorithm in which each function argument represents a new
key in a mapping, creating a trie of caches - the depth of which defined
by your setup. It is very quick with its `O(n arguments)` lookup
performance and is memory-efficient, particularly when `WeakMaps` are used.

This memoization function only works for functions where the exact
number of arguments is known and constant.

## Quick Start

```js
const m1 = memoize([{}], (v) => v.toUpperCase())
m1('foo') // FOO uncached
m1('foo') // FOO cached

const m2 = memoize([{}, Map], (v1, v2) => `${v1}-${v2}`)
m2('foo', 'bar') // foo-bar, uncached
m2('foo', 'bar') // foo-bar, cached

const m3 = memoize(
  [WeakMap, Map, WeakMap],
  (v1, v2, v3) =>
    `${JSON.stringify(v1)}-${JSON.stringify(v1)}-${JSON.stringify(v3)}`
)

const v1 = {}
const v2 = 'foo'
const v3 = {}
m3(v1, v2, v3) // {}-"foo"-{} uncached
m3(v1, v2, v3) // {}-"foo"-{} cached
```

## API

### `memoize(caches, fn)`

| Argument | Type                 | Description                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| caches   | `CacheConstructor[]` | An array of plain objects or map-like constructors (Map, WeakMap, some custom map w/ get + set methods) used for caching each level of the tree. The first array element will be the cache for the first argument of the function, call, and so on. Therefore, the length of this array must be the same as the length of arguments your memoized function accepts, or at least as deep as you'd like to cache. |
| fn       | `(...args: T) => U`  | The function you'd like to memoize                                                                                                                                                                                                                                                                                                                                                                              |

### Types

#### CacheConstructor

```ts
export type CacheConstructor =
  | MapConstructor
  | WeakMapConstructor
  | MapLike
  | Record<any, any>
```

## LICENSE

MIT

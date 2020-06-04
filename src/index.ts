export interface MapLike {
  new (...args: any[]): any
}

export type CacheConstructor =
  | MapConstructor
  | WeakMapConstructor
  | MapLike
  | Record<any, any>

interface Cache<K = any, V = any> {
  set: (k: K, v: V) => V
  get: (k: K) => V
}

const createCache = (obj: CacheConstructor): Cache => {
  try {
    // @ts-ignore
    return new obj()
  } catch (e) {
    const cache: Record<string, any> = {}

    return {
      set(k, v): void {
        cache[k] = v
      },
      get(k): any {
        return cache[k]
      },
    }
  }
}

const memo = (
  constructors: CacheConstructor[]
): {s: Cache['set']; g: Cache['get']} => {
  const depth = constructors.length,
    baseCache = createCache(constructors[0])
  let base: any
  let map: any
  let i: number
  let node: typeof baseCache
  const one = depth === 1
  // quicker access for one and two-argument functions
  const g1 = (args: IArguments): any =>
    (base = baseCache.get(args[0])) === void 0 || one ? base : base.get(args[1])
  const s1 = (args: IArguments, value: any): any => {
    if (one) baseCache.set(args[0], value)
    else {
      if ((base = baseCache.get(args[0])) === void 0) {
        map = createCache(constructors[1])
        map.set(args[1], value)
        baseCache.set(args[0], map)
      } else {
        base.set(args[1], value)
      }
    }

    return value
  }

  const g2 = (args: IArguments): any => {
    node = baseCache

    for (i = 0; i < depth; i++)
      if ((node = node.get(args[i])) === void 0) return

    return node
  }

  const s2 = (args: IArguments, value: any): any => {
    node = baseCache

    for (i = 0; i < depth - 1; i++) {
      if ((map = node.get(args[i])) === void 0) {
        map = createCache(constructors[i + 1])
        node.set(args[i], map)
        node = map
      } else {
        node = map
      }
    }

    node.set(args[depth - 1], value)
    return value
  }

  return depth < 3 ? {g: g1, s: s1} : {g: g2, s: s2}
}

const memoize = <T extends any[], U extends any>(
  mapConstructors: CacheConstructor[],
  fn: (...args: T) => U
): ((...args: T) => U) => {
  let item: U
  const {g, s} = memo(mapConstructors)
  return function () {
    return (item = g(arguments)) === void 0
      ? s(arguments, fn.apply(null, arguments as any))
      : item
  }
}

export default memoize

export interface MapLike {
  new (...args: any[])
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
    const cache = {}

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
  let g: (args: IArguments) => any, s: (args: IArguments, value: any) => any
  let base: any

  if (depth < 3) {
    // quicker access for one and two-argument functions
    const one = depth === 1

    g = (args: IArguments): any =>
      (base = baseCache.get(args[0])) === void 0 || one
        ? base
        : base.get(args[1])

    s = (args: IArguments, value: any): any => {
      if (one) baseCache.set(args[0], value)
      else {
        if ((base = baseCache.get(args[0])) === void 0) {
          const map = createCache(constructors[1])
          map.set(args[1], value)
          baseCache.set(args[0], map)
        } else {
          base.set(args[1], value)
        }
      }

      return value
    }
  } else {
    let i: number, node: typeof baseCache

    g = (args: IArguments): any => {
      node = baseCache

      for (i = 0; i < args.length; i++)
        if ((node = node.get(args[i])) === void 0) return

      return node
    }

    s = (args: IArguments, value: any): any => {
      node = baseCache
      const len = args.length
      let map: any

      for (i = 0; i < len - 1; i++) {
        if ((map = node.get(args[i])) === void 0) {
          map = createCache(constructors[i + 1])
          node.set(args[i], map)
          node = map
        } else {
          node = map
        }
      }

      node.set(args[len - 1], value)
      return value
    }
  }

  return {g, s}
}

function memoize<T extends (...args: any[]) => any>(
  mapConstructors: CacheConstructor[],
  fn: T
): T {
  let item: ReturnType<T>
  const cache = memo(mapConstructors)
  return function () {
    return (item = cache.g(arguments)) === void 0
      ? cache.s(arguments, fn.apply(null, arguments))
      : item
  } as T
}

export default memoize

export interface MapLike {
  new (...args: any[])
}

export type CacheConstructor =
  | MapConstructor
  | WeakMapConstructor
  | MapLike
  | Record<any, any>

export interface Cache {
  set: (k: any, v: any) => any
  get: (k: any) => any
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

const Cache = (constructors: CacheConstructor[]): Cache => {
  const depth = constructors.length,
    baseCache = createCache(constructors[0])
  let get, set

  // quicker access for one and two-argument functions
  if (depth === 1) {
    get = (args: IArguments): any => baseCache.get(args[0])
    set = (args: IArguments, v: any): any => {
      baseCache.set(args[0], v)
      return v
    }
  } else if (depth === 2) {
    get = (args: IArguments): any => {
      const base = baseCache.get(args[0])
      return base === void 0 ? base : base.get(args[1])
    }

    set = (args: IArguments, value: any): any => {
      const base = baseCache.get(args[0])
      if (base === void 0) {
        const map = createCache(constructors[1])
        map.set(args[1], value)
        baseCache.set(args[0], map)
      } else {
        base.set(args[1], value)
      }

      return value
    }
  } else {
    let i, node

    get = (args: IArguments): any => {
      node = baseCache

      for (i = 0; i < args.length; i++) {
        node = node.get(args[i])
        if (node === void 0) return
      }

      return node
    }

    set = (args: IArguments, value: any): any => {
      node = baseCache

      for (i = 0; i < args.length - 1; i++) {
        let map: any = node.get(args[i])

        if (map === void 0) {
          map = createCache(constructors[i + 1])
          node.set(args[i], map)
          node = map
        } else {
          node = map
        }
      }

      node.set(args[args.length - 1], value)
      return value
    }
  }

  return {get, set}
}

function memoize<T extends (...args: any[]) => any>(
  mapConstructors: CacheConstructor[],
  fn: T
): T {
  const cache = Cache(mapConstructors)
  return function() {
    const item = cache.get(arguments)
    return item === void 0
      ? cache.set(arguments, fn.apply(null, arguments))
      : item
  } as T
}

export default memoize

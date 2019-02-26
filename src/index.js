import isPlainObject from 'is-plain-object'


const createCache = obj => {
  if (isPlainObject(obj)) {
    const cache = {}
    return {
      get: k => cache[k],
      set: (k, v) => cache[k] = v
    }
  }

  return new obj()
}

const Cache = constructors => {
  const depth = constructors.length
  const baseCache = createCache(constructors[0])
  let get, set

  // quicker access for one and two-argument functions
  if (depth === 1) {
    get = k => baseCache.get(k[0])
    set = (k, v) => {
      baseCache.set(k[0], v)
      return v
    }
  }
  else if (depth === 2) {
    get = args => {
      const base = baseCache.get(args[0])
      return base === void 0 ? base : base.get(args[1])
    }

    set = (args, value) => {
      const base = baseCache.get(args[0])
      if (base === void 0) {
        const map = createCache(constructors[1])
        map.set(args[1], value)
        baseCache.set(args[0], map)
      }
      else {
        base.set(args[1], value)
      }

      return value
    }
  }
  else {
    let i
    
    get = args => {
      let node = baseCache
      
      for (i = 0; i < args.length; i++) {
        node = node.get(args[i])
        if (node === void 0) return
      }
      
      return node
    }

    set = (args, value) => {
      let node = baseCache

      for (i = 0; i < args.length - 1; i++) {
        let map = node.get(args[i])
        
        if (map === void 0) {
          map = createCache(constructors[i])
          node.set(args[i], map)
          node = map
        }
        else {
          node = map
        }
      }

      node.set(args[args.length - 1], value)
      return value
    }
  }

  return {get, set}
}


function memoize (mapConstructors, fn) {
  const cache = Cache(mapConstructors)

  return function () {
    const item = cache.get(arguments)
    return item === void 0 ? cache.set(arguments, fn.apply(this, arguments)) : item
  }
}

export default memoize
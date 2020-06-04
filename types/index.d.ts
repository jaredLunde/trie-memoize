export interface MapLike {
  new (...args: any[]): any
}
export declare type CacheConstructor =
  | MapConstructor
  | WeakMapConstructor
  | MapLike
  | Record<any, any>
declare const memoize: <T extends any[], U extends unknown>(
  mapConstructors: CacheConstructor[],
  fn: (...args: T) => U
) => (...args: T) => U
export default memoize

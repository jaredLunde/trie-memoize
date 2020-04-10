export interface MapLike {
  new (...args: any[]): any
}
export declare type CacheConstructor =
  | MapConstructor
  | WeakMapConstructor
  | MapLike
  | Record<any, any>
declare function memoize<T extends (...args: any[]) => any>(
  mapConstructors: CacheConstructor[],
  fn: T
): T
export default memoize

/**
 * Returns `true` if type `T` is `any`
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * Exclude `any` type from a tuple `T`
 */
export type NoAny<T extends any[]> = {
  [P in keyof T]: IsAny<T[P]> extends true ? never : T[P];
};

/**
 * Allows to produce union with any types that are excluded
 */
export type SafeUnion<T extends any[]> = NoAny<T>[number];

/**
 * Allows to produce intersection with any types that are excluded
 */
export type SafeIntersection<T extends any[]> = UnionToIntersection<
  SafeUnion<T>
>;

/**
 * Represents mutable and immutable array type
 */
export type AnyArray<T> = ReadonlyArray<T> | Array<T>;

/**
 * Infers type from any array
 */
export type InferArray<T> = T extends AnyArray<infer A> ? A : never;

/**
 * Convert any union type intersection type
 */
export type UnionToIntersection<U> = (U extends any
? (k: U) => void
: never) extends (k: infer I) => void
  ? I
  : never;

/**
 * Merges multiple intersections into single object type
 */
export type MergeIntersection<T> = T extends any
  ? { [K in keyof T]: T[K] }
  : never;

/**
 * Filter all keys from type `T` whose type extends `K`
 */
export type FilterKeysByType<T, K> = {
  [P in keyof T]: T[P] extends K ? never : P;
}[keyof T];

/**
 * Exclude all properties from type `T` whose type extends `K`
 */
export type ExcludePropsByType<T, K> = { [P in FilterKeysByType<T, K>]: T[P] };

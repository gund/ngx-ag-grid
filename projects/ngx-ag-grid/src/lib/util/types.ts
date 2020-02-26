type UnionToIntersection<U> = (U extends any
? (arg: U) => void
: never) extends (arg: infer I) => void
  ? I
  : never;

type IsAny<T> = 0 extends 1 & T ? true : false;

type NoAny<T extends any[]> = {
  [P in keyof T]: IsAny<T[P]> extends true ? never : T[P];
};

/** Allows to produce union with any types that are excluded */
export type SafeUnion<T extends any[]> = NoAny<T>[number];

/** Allows to produce intersection with any types that are excluded */
export type SafeIntersection<T extends any[]> = UnionToIntersection<
  SafeUnion<T>
>;

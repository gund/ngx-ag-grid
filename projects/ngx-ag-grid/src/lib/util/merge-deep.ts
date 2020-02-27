export function mergeDeep<T1, T2>(obj1: T1, obj2: T2): Merge<[T1, T2]> {
  if (obj1 == null || typeof obj1 !== 'object') {
    return obj2 as any;
  }
  if (obj2 == null || typeof obj2 !== 'object') {
    return obj1 as any;
  }

  const o1 = obj1 as any;
  const o2 = obj2 as any;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = mergeArrays(keys1, keys2);
  const newObj = {} as any;

  for (const key of allKeys) {
    if (key in obj1 && key in obj2) {
      newObj[key] = mergeDeep(o1[key], o2[key]);
    } else if (key in obj1) {
      newObj[key] = o1[key];
    } else {
      newObj[key] = o2[key];
    }
  }

  return newObj;
}

export function mergeArrays<T = any>(...arrays: T[][]): T[] {
  const set = new Set<T>();

  for (const array of arrays) {
    for (const item of array) {
      set.add(item);
    }
  }

  return Array.from(set);
}

/**
 * Simple merge of two types where first `T1` will override second `T2`
 */
export type MergeSimple<T1, T2> = T1 & Omit<T2, keyof T1>;

/**
 * Recursive merge of array of types where first types take over the last ones
 */
export type Merge<T extends any[]> = MergeRecursive<Head<T>, Tail<T>>;

type Head<T extends any[]> = T extends [infer X, ...any[]] ? X : never;

type Tail<T extends any[]> = ((...x: T) => void) extends (
  x: any,
  ...xs: infer XS
) => void
  ? XS
  : never;

type MergeRecursive<
  T1,
  TRest extends any[],
  FirstAndSecond = MergeSimple<T1, Head<TRest>>
> = {
  0: FirstAndSecond;
  1: FirstAndSecond & MergeRecursive<FirstAndSecond, Tail<TRest>>;
}[TRest extends [] ? 0 : TRest extends [any] ? 0 : 1];

import { DatasourceFilterModelMerged } from '../datasource/datasource';
import { AnyTypedColDef, TypedColGroupDef } from './col-def';

export type InferTypedColDefName<T> = T extends AnyTypedColDef<infer N, any>
  ? N
  : never;

export type InferTypedColDefFilter<
  T,
  N extends string = any
> = T extends AnyTypedColDef<N, infer F> ? F : DatasourceFilterModelMerged;

export type InferTypedColGroupDefChildren<T> = T extends TypedColGroupDef<
  any,
  any,
  infer C
>
  ? C
  : never;

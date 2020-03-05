import { AnyTypedColDef, TypedColGroupDef } from '../col-def/col-def';
import {
  InferTypedColDefFilter,
  InferTypedColDefName,
} from '../col-def/col-def.infer';
import {
  AnyArray,
  AsString,
  ExcludePropsByType,
  InferArray,
  MergeIntersection,
  UnionToIntersection,
} from '../util/types';

export type InferDatasourceFilterModel<
  C extends AnyArray<AnyTypedColDef>
> = MergeIntersection<UnionToIntersection<FilterModelNested<C>>>;

export type InferDatasourceSorting<F> = F extends object
  ? AsString<keyof F>
  : string;

type FilterModelNested<
  C extends AnyArray<AnyTypedColDef>,
  P = never
> = InferArray<
  {
    [K in keyof C]: C[K] extends TypedColGroupDef<any, any, any>
      ? InferDatasourceDefGroupFilterModel<C[K], P>
      : InferDatasourceDefFilterModel<C[K], P>;
  }
>;

type InferDatasourceDefGroupFilterModel<
  C extends TypedColGroupDef<any, any, any>,
  P = never,
  F = InferDatasourceDefFilterModel<C>,
  CHILDREN = FilterModelNested<C['children'], F>
> = MergeIntersection<UnionToIntersection<F | CHILDREN | P>>;

type InferDatasourceDefFilterModel<
  C extends AnyTypedColDef,
  P = never,
  M = ExcludePropsByType<
    { [K in InferTypedColDefName<C>]: InferTypedColDefFilter<C, K> },
    never
  >
> = MergeIntersection<UnionToIntersection<M | P>>;

import { AnyTypedColDef, TypedColGroupDef } from '../col-def/col-def';
import {
  InferTypedColDefFilter,
  InferTypedColDefName,
} from '../col-def/col-def.infer';
import {
  AnyArray,
  ExcludePropsByType,
  InferArray,
  MergeIntersection,
  UnionToIntersection,
} from '../util/types';
import { TypedDatasource } from './datasource';

export type InferDatasourceType<D> = D extends TypedDatasource<infer T, any>
  ? T
  : never;

export type InferDatasourceFilters<D> = D extends TypedDatasource<any, infer F>
  ? F
  : never;

export type InferDatasourceFilterModel<
  C extends AnyArray<AnyTypedColDef>
> = MergeIntersection<UnionToIntersection<FilterModelNested<C>>>;

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

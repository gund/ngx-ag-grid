import { Observable } from 'rxjs';

import {
  DatasourceFetcherOptions,
  DatasourceFetcherResult,
  InferTypedDatasource,
  TypedDatasource,
} from '../datasource';
import { GridDefinition } from './grid-def';

export type InferGridDefinitionType<D> = D extends GridDefinition<any, any>
  ? InferTypedDatasource<D['datasource']>['type']
  : never;

export type InferGridDefinitionFilters<D> = D extends GridDefinition<any, any>
  ? InferTypedDatasource<D['datasource']>['filters']
  : never;

export type InferGridDefinitionSorting<D> = D extends GridDefinition<any, any>
  ? InferTypedDatasource<D['datasource']>['sorting']
  : never;

export type InferDatasourceFetcherOptions<D> = DatasourceFetcherOptions<
  InferGridDefinitionFilters<D>,
  InferGridDefinitionSorting<D>
>;

export type InferDatasourceFetcherResult<D> = Observable<
  DatasourceFetcherResult<InferGridDefinitionType<D>>
>;

export type InferTypedDatasourceFromDef<D> = TypedDatasource<
  InferGridDefinitionType<D>,
  InferGridDefinitionFilters<D>,
  InferGridDefinitionSorting<D>
>;

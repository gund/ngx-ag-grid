import { Observable } from 'rxjs';

import { DatasourceFilterModel, DatasourceSortModel } from './datasource';
import { InferDatasourceSorting } from './datasource.infer';
import { AllTypedGetRowsParams, TypedDatasource } from './typed-datasource';

export interface DatasourceFetcherAdapter<
  /** Table data type */
  T,
  /** Filter model */
  F = never,
  /** Sort model - only specify when auto inference is incorrect */
  S extends string = InferDatasourceSorting<F>
> extends TypedDatasource<T, F, S> {
  getRows(params: AllTypedGetRowsParams<F, S>): void;
  setFetcher(fetcher: DatasourceFetcher<T, F, S>): void;
  destroy(): void;
}

export type DatasourceFetcher<
  /** Fetcher return type */
  T,
  /** Filter model */
  F = never,
  /** Sort model */
  S extends string = string
> = (
  options: DatasourceFetcherPaging & DatasourceFetcherOptions<F, S>,
) => Observable<DatasourceFetcherResult<T>>;

export interface DatasourceFetcherOptions<
  /** Filter model */
  F = never,
  /** Sort model */
  S extends string = string
> {
  filterModel: F extends never ? DatasourceFilterModel : F;
  sortModel: DatasourceSortModel<S>[];
  groupKeys: string[];
}

export interface DatasourceFetcherPaging {
  pageNumber: number;
  limit: number;
  startRow: number;
  endRow: number;
}

export interface DatasourceFetcherResult<T> {
  data: T[];
  total?: number;
}

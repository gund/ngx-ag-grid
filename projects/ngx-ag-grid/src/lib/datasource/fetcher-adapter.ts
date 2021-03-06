import { ColumnVO } from 'ag-grid-community';
import { Observable } from 'rxjs';

import { DatasourceFilterModel, DatasourceSortModel } from './datasource';
import { AllTypedGetRowsParams, TypedDatasource } from './typed-datasource';

export interface DatasourceFetcherAdapter<
  /** Table data type */
  T,
  /** Filter model */
  F = never,
  /** Sort model */
  S = string
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
  S = string
> = (
  options: DatasourceFetcherOptions<F, S>,
) => Observable<DatasourceFetcherResult<T>>;

export interface DatasourceFetcherOptions<
  /** Filter model */
  F = never,
  /** Sort model */
  S = string
> extends DatasourceFetcherPaging {
  filterModel?: F extends never ? DatasourceFilterModel : F;
  sortModel?: DatasourceSortModel<S>[];
  groupKeys?: string[];
  rowGroupCols?: ColumnVO[];
  valueCols?: ColumnVO[];
  pivotCols?: ColumnVO[];
  pivotMode: boolean;
  context?: any;
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

import {
  IDatasource,
  IGetRowsParams,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-community';
import { Observable } from 'rxjs';

import { DatasourceFilterModel, DatasourceSortModel } from './datasource';

export interface DatasourceFetcherAdapter<T, F = never>
  extends IDatasource,
    IServerSideDatasource {
  getRows(params: IGetRowsParams | IServerSideGetRowsParams): void;
  setFetcher(fetcher: DatasourceFetcher<T, F>): void;
  destroy(): void;
}

export type DatasourceFetcher<T, F = never> = (
  options: DatasourceFetcherPaging & DatasourceFetcherOptions<F>,
) => Observable<DatasourceFetcherResult<T>>;

export interface DatasourceFetcherOptions<F = never> {
  filterModel: F extends never ? DatasourceFilterModel : F;
  sortModel: DatasourceSortModel[];
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

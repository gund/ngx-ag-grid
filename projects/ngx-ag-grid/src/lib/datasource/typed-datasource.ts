import {
  IDatasource,
  IGetRowsParams,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IServerSideGetRowsRequest,
} from 'ag-grid-community';

import { DatasourceFilterModel, DatasourceSortModel } from './datasource';

export interface TypedGetRowsModels<F, S = string> {
  filterModel: F | undefined;
  sortModel: DatasourceSortModel<S>[] | undefined;
}

type UpgradeGetRowsModels<T> = Omit<T, keyof TypedGetRowsModels<any>>;

export interface TypedGetRowsParams<F, S = string>
  extends UpgradeGetRowsModels<IGetRowsParams>,
    TypedGetRowsModels<F, S> {}

export interface TypedServerSideGetRowsRequest<F, S = string>
  extends UpgradeGetRowsModels<IServerSideGetRowsRequest>,
    TypedGetRowsModels<F, S> {}

export interface TypedServerSideGetRowsParams<F, S = string>
  extends IServerSideGetRowsParams {
  request: TypedServerSideGetRowsRequest<F, S>;
}

export type AllTypedGetRowsParams<F, S = string> =
  | TypedGetRowsParams<F, S>
  | TypedServerSideGetRowsParams<F, S>;

export interface TypedDatasource<T, F = DatasourceFilterModel, S = string>
  extends IDatasource,
    IServerSideDatasource {
  __capturedType?: T;
  __capturedFilters?: F;
  __capturedSorting?: S;
  getRows(params: AllTypedGetRowsParams<F, S>): void;
}

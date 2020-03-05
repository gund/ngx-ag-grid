import {
  IDatasource,
  IGetRowsParams,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IServerSideGetRowsRequest,
} from 'ag-grid-community';

import { DatasourceFilterModel, DatasourceSortModel } from './datasource';

export interface TypedGetRowsModels<F, S extends string = string> {
  filterModel: F | undefined;
  sortModel: DatasourceSortModel<S>[];
}

type UpgradeGetRowsModels<T> = Omit<T, keyof TypedGetRowsModels<any>>;

export interface TypedGetRowsParams<F, S extends string = string>
  extends UpgradeGetRowsModels<IGetRowsParams>,
    TypedGetRowsModels<F, S> {}

export interface TypedServerSideGetRowsRequest<F, S extends string = string>
  extends UpgradeGetRowsModels<IServerSideGetRowsRequest>,
    TypedGetRowsModels<F, S> {}

export interface TypedServerSideGetRowsParams<F, S extends string = string>
  extends IServerSideGetRowsParams {
  request: TypedServerSideGetRowsRequest<F, S>;
}

export type AllTypedGetRowsParams<F, S extends string = string> =
  | TypedGetRowsParams<F, S>
  | TypedServerSideGetRowsParams<F, S>;

export interface TypedDatasource<
  T,
  F = DatasourceFilterModel,
  S extends string = string
> extends IDatasource, IServerSideDatasource {
  __capturedType?: T;
  __capturedFilters?: F;
  getRows(params: AllTypedGetRowsParams<F, S>): void;
}

export type InferDatasourceType<D> = D extends TypedDatasource<infer T, any>
  ? T
  : never;

export type InferDatasourceFilters<D> = D extends TypedDatasource<any, infer F>
  ? F
  : never;

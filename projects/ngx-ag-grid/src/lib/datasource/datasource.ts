import { IDatasource, IServerSideDatasource } from 'ag-grid-community';

export type AnyDatasource = IDatasource | IServerSideDatasource;

export interface DatasourceFilterModel {
  [k: string]: Partial<DatasourceFilterModelMerged>;
}

export interface DatasourceFilterModelMerged
  extends DatasourceFilterValueRange<any>,
    DatasourceFilterSet,
    DatasourceFilterDate {}

export interface DatasourceFilter<F extends DatasourceFilterBase> {
  __capturedFilter?: F;
  filter: string;
  filterParams?: any;
}

export interface DatasourceFilterBase {
  type: string;
  filterType: string;
}

export interface DatasourceFilterText<T = string> extends DatasourceFilterBase {
  filter: T;
}

export interface DatasourceFilterValueRange<T = string>
  extends DatasourceFilterText<T> {
  filterTo: T;
}

export interface DatasourceFilterNumber extends DatasourceFilterText<number> {}

export interface DatasourceFilterNumberRange
  extends DatasourceFilterValueRange<number> {}

export interface DatasourceFilterSet extends DatasourceFilterBase {
  values?: string[];
}

export interface DatasourceFilterDate extends DatasourceFilterBase {
  dateFrom?: string;
  dateTo?: string;
}

export interface DatasourceSortModel<K extends string = string> {
  colId: K;
  sort: DatasourceSortDirection;
}

export enum DatasourceSortDirection {
  asc = 'asc',
  desc = 'desc',
}

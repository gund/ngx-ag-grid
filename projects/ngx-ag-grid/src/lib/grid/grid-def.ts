import { GridOptions } from 'ag-grid-community';

import { AnyColDef } from '../col-def/col-def';
import { DatasourceFilterModel } from '../datasource/datasource';
import {
  InferDatasourceFilterModel,
  InferDatasourceSorting,
} from '../datasource/datasource.infer';
import { TypedDatasource } from '../datasource/typed-datasource';
import { AnyArray } from '../util/types';
import { defineCol, setField } from '../col-def/factories';

export abstract class GridDefinition<
  /** Table data type */
  T,
  /** Custom filter model - only specify when auto inference is incorrect */
  F extends DatasourceFilterModel = never
> {
  abstract columnDefs: AnyArray<AnyColDef>;
  abstract gridOptions: GridOptions;

  customFilterModel: F = null as any;
  filterModel: this['customFilterModel'] extends never
    ? InferDatasourceFilterModel<this['columnDefs']>
    : this['customFilterModel'] = null as any;
  datasource: TypedDatasource<
    T,
    this['filterModel'],
    InferDatasourceSorting<this['filterModel']>
  > = null as any;
}

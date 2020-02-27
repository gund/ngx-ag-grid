import { GridOptions } from 'ag-grid-community';

import { AnyColDef } from '../col-def/col-def';
import {
  DatasourceFilterModel,
  TypedDatasource,
} from '../datasource/datasource';
import { InferDatasourceFilterModel } from '../datasource/datasource.infer';
import { AnyArray } from '../util/types';

export abstract class GridDefinition<
  T extends object,
  F extends DatasourceFilterModel = never
> {
  abstract columnDefs: AnyArray<AnyColDef>;
  abstract gridOptions: GridOptions;

  customFilterModel: F = null as any;
  filterModel: this['customFilterModel'] extends never
    ? InferDatasourceFilterModel<this['columnDefs']>
    : this['customFilterModel'] = null as any;
  datasource: TypedDatasource<T, this['filterModel']> = null as any;
}

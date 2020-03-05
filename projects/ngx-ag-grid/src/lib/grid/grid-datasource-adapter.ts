import { InjectionToken } from '@angular/core';
import { DatasourceFetcherAdapter } from '../datasource';
import { GridDefinition } from './grid-def';
import {
  InferGridDefinitionFilters,
  InferGridDefinitionSorting,
  InferGridDefinitionType,
} from './grid-def.infer';

export interface DatasourceAdapterFactory {
  create<D extends GridDefinition<any, any>>(): DatasourceFetcherAdapter<
    InferGridDefinitionType<D>,
    InferGridDefinitionFilters<D>,
    InferGridDefinitionSorting<D>
  >;
}

export const GRID_DATASOURCE_ADAPTER = new InjectionToken<
  DatasourceAdapterFactory
>('GRID_DATASOURCE_ADAPTER');

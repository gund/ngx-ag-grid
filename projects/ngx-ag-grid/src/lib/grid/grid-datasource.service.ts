import { Injectable, Injector, OnDestroy } from '@angular/core';

import { GRID_DATASOURCE_ADAPTER } from './grid-datasource-adapter';
import { GridDefinition } from './grid-def';
import {
  InferDatasourceFetcherOptions,
  InferDatasourceFetcherResult,
  InferTypedDatasourceFromDef,
} from './grid-def.infer';

@Injectable()
export abstract class GridDatasourceService<D extends GridDefinition<any, any>>
  implements OnDestroy {
  private datasourceAdapter = this.injector
    .get(GRID_DATASOURCE_ADAPTER)
    .create<D>();

  protected abstract fetch(
    options: InferDatasourceFetcherOptions<D>,
  ): InferDatasourceFetcherResult<D>;

  constructor(private injector: Injector) {
    this.datasourceAdapter.setFetcher(options => this.fetch(options));
  }

  toDatasource(): InferTypedDatasourceFromDef<D> {
    return this.datasourceAdapter;
  }

  ngOnDestroy(): void {
    this.datasourceAdapter.destroy();
  }
}

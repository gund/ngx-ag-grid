import { Provider } from '@angular/core';
import { combineLatest, EMPTY, Subject } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import {
  DatasourceAdapterFactory,
  GRID_DATASOURCE_ADAPTER,
  GridDefinition,
  InferGridDefinitionFilters,
  InferGridDefinitionSorting,
  InferGridDefinitionType,
} from '../../grid';
import {
  DatasourceFetcher,
  DatasourceFetcherAdapter,
} from '../fetcher-adapter';
import { paramsToOptions } from '../params';
import { AllTypedGetRowsParams } from '../typed-datasource';

export interface FetcherAdapterObservableOptions {
  cancelPrevRequest?: boolean;
}

export class FetcherAdapterObservable<
  D extends GridDefinition<any, any>,
  T = InferGridDefinitionType<D>,
  F = InferGridDefinitionFilters<D>,
  S = InferGridDefinitionSorting<D>
> implements DatasourceFetcherAdapter<T, F, S> {
  rowCount?: number;

  private destroyed$ = new Subject<void>();
  private params$ = new Subject<AllTypedGetRowsParams<F, S>>();
  private fetcher$ = new Subject<DatasourceFetcher<T, F, S>>();

  private fetcherOptions$ = this.params$.pipe(map(paramsToOptions));

  constructor({
    cancelPrevRequest = true,
  }: FetcherAdapterObservableOptions = {}) {
    const mapOperator = cancelPrevRequest ? switchMap : mergeMap;

    combineLatest([this.fetcher$, this.params$, this.fetcherOptions$])
      .pipe(
        mapOperator(([fetcher, params, options]) =>
          fetcher(options).pipe(
            tap(res => {
              this.rowCount = res.total || res.data.length;
              params.successCallback(res.data, this.rowCount);
            }),
            catchError(() => {
              this.rowCount = undefined;
              params.failCallback();
              return EMPTY;
            }),
          ),
        ),
        takeUntil(this.destroyed$),
      )
      .subscribe();
  }

  setFetcher(fetcher: DatasourceFetcher<T, F, S>): void {
    this.fetcher$.next(fetcher);
  }

  getRows(params: AllTypedGetRowsParams<F, S>): void {
    this.params$.next(params);
  }

  destroy(): void {
    this.destroyed$.next();
  }
}

export class ObservableDatasourceAdapterFactory
  implements DatasourceAdapterFactory {
  constructor(private options?: FetcherAdapterObservableOptions) {}
  create<D extends GridDefinition<any, any>>() {
    return new FetcherAdapterObservable<D>(this.options);
  }
}

export function useObservableDatasourceAdapter(
  options?: FetcherAdapterObservableOptions,
): Provider {
  return {
    provide: GRID_DATASOURCE_ADAPTER,
    useValue: new ObservableDatasourceAdapterFactory(options),
  };
}

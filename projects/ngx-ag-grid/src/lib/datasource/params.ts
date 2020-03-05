import { IGetRowsParams, IServerSideGetRowsParams } from 'ag-grid-community';

import { DatasourceFetcherOptions } from './fetcher-adapter';
import {
  AllTypedGetRowsParams,
  TypedServerSideGetRowsParams,
} from './typed-datasource';

export function areParamsServerSide(
  params: IGetRowsParams | IServerSideGetRowsParams,
): params is IServerSideGetRowsParams;
export function areParamsServerSide<F, S>(
  params: AllTypedGetRowsParams<F, S>,
): params is TypedServerSideGetRowsParams<F, S>;
export function areParamsServerSide(
  params: IGetRowsParams | IServerSideGetRowsParams,
): params is IServerSideGetRowsParams {
  return 'request' in params;
}

export function paramsToOptions<F, S>(
  params: AllTypedGetRowsParams<F, S>,
): DatasourceFetcherOptions<F, S> {
  const request = areParamsServerSide(params) ? params.request : params;

  const limit = request.endRow - request.startRow;
  const pageNumber = Math.ceil(request.endRow / limit);

  const rowGroupCols = areParamsServerSide(params)
    ? params.request.rowGroupCols
    : undefined;
  const valueCols = areParamsServerSide(params)
    ? params.request.valueCols
    : undefined;
  const pivotCols = areParamsServerSide(params)
    ? params.request.pivotCols
    : undefined;
  const pivotMode = areParamsServerSide(params)
    ? params.request.pivotMode
    : false;
  const groupKeys = areParamsServerSide(params)
    ? params.request.groupKeys
    : undefined;

  const context = areParamsServerSide(params) ? undefined : params.context;

  return {
    limit,
    pageNumber,
    startRow: request.startRow,
    endRow: request.endRow,
    filterModel: request.filterModel || ({} as any),
    sortModel: request.sortModel,
    rowGroupCols,
    valueCols,
    pivotCols,
    pivotMode,
    groupKeys,
    context,
  };
}

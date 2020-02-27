import { ColDef } from 'ag-grid-community';

import {
  DatasourceFilter,
  DatasourceFilterBase,
  DatasourceFilterDate,
  DatasourceFilterText,
} from '../datasource/datasource';
import { mergeDeep } from '../util/merge-deep';
import {
  AnyTypedColDef,
  TransformerColDef,
  TransformerColDefGroup,
  TypedColDef,
  TypedColGroupDef,
} from './col-def';
import { FilterOption, FilterRowsAction, FilterType } from './filter';

/**
 * Allows to compose `ColDef` helper functions to produce final `ColDef`
 */
export function defineCol<
  N extends string,
  F extends DatasourceFilterBase = never
>(...fns: TransformerColDef<N, F>[]): TypedColDef<N, F> {
  return fns.reduce(
    (colDef, fn) => mergeDeep(colDef, fn(colDef)),
    {} as ColDef,
  );
}

/**
 * Allows to compose `ColGroupDef` helper functions to produce final `ColGroupDef`
 */
export function defineColGroup<
  N extends string,
  F extends DatasourceFilterBase = never,
  C extends ReadonlyArray<AnyTypedColDef> | Array<AnyTypedColDef> = []
>(
  children: C,
  ...fns: TransformerColDefGroup<N, F>[]
): TypedColGroupDef<N, F, C> {
  return fns.reduce((colDef, fn) => mergeDeep(colDef, fn(colDef as any)), {
    children,
  } as TypedColGroupDef<N, F, C>);
}

export function setField<N extends string>(
  colId: N,
  headerName: string,
  field?: string,
): () => Partial<TypedColDef<N>> {
  return () => ({ field, headerName, colId });
}

export function setTextFilter(
  filterOptions?: FilterOption[],
  keepRows = true,
): () => DatasourceFilter<DatasourceFilterText> {
  return () => setFilter(FilterType.text, filterOptions, keepRows);
}

export function setNumberFilter(
  filterOptions?: FilterOption[],
  keepRows = true,
): () => DatasourceFilter<DatasourceFilterText<number>> {
  return () => setFilter(FilterType.number, filterOptions, keepRows);
}

export function setDateFilter(
  filterOptions?: FilterOption[],
  keepRows = true,
): () => DatasourceFilter<DatasourceFilterDate> {
  return () => setFilter(FilterType.date, filterOptions, keepRows);
}

export function setFilter(
  filter: FilterType,
  filterOptions?: FilterOption[],
  keepRows = true,
  filterParams?: object,
) {
  return {
    filter,
    filterParams: {
      suppressAndOrCondition: true,
      ...filterParams,
      filterOptions,
      newRowsAction: keepRows ? FilterRowsAction.keep : FilterRowsAction.none,
    },
  };
}

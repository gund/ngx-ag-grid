import { ColDef, ColGroupDef } from 'ag-grid-community';

import { DatasourceFilterBase } from '../datasource/datasource';
import { TransformerFn } from '../util/transformer';
import { AnyArray } from '../util/types';

export type AnyColDef = ColDef | ColGroupDef;

export type AnyTypedColDef<
  N extends string = any,
  F extends DatasourceFilterBase = any
> = TypedColDef<N, F> | TypedColGroupDef<N, F>;

export interface TypedColDef<
  N extends string,
  F extends DatasourceFilterBase = never
> extends ColDef {
  __capturedName?: N;
  __capturedFilter?: F;
}

export interface TypedColGroupDef<
  N extends string,
  F extends DatasourceFilterBase = never,
  C extends AnyArray<AnyTypedColDef> = []
> extends Omit<ColGroupDef, 'children'> {
  __capturedName?: N;
  __capturedFilter?: F;
  children: C;
}

export type TransformerColDef<
  N extends string,
  F extends DatasourceFilterBase = never
> = TransformerFn<ColDef, Partial<TypedColDef<N, F>>>;

export type TransformerColDefGroup<
  N extends string,
  F extends DatasourceFilterBase = never,
  C extends AnyArray<AnyTypedColDef> = []
> = TransformerFn<ColGroupDef, Partial<TypedColGroupDef<N, F, C>>>;

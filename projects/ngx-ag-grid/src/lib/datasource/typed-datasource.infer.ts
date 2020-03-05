import { TypedDatasource } from './typed-datasource';

export type InferTypedDatasource<D> = D extends TypedDatasource<
  infer T,
  infer F,
  infer S
>
  ? { type: T; filters: F; sorting: S }
  : never;

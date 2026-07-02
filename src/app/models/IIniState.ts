import { IPagedPaginator } from "./IPagedPaginator";

export interface IIniState<T> {
  loading: string | null;
  data: T | T[] | boolean | null;
  dataAll?: T[];
  object?: T;
  PaginatorData?: IPagedPaginator<T> | null;
}

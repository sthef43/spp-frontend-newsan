export interface IPagedPaginator<T> {
  data: T[];
  total: number;
  totalPage: number;
  nextPage: boolean;
  previousPage: boolean;
}

export interface IQuery<T> {
  // filters: Filter<RowData>[];
  page: number;
  pageSize: number;
  totalCount?: number;
  search: string;
  orderDirection?: "asc" | "desc";
}

export interface IQueryResult<T> {
  data: T[];
  page?: number;
  totalPages: number;
  totalCount: number;
}

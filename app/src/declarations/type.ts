export interface PaginateList<T> {
  page: number;
  data: T[];
  length: number;
  max: number;
}

import { ResultWithPagination } from '@/common/dto/result-with-pagination';

export interface Pagination {
  page: number;
  limit: number;
  sort: string;
  order: string;
  total: number;
}

export interface WithPagination<T> extends ResultWithPagination {
  data: T[];
}

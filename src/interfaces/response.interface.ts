export interface PaginatedResponse<T> {
  data: T;
  currentPage: number;
  elementsPerPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface APIResponse<T> {
  statusCode: string;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Pagination {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export enum ApiStatusCodes {
  SUCCESS = '10000',
  FAILURE = '10001',
  RETRY = '10002',
  INVALID_ACCESS_TOKEN = '10003',
}

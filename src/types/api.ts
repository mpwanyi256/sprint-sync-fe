export interface APIResponse<T> {
  statusCode: string
  message: string
  data: T
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface Pagination {
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

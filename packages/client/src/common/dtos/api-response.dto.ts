export class ApiResponsePagination {
  limit!: number;
  offset!: number;
  count!: number;
}

export class ApiResponse<T> {
  pagination?: ApiResponsePagination;
  data!: T;
}

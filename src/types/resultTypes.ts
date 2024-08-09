export interface SuccessResponse<T> {
  data: T;
}

export interface ErrorResponse extends Error {
  error?: string;
}

export type Result<T> = SuccessResponse<T> | ErrorResponse;

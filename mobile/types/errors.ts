export class ApiError extends Error {
  public status: number;
  public statusText: string;

  constructor(message: string, status: number = 500, statusText: string = 'Internal Server Error') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

export interface ErrorResponse {
  message: string;
  status: number;
  error?: string;
}

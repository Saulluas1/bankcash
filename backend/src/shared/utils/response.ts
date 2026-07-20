/** Standardized API response helper */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export const successResponse = <T>(
  data: T,
  message = 'Success',
  meta?: ApiResponse['meta']
): ApiResponse<T> => ({
  success: true,
  message,
  data,
  ...(meta && { meta }),
});

export const errorResponse = (message: string): ApiResponse => ({
  success: false,
  message,
});

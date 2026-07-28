export interface StandardResponse {
  success: boolean;
  message: string;
  code: number;
  reason_code?: string;
  data?: Object | null;
}

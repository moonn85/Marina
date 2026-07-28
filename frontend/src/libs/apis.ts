import { authorizedFetch } from "./auth";

export interface StandardResponse<T = unknown> {
  success: boolean;
  message: string;
  code: number;
  reason_code?: string;
  data?: T | null;
}

export const apiGet = <T>(path: string) =>
  authorizedFetch<StandardResponse<T>>(path);

export const apiPost = <T>(path: string, body?: any) =>
  authorizedFetch<StandardResponse<T>>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });

export const apiPut = <T>(path: string, body?: any) =>
  authorizedFetch<StandardResponse<T>>(path, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });

export const apiDelete = <T>(path: string, body?: any) =>
  authorizedFetch<StandardResponse<T>>(path, {
    method: "DELETE",
    body: body ? JSON.stringify(body) : undefined, 
  });

export const apiUpload = <T>(path: string, formData: FormData) =>
  authorizedFetch<StandardResponse<T>>(path, {
    method: "POST",
    body: formData, // KHÔNG set Content-Type
  });
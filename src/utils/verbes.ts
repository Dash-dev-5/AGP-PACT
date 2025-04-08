import axios from 'axios';
import axiosServices from './axios';

export interface ApiErrorResponse {
  statusCode: number;
  timestamp: number;
  message: string;
  description: string;
}

interface ApiResponse<T> {
  data: T;
}

export const parseError = (error: unknown): string => {
  let message: string;
  if (axios.isAxiosError(error)) {
    message = error.response?.data?.message || "Une erreur réseau s'est produite.";
  } else if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message);
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = "Une erreur s'est produite.";
  }
  return message;
};

export const getRequest = async <T>(path: string, params = {}): Promise<ApiResponse<T>> => {
  try {
    const res = await axiosServices.get<T>(path, { params });
    return { data: res.data };
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const postRequest = async <T>(path: string, data = {}, params = {}): Promise<ApiResponse<T>> => {
  try {
    const res = await axiosServices.post<T>(path, data, { params });
    return { data: res.data };
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const postFormDataRequest = async <T>(path: string, data = {}, params = {}): Promise<ApiResponse<T>> => {
  try {
    const res = await axiosServices.post<T>(path, data, {
      params,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return { data: res.data };
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const patchRequest = async <T>(path: string, data = {}, params = {}): Promise<ApiResponse<T>> => {
  try {
    const res = await axiosServices.patch<T>(path, data, {
      params
    });

    return { data: res.data };
  } catch (error) {
    console.error(error);

    throw new Error(parseError(error));
  }
};

export const patchFormDataRequest = async <T>(path: string, data = {}, params = {}): Promise<ApiResponse<T>> => {
  try {
    const res = await axiosServices.patch<T>(path, data, {
      params,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return { data: res.data };
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const putRequest = async <T>(path: string, data = {}, params = {}): Promise<ApiResponse<T>> => {
  try {
    const res = await axiosServices.put<T>(path, data, { params });
    return { data: res.data };
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const deleteRequest = async <T>(path: string, params = {}): Promise<ApiResponse<T>> => {
  try {
    const res = await axiosServices.delete<T>(path, { params });
    return { data: res.data };
  } catch (error) {
    throw new Error(parseError(error));
  }
};

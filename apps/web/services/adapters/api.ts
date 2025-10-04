import axios, { Method } from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/api";

const createRequestConfig = (
  method: Method,
  url: string,
  data?: unknown,
  token?: string,
  service = baseUrl,
) => {
  const BASE_URL = service;
  return {
    method,
    url: `${BASE_URL}${url}`,
    data,
    headers: {
      "Accept-Language": "ka",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
};

const handleError = (error: any) => {
  const response = error.response;
  console.log(error);
  console.log(response?.data);
  return {
    success: false,
    message:
      response?.data?.message || response?.data?.title || "An error occurred",
    status: response?.status || 500,
  };
};

const api = {
  get: async (endpoint: string, token?: string, service?: string) => {
    try {
      const response = await axios(
        createRequestConfig("GET", endpoint, null, token, service),
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  post: async (
    endpoint: string,
    data: unknown,
    token?: string,
    service?: string,
  ) => {
    try {
      const response = await axios(
        createRequestConfig("POST", endpoint, data, token, service),
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  put: async (
    endpoint: string,
    data: unknown,
    token?: string,
    service?: string,
  ) => {
    try {
      const response = await axios(
        createRequestConfig("PUT", endpoint, data, token, service),
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  patch: async (
    endpoint: string,
    data: unknown,
    token?: string,
    service?: string,
  ) => {
    try {
      const response = await axios(
        createRequestConfig("PATCH", endpoint, data, token, service),
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (endpoint: string, token?: string, service?: string) => {
    try {
      const response = await axios(
        createRequestConfig("DELETE", endpoint, null, token, service),
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error);
    }
  },
};

export { api };

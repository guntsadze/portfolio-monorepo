import { api } from "./adapters/api";

export const getItems = async (
  endpoint: string,
  token?: string,
  service?: string,
) => {
  const response = await api.get(endpoint, token, service);
  return response;
};

export const getItem = async (
  endpoint: string,
  token?: string,
  service?: string,
) => {
  const response = await api.get(endpoint, token, service);
  return response;
};

export const createItem = async (
  endpoint: string,
  data: unknown,
  token?: string,
  service?: string,
) => {
  const response = await api.post(endpoint, data, token, service);
  return response;
};

export const updateItem = async (
  endpoint: string,
  data: unknown,
  token?: string,
  service?: string,
) => {
  const response = await api.put(endpoint, data, token, service);
  return response;
};

export const patchItem = async (
  endpoint: string,
  data: unknown,
  token?: string,
  service?: string,
) => {
  const response = await api.patch(endpoint, data, token, service);
  return response;
};

export const deleteItem = async (
  endpoint: string,
  token?: string,
  service?: string,
) => {
  const response = await api.delete(endpoint, token, service);
  return response;
};

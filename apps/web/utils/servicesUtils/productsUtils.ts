import { DynamicDataType } from "@/types/common.types";

export const shouldUpdateItem = (item) => !item.isDone;

export const queryBuilder = (query: DynamicDataType | undefined) => {
  let queryString = "?";

  for (let key in query) {
    queryString += `${key}=${query[key]}&`;
  }

  return queryString.slice(0, queryString.length - 1);
};

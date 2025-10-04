// import { useEffect, useState } from "react";
// import * as Service from "../../services/Service";
// import { DynamicDataType } from "../../types/common.types";
// import { queryBuilder } from "../../utils/servicesUtils/productsUtils";

// export const useServiceGet = (
//   endpoint: string,
//   token?: string,
//   query?: DynamicDataType | undefined,
//   service?: string,
// ) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [serviceError, setServiceError] = useState("");
//   const [items, setItems] = useState([]);
//   const [refresh, setRefresh] = useState(false);

//   useEffect(() => {
//     const fetchItems = async () => {
//       if (endpoint !== undefined) {
//         setIsLoading(true);
//         try {
//           const queryString = queryBuilder(query);
//           const result = await Service.getItems(
//             `${endpoint}${queryString === "?" ? "" : queryString}`,
//             token,
//             service,
//           );

//           if (result.success) {
//             setItems(result.data);
//           } else {
//             console.error("Error fetching items:", result.message);
//             // Optionally, handle error states here, e.g., display a message
//           }
//         } catch (error) {
//           console.error("Error fetching items:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchItems();
//   }, [refresh, endpoint, token, query, service]);

//   const refreshItems = () => {
//     setRefresh((prevValue) => !prevValue);
//   };

//   return { items, setItems, refreshItems, isLoading, serviceError };
// };

// export const useServiceGetForRoutePage = (
//   endpoint: string,
//   token?: string,
//   query?: DynamicDataType | undefined,
//   service?: string,
// ) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [serviceError, setServiceError] = useState("");
//   const [items, setItems] = useState(null);
//   const [refresh, setRefresh] = useState(false);

//   useEffect(() => {
//     const fetchItems = async () => {
//       if (endpoint !== undefined) {
//         setIsLoading(true);
//         try {
//           const queryString = queryBuilder(query);
//           const result = await Service.getItems(
//             `${endpoint}${queryString === "?" ? "" : queryString}`,
//             token,
//             service,
//           );

//           if (result.success) {
//             setItems(result.data);
//           } else {
//             console.error("Error fetching items:", result.message);
//             // Optionally, handle error states here, e.g., display a message
//           }
//         } catch (error) {
//           console.error("Error fetching items:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchItems();
//   }, [refresh, endpoint, token, query, service]);

//   const refreshItems = () => {
//     setRefresh((prevValue) => !prevValue);
//   };

//   return { items, setItems, refreshItems, isLoading, serviceError };
// };

// export const useServiceGetById = (
//   endpoint: string | null,
//   token?: string,
//   service?: string,
// ) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [serviceError, setServiceError] = useState("");
//   const [item, setItem] = useState([]);
//   const [refresh, setRefresh] = useState(false);

//   useEffect(() => {
//     const fetchItem = async () => {
//       if (
//         endpoint &&
//         typeof endpoint === "string" &&
//         !endpoint.endsWith("id=null")
//       ) {
//         setIsLoading(true);
//         try {
//           const result = await Service.getItem(endpoint, token, service);

//           if (result.success) {
//             setItem(result.data);
//           } else {
//             console.error("Error fetching item:", result.message);
//             // Optionally, handle error states here, e.g., display a message
//           }
//         } catch (error) {
//           console.error("Error fetching item:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchItem();
//   }, [refresh, endpoint, token, service]);

//   const refreshItem = () => {
//     setRefresh((prevValue) => !prevValue);
//   };

//   return { item, refreshItem, isLoading, serviceError };
// };

// export const useServiceCreate = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [serviceError, setServiceError] = useState("");

//   const createItem = async (
//     endpoint: string,
//     data: unknown,
//     token?: string,
//     service?: string,
//   ) => {
//     setIsLoading(true);
//     try {
//       const result = await Service.createItem(endpoint, data, token, service);

//       if (!result.success) {
//         setServiceError(result.message);
//         toast.error("ოპერაცია დახარვეზდა: " + result.message);
//       }
//       if (result.success) {
//         toast.success("ოპერაცია წარმატებით დასრულდა");
//       }
//       return result;
//     } catch (error) {
//       console.error("Error creating item:", error);
//       setServiceError("An unexpected error occurred");
//       toast.error("ოპერაცია დახარვეზდა: An unexpected error occurred");
//       return { success: false, message: "An unexpected error occurred" };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { createItem, isLoading, serviceError };
// };

// export const useServiceUpdate = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [serviceError, setServiceError] = useState("");

//   const updateItem = async (
//     endpoint: string,
//     data: unknown,
//     token?: string,
//     service?: string,
//   ) => {
//     setIsLoading(true);
//     try {
//       const result = await Service.updateItem(endpoint, data, token, service);

//       if (!result.success) {
//         setServiceError(result.message);
//         toast.error("ოპერაცია დახარვეზდა: " + result.message);
//       }
//       if (result.success) {
//         toast.success("ოპერაცია წარმატებით დასრულდა");
//       }
//       return result;
//     } catch (error) {
//       console.error("Error updating item:", error);
//       setServiceError("An unexpected error occurred");
//       toast.error("ოპერაცია დახარვეზდა: An unexpected error occurred");
//       return { success: false, message: "An unexpected error occurred" };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { updateItem, isLoading, serviceError };
// };

// export const useServicePatch = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [serviceError, setServiceError] = useState("");

//   const patchItem = async (
//     endpoint: string,
//     data: unknown,
//     token?: string,
//     service?: string,
//   ) => {
//     setIsLoading(true);
//     try {
//       const result = await Service.patchItem(endpoint, data, token, service);

//       if (!result.success) {
//         setServiceError(result.message);
//         toast.error("ოპერაცია დახარვეზდა: " + result.message);
//       }
//       if (result.success) {
//         toast.success("ოპერაცია წარმატებით დასრულდა");
//       }
//       return result;
//     } catch (error) {
//       console.error("Error patching item:", error);
//       setServiceError("An unexpected error occurred");
//       toast.error("ოპერაცია დახარვეზდა: An unexpected error occurred");
//       return { success: false, message: "An unexpected error occurred" };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { patchItem, isLoading, serviceError };
// };

// export const useServiceDelete = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [serviceError, setServiceError] = useState("");

//   const deleteItem = async (
//     endpoint: string,
//     token?: string,
//     service?: string,
//   ) => {
//     setIsLoading(true);
//     try {
//       const result = await Service.deleteItem(endpoint, token, service);

//       if (!result.success) {
//         setServiceError(result.message);
//         toast.error("ოპერაცია დახარვეზდა: " + result.message);
//       }
//       if (result.success) {
//         toast.success("ოპერაცია წარმატებით დასრულდა");
//       }

//       return result;
//     } catch (error) {
//       console.error("Error deleting item:", error);
//       setServiceError("An unexpected error occurred");
//       toast.error("ოპერაცია დახარვეზდა: An unexpected error occurred");
//       return { success: false, message: "An unexpected error occurred" };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { deleteItem, isLoading, serviceError };
// };

// export const useServiceRs = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [serviceError, setServiceError] = useState("");

//   const createItem = async (
//     endpoint: string,
//     data: unknown,
//     token?: string,
//     service?: string,
//   ) => {
//     setIsLoading(true);
//     try {
//       const result = await Service.createItem(endpoint, data, token, service);

//       if (!result.success) {
//         setServiceError(result.message);
//         toast.error("RS ოპერაცია დახარვეზდა: " + result.message);
//       } else {
//         toast.success("RS ოპერაცია წარმატებით დასრულდა");
//       }

//       return result;
//     } catch (error) {
//       console.error("RS createItem შეცდომა:", error);
//       setServiceError("დამატების შეცდომა");
//       toast.error("დამატების შეცდომა");
//       return { success: false, message: "დამატების შეცდომა" };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { createItem, isLoading, serviceError };
// };

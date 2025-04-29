import axios from "axios";

export const BASE_URL = "http://localhost:3000/api";

  
export const publicInstance  = axios.create({
  baseURL: BASE_URL,
});
 
export const privateInstance = axios.create({
  baseURL: BASE_URL,
}); 

privateInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Endpoints
export const AUTH = {
  SIGNUP: `${BASE_URL}/auth/signup`,
  LOGIN: `${BASE_URL}/auth/login`,
};


// Categories Endpoints
export const CATEGORIES = {
  GET_ALL_CATEGORIES: `${BASE_URL}/categories`,
  GET_CATEGORY: (id) => `${BASE_URL}/categories/${id}`,
  CREATE_CATEGORY: `${BASE_URL}/categories`,
  UPDATE_CATEGORY: (id) => `${BASE_URL}/categories/${id}`,
  DELETE_CATEGORY: (id) => `${BASE_URL}/categories/${id}`,
};

import axios from "axios";

export const BASE_URL = "http://localhost:3000/api";

// http://localhost:3000/api/subCategories
//brands
  
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

// Sub Categories Endpoints
export const SUB_CATEGORIES = {
  GET_ALL_SUB_CATEGORIES: `${BASE_URL}/subCategories`,
  GET_SUB_CATEGORY: (id) => `${BASE_URL}/subCategories/${id}`,
  CREATE_SUB_CATEGORY: `${BASE_URL}/subCategories`,
  UPDATE_SUB_CATEGORY: (id) => `${BASE_URL}/subCategories/${id}`,
  DELETE_SUB_CATEGORY: (id) => `${BASE_URL}/subCategories/${id}`,
  GET_ALL_SUB_CATEGORIES_BY_CATEGORYID: (id) =>
    `${BASE_URL}/categories/${id}/subcategory`,
  ADD_SUB_CATEGORIES_FOR_CATEGORYID: (id) =>
    `${BASE_URL}/categories/${id}/subcategory`,
};


// Brands Endpoints
export const BRANDS = {
  GET_ALL_BRANDS: `${BASE_URL}/brands`,
  GET_BRAND: (id) => `${BASE_URL}/brands/${id}`,
  CREATE_BRAND: `${BASE_URL}/brands`,
  UPDATE_BRAND: (id) => `${BASE_URL}/brands/${id}`,
  DELETE_BRAND: (id) => `${BASE_URL}/brands/${id}`,
};
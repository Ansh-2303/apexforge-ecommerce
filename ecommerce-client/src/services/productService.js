import api from "./api";

/* GET ALL PRODUCTS */
export const getAllProducts = async (
  page = 1,
  limit = 10,
  category = "",
  keyword = "",
  sort = "newest",
  brand = "",
  minPrice = "",
  maxPrice = ""
) => {

  let url = `/products?page=${page}&limit=${limit}&sort=${sort}`;

  if (category) url += `&category=${category}`;
  if (keyword) url += `&keyword=${keyword}`;
  if (brand) url += `&brand=${brand}`;
  if (minPrice !== "") url += `&minPrice=${minPrice}`;
  if (maxPrice !== "") url += `&maxPrice=${maxPrice}`;

  const { data } = await api.get(url);

  return data;   // IMPORTANT
};

/* GET FEATURED PRODUCTS */

export const getFeaturedProducts = async () => {

  const { data } = await api.get("/products?featured=true&limit=8");

  return data.products;

};


/* GET PRODUCT BY SLUG */

export const getProductBySlug = async (slug) => {

  const { data } = await api.get(`/products/slug/${slug}`);

  return data;

};


/* GET PRODUCT BY ID */

export const getProductById = async (id) => {

  const { data } = await api.get(`/products/${id}`);

  return data;

};
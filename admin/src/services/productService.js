import api from "./api"

/* GET PRODUCT BY ID */

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`)
  return data
}

/* UPDATE PRODUCT */

export const updateProduct = async (id, formData) => {

  const config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }

  const { data } = await api.put(`/products/${id}`, formData, config)

  return data
}
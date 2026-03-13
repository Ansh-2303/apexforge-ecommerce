import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import { getProductById, updateProduct } from "../services/productService"
import "./Product.css";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
  name: "",
  slug: "",
  brand: "",
  description: "",
  category: "",
  imageUrl: "",
  isFeatured: false,
  badge: "",
  variants: [],
});
const fetchProduct = async () => {
  try {

    const data = await getProductById(id)

    setFormData({
      name: data.name || "",
      slug: data.slug || "",
      brand: data.brand || "",
      description: data.description || "",
      category: data.category?._id || "",
      badge: data.badge || "",
      isFeatured: data.isFeatured || false,
      variants: data.variants || []
    })

  } catch (error) {
    console.error(error)
  }
}

  const fetchCategories = async () => {
    const { data } = await axios.get(
      "http://localhost:5000/api/categories",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setCategories(data);
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
const updateHandler = async () => {
  await axios.put(
    `http://localhost:5000/api/products/${id}`,
    {
      name: formData.name,
      slug: formData.slug,
      brand: formData.brand,
      category: formData.category,
      description: formData.description,

      images: formData.imageUrl ? [formData.imageUrl] : [],

      isFeatured: formData.isFeatured,
      badge: formData.badge, // ⭐ IMPORTANT FIX

      variants: formData.variants.map((v) => ({
        sku: v.sku,
        size: v.size,
        color: v.color,
        price: Number(v.price),
        countInStock: Number(v.countInStock),
      })),

      specifications: {},
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  navigate("/admin/products");
};

  const handleVariantChange = (index, e) => {
  const { name, value } = e.target;

  const updatedVariants = [...formData.variants];
  updatedVariants[index][name] = value;

  setFormData({
    ...formData,
    variants: updatedVariants,
  });
};

const addVariantRow = () => {
  setFormData({
    ...formData,
    variants: [
      ...formData.variants,
      { sku: "", size: "", color: "", price: "", countInStock: "" },
    ],
  });
};

const removeVariantRow = (index) => {
  const updatedVariants = formData.variants.filter(
    (_, i) => i !== index
  );

  setFormData({
    ...formData,
    variants: updatedVariants,
  });
};

  return (
    <AdminLayout>
      <div className="edit-wrapper">
        <div className="edit-card">
          <h2>Edit Product</h2>

          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              Featured Product
            </label>

            <div className="form-group">

<label>Badge</label>

<select
value={formData.badge}
onChange={(e) =>
setFormData({ ...formData, badge: e.target.value })
}
>

<option value="">No Badge</option>
<option value="TOP">🔥 Top Pick</option>
<option value="PRO">⚡ Pro Gear</option>
<option value="NEW">🆕 New</option>
<option value="SALE">💸 Sale</option>

</select>

</div>

          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <h4>Variants</h4>
          

{formData.variants.map((variant, index) => (
  <div key={index} className="variant-box">

    <input
      type="text"
      name="sku"
      placeholder="SKU"
      value={variant.sku}
      onChange={(e) => handleVariantChange(index, e)}
    />

    <input
      type="text"
      name="size"
      placeholder="Size"
      value={variant.size}
      onChange={(e) => handleVariantChange(index, e)}
    />

    <input
      type="text"
      name="color"
      placeholder="Color"
      value={variant.color}
      onChange={(e) => handleVariantChange(index, e)}
    />

    <input
      type="number"
      name="price"
      placeholder="Price"
      value={variant.price}
      onChange={(e) => handleVariantChange(index, e)}
    />

    <input
      type="number"
      name="countInStock"
      placeholder="Stock"
      value={variant.countInStock}
      onChange={(e) => handleVariantChange(index, e)}
    />

    {formData.variants.length > 1 && (
      <button type="button" onClick={() => removeVariantRow(index)}>
        Remove
      </button>
    )}
  </div>
))}

<button type="button" onClick={addVariantRow}>
  + Add Variant
</button>

          <div className="form-buttons">
            <button
              className="cancel-btn"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </button>

            <button
              className="save-btn"
              onClick={updateHandler}
            >
              Update Product
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
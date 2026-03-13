import { useState, useEffect } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { 
  PackagePlus, X, Plus, Image as ImageIcon, 
  ChevronLeft, Save, Hash, Info 
} from "lucide-react";
import "./Product.css";

export default function ProductForm() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "", slug: "", brand: "", description: "",
    category: "", image: null, isFeatured: false, badge: "",
    variants: [{ sku: "", size: "", color: "", price: "", countInStock: "" }],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/api/categories");
        setCategories(data);
      } catch (err) { console.error(err); }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...formData.variants];
    updatedVariants[index][name] = value;
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  const addVariantRow = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { sku: "", size: "", color: "", price: "", countInStock: "" }]
    }));
  };

  const removeVariantRow = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'variants') data.append(key, JSON.stringify(formData[key]));
      else if (key === 'image') data.append(key, formData[key]);
      else data.append(key, formData[key]);
    });

    try {
      await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      navigate("/admin/products");
    } catch (err) { console.error("Upload failed", err); }
  };

  return (
    <AdminLayout>
      <div className="form-page-container">
        <header className="form-header">
          <button className="back-btn" onClick={() => navigate("/admin/products")}>
            <ChevronLeft size={18} /> Back
          </button>
          <div className="header-title">
            <h1>Forge New Gear</h1>
            <p>Add a premium product to the ApexForge arsenal.</p>
          </div>
        </header>

        <form className="lux-form-grid" onSubmit={submitHandler}>
          {/* Left Column: Core Info */}
          <div className="form-column main-info">
            <section className="lux-card">
              <div className="card-header"><Info size={16}/> <h3>General Information</h3></div>
              <div className="input-group">
                <label>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Apex Pro TKL Keyboard" required />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand Name" />
                </div>
                <div className="input-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea name="description" rows="5" value={formData.description} onChange={handleChange} placeholder="Describe the specs and feel..." />
              </div>
            </section>

            <section className="lux-card">
              <div className="card-header"><Hash size={16}/> <h3>Inventory & Variants</h3></div>
              <div className="variants-table-header">
                <span>SKU</span><span>Size</span><span>Color</span><span>Price</span><span>Stock</span><span></span>
              </div>
              {formData.variants.map((v, i) => (
                <div key={i} className="variant-row-input">
                  <input type="text" name="sku" placeholder="SKU" value={v.sku} onChange={(e) => handleVariantChange(i, e)} />
                  <input type="text" name="size" placeholder="S/M/L" value={v.size} onChange={(e) => handleVariantChange(i, e)} />
                  <input type="text" name="color" placeholder="Hex/#" value={v.color} onChange={(e) => handleVariantChange(i, e)} />
                  <input type="number" name="price" placeholder="₹" value={v.price} onChange={(e) => handleVariantChange(i, e)} />
                  <input type="number" name="countInStock" placeholder="Qty" value={v.countInStock} onChange={(e) => handleVariantChange(i, e)} />
                  {formData.variants.length > 1 && (
                    <button type="button" className="remove-v-btn" onClick={() => removeVariantRow(i)}><X size={14}/></button>
                  )}
                </div>
              ))}
              <button type="button" className="add-v-btn" onClick={addVariantRow}>
                <Plus size={14} /> Add Variant Row
              </button>
            </section>
          </div>

          {/* Right Column: Media & Status */}
          <div className="form-column side-info">
            <section className="lux-card">
              <div className="card-header"><ImageIcon size={16}/> <h3>Product Media</h3></div>
              <div className="media-upload-zone">
                {formData.image ? (
                  <div className="preview-container">
                    <img src={URL.createObjectURL(formData.image)} alt="Preview" />
                    <button type="button" className="clear-img" onClick={() => setFormData({...formData, image: null})}><X size={14}/></button>
                  </div>
                ) : (
                  <label className="upload-placeholder">
                    <input type="file" accept="image/*" hidden onChange={(e) => setFormData({...formData, image: e.target.files[0]})} />
                    <PackagePlus size={32} />
                    <span>Click to upload gear image</span>
                  </label>
                )}
              </div>
            </section>

            <section className="lux-card">
              <div className="card-header"><h3>Visibility & Badges</h3></div>
              <div className="toggle-group">
                <label className="lux-toggle">
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
                  <span className="slider"></span>
                  <span className="toggle-label">Featured Gear</span>
                </label>
              </div>
              <div className="input-group">
                <label>Status Badge</label>
                <select name="badge" value={formData.badge} onChange={handleChange}>
                  <option value="">Standard</option>
                  <option value="TOP">🔥 Top Pick</option>
                  <option value="PRO">⚡ Pro Gear</option>
                  <option value="NEW">🆕 New</option>
                  <option value="SALE">💸 Sale</option>
                </select>
              </div>
            </section>

            <button type="submit" className="save-gear-btn">
              <Save size={18} /> Forge Product
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
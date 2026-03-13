import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";
import { ChevronLeft, Save, Info, Hash, Image as ImageIcon } from "lucide-react";
import "./Product.css";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "", slug: "", brand: "", description: "",
    category: "", imageUrl: "", isFeatured: false, badge: "",
    variants: [],
  });

  useEffect(() => {
    const initPage = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get("/api/categories")
        ]);
        const data = prodRes.data;
        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          brand: data.brand || "",
          description: data.description || "",
          category: data.category?._id || "",
          badge: data.badge || "",
          isFeatured: data.isFeatured || false,
          variants: data.variants || [],
          imageUrl: data.images?.[0] || ""
        });
        setCategories(catRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    initPage();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${id}`, {
        ...formData,
        images: formData.imageUrl ? [formData.imageUrl] : []
      });
      navigate("/admin/products");
    } catch (err) { console.error(err); }
  };

  if (loading) return <AdminLayout><div className="loading-state">Syncing Gear Data...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="form-page-container">
        <header className="form-header">
          <button className="back-btn" onClick={() => navigate("/admin/products")}>
            <ChevronLeft size={18} /> Back
          </button>
          <div className="header-title">
            <h1>Modify Arsenal</h1>
            <p>Editing: <span className="text-neon">{formData.name}</span></p>
          </div>
        </header>

        <form className="lux-form-grid" onSubmit={updateHandler}>
          <div className="form-column main-info">
            <section className="lux-card">
              <div className="card-header"><Info size={16}/> <h3>Product Information</h3></div>
              <div className="input-group">
                <label>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea name="description" rows="5" value={formData.description} onChange={handleChange} />
              </div>
            </section>
            {/* Same Variant Section as Form goes here for consistency */}
          </div>

          <div className="form-column side-info">
             <section className="lux-card">
              <div className="card-header"><ImageIcon size={16}/> <h3>Existing Media</h3></div>
              <div className="media-static">
                 <img src={formData.imageUrl.startsWith('http') ? formData.imageUrl : `http://localhost:5000${formData.imageUrl}`} alt="" />
              </div>
              <div className="input-group mt-4">
                <label>Image Path/URL</label>
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
              </div>
            </section>
            
            <button type="submit" className="save-gear-btn">
              <Save size={18} /> Sync Changes
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
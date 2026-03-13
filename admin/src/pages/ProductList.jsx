import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import { Link } from "react-router-dom";
import { 
  Plus, Search, Filter, Edit3, Trash2, 
  ChevronLeft, ChevronRight, Package, Image as ImageIcon 
} from "lucide-react";
import "./Product.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [sortPrice, setSortPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Increased for better use of space

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data.products);
    } catch (err) { console.error("Error fetching products", err); }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/api/categories");
      setCategories(data);
    } catch (err) { console.error("Error fetching categories", err); }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to remove this gear?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) { console.error("Delete failed", err); }
  };

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || p.category?._id === selectedCategory;
      const stock = p.variants?.reduce((total, v) => total + v.countInStock, 0);
      const matchesStock = stockFilter === "low" ? stock <= 5 : stockFilter === "instock" ? stock > 5 : true;
      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      if (!sortPrice) return 0;
      const priceA = Math.min(...a.variants.map(v => v.price));
      const priceB = Math.min(...b.variants.map(v => v.price));
      return sortPrice === "low" ? priceA - priceB : priceB - priceA;
    });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  return (
    <AdminLayout>
      <div className="product-page-header">
        <div className="header-text">
          <h1>Inventory Management</h1>
          <p>Maintain and monitor your premium gaming gear.</p>
        </div>
        <Link to="/admin/products/new" className="lux-add-btn">
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      <div className="lux-toolbar">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name or brand..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <div className="select-wrapper">
            <Filter size={14} className="select-icon" />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
          </div>
          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
            <option value="">Stock Status</option>
            <option value="low">Low Stock</option>
            <option value="instock">In Stock</option>
          </select>
          <select value={sortPrice} onChange={(e) => setSortPrice(e.target.value)}>
            <option value="">Sort Price</option>
            <option value="low">Lowest Price</option>
            <option value="high">Highest Price</option>
          </select>
        </div>
      </div>

      <div className="lux-table-card">
        <table className="lux-data-table">
          <thead>
            <tr>
              <th>Product Info</th>
              <th>Category</th>
              <th>Price (Base)</th>
              <th>Stock Level</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => {
              const totalStock = product.variants?.reduce((t, v) => t + v.countInStock, 0);
              const minPrice = product.variants?.length ? Math.min(...product.variants.map(v => v.price)) : 0;
              
              return (
                <tr key={product._id}>
                  <td>
                    <div className="product-info-cell">
                      <div className="img-container">
                        {product.images?.[0] ? (
                          <img src={`http://localhost:5000${product.images[0]}`} alt="" />
                        ) : (
                          <ImageIcon size={20} className="text-dim" />
                        )}
                      </div>
                      <div className="name-brand">
                        <span className="p-name">{product.name}</span>
                        <span className="p-brand">{product.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="category-tag">{product.category?.name || "Uncategorized"}</span></td>
                  <td className="fw-bold">₹{minPrice.toLocaleString()}</td>
                  <td>
                    <div className="stock-progress-wrapper">
                      <span className={`stock-number ${totalStock <= 5 ? 'text-red' : ''}`}>
                        {totalStock} units
                      </span>
                    </div>
                  </td>
                  <td>
                    {product.isFeatured && <span className="badge-lux featured">Featured</span>}
                    {!product.isFeatured && <span className="badge-lux standard">Standard</span>}
                  </td>
                  <td>
                    <div className="action-cell">
                      <Link to={`/admin/products/edit/${product._id}`} className="icon-action-btn edit" title="Edit">
                        <Edit3 size={16} />
                      </Link>
                      <button onClick={() => deleteHandler(product._id)} className="icon-action-btn delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Custom Pagination */}
        <div className="lux-pagination">
          <p className="pagination-info">Showing {currentProducts.length} of {filteredProducts.length} gears</p>
          <div className="pagination-controls">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
              <ChevronLeft size={18} />
            </button>
            <span className="page-number">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
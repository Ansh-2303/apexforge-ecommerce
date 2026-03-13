import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "./Product.css";
import { Link } from "react-router-dom";

export default function ProductList() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [sortPrice, setSortPrice] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const token = localStorage.getItem("adminToken");

  const fetchProducts = async () => {
    const { data } = await axios.get(
      "http://localhost:5000/api/products",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setProducts(data.products);
  };

  const fetchCategories = async () => {
    const { data } = await axios.get(
      "http://localhost:5000/api/categories",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCategories(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const deleteHandler = async (id) => {

    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    await axios.delete(
      `http://localhost:5000/api/products/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchProducts();
  };

  const filteredProducts = products
    .filter((product) => {

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        !selectedCategory ||
        product.category?._id === selectedCategory;

      const stock = product.variants?.reduce(
        (total, v) => total + v.countInStock,
        0
      );

      const matchesStock =
        stockFilter === "low"
          ? stock <= 5
          : stockFilter === "instock"
          ? stock > 5
          : true;

      return matchesSearch && matchesCategory && matchesStock;
    })

    .sort((a, b) => {

      if (!sortPrice) return 0;

      const priceA = Math.min(...a.variants.map(v => v.price));
      const priceB = Math.min(...b.variants.map(v => v.price));

      return sortPrice === "low"
        ? priceA - priceB
        : priceB - priceA;

    });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  return (

    <AdminLayout>

      <div className="product-header">

        <h2>Products</h2>

        <div className="product-controls">

          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="product-search"
          />

          <select
            value={selectedCategory}
            onChange={(e)=>setSelectedCategory(e.target.value)}
            className="product-filter"
          >
            <option value="">All Categories</option>

            {categories.map(cat=>(
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}

          </select>

          <select
            value={stockFilter}
            onChange={(e)=>setStockFilter(e.target.value)}
            className="product-filter"
          >
            <option value="">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="instock">In Stock</option>
          </select>

          <select
            value={sortPrice}
            onChange={(e)=>setSortPrice(e.target.value)}
            className="product-filter"
          >
            <option value="">Sort Price</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>
          </select>

          <Link
            to="/admin/products/new"
            className="add-btn"
          >
            + Add Product
          </Link>

        </div>

      </div>

      <div className="product-table">

        <table>

          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Variants</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {currentProducts.map((product) => (

              <tr key={product._id}>

                <td>
             <img
  src={
    product.images?.[0]
      ? `http://localhost:5000${product.images[0]}`
      : "https://picsum.photos/50"
  }
  alt={product.name}
  className="product-img"
/>
                </td>

                <td>{product.name}</td>
                <td>{product.brand}</td>

                <td>
                  {product.category
                    ? product.category.name
                    : "No Category"}
                </td>

                <td>
                  {product.variants?.length
                    ? `₹${Math.min(...product.variants.map(v => v.price))}`
                    : "N/A"}
                </td>

                <td>{product.variants?.length || 0}</td>

                <td>
                  {(() => {

                    const stock = product.variants?.reduce(
                      (total, v) => total + v.countInStock,
                      0
                    );

                    return stock <= 5
                      ? <span className="badge red">Low ({stock})</span>
                      : <span className="badge green">{stock}</span>;

                  })()}
                </td>

                <td>
                  {product.isFeatured
                    ? <span className="badge green">Yes</span>
                    : <span className="badge gray">No</span>}
                </td>

                <td>

                  <div className="action-buttons">

                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="edit-btn"
                    >
                      Edit
                    </Link>

                    <button
                      className="delete-btn"
                      onClick={() => deleteHandler(product._id)}
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="pagination">

        <button
          disabled={currentPage === 1}
          onClick={()=>setCurrentPage(currentPage - 1)}
        >
          ← Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={()=>setCurrentPage(currentPage + 1)}
        >
          Next →
        </button>

      </div>

    </AdminLayout>

  );
}
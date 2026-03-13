import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { getAllProducts } from "../services/productService";
import ProductCard from "../components/product/ProductCard";
import SkeletonCard from "../components/ui/SkeletonCard";
import "../styles/products.css";
import useDebounce from "../hooks/useDebounce";

const Products = () => {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [sort, setSort] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebounce(searchKeyword, 500);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);


  /* ================================
     FETCH CATEGORIES
  ================================= */

  useEffect(() => {

    const fetchCategories = async () => {

      try {
        const { data } = await api.get("/categories");
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }

    };

    fetchCategories();

  }, []);


  /* ================================
     RESET WHEN FILTERS CHANGE
  ================================= */

  useEffect(() => {

    setProducts([]);
    setPage(1);
    setHasMore(true);

  }, [selectedCategory, debouncedSearch, sort, selectedBrand, minPrice, maxPrice]);


  /* ================================
     FETCH PRODUCTS
  ================================= */

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setLoading(true);

        const res = await getAllProducts(
          page,
          10,
          selectedCategory,
          debouncedSearch,
          sort,
          selectedBrand,
          minPrice,
          maxPrice
        );

        if (!res || !res.products) return;

        setProducts(prev => {

          if (page === 1) return res.products;

          return [...prev, ...res.products];

        });

        setTotalPages(res.totalPages || 1);

        if (page >= res.totalPages) {
          setHasMore(false);
        }

        if (res.brands) {
          setBrands(res.brands);
        }

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchProducts();

  }, [page, selectedCategory, debouncedSearch, sort, selectedBrand, minPrice, maxPrice]);


  /* ================================
     INFINITE SCROLL
  ================================= */

 useEffect(() => {

  if (!observerRef.current || !hasMore) return;

  const observer = new IntersectionObserver(
    entries => {

      if (entries[0].isIntersecting && !loading) {
        setPage(prev => prev + 1);
      }

    },
    { rootMargin: "200px" }
  );

  observer.observe(observerRef.current);

  return () => observer.disconnect();

}, [hasMore, loading]);

  return (

    <section className="products-page section">

      <div className="container products-layout">

        {/* HEADER */}

        <div className="products-header">

          <div className="products-title">

            <h2>All Products</h2>

            <span className="products-count">
              Showing {products.length} of {totalPages * 10} products
            </span>

          </div>

          <div className="products-filters">

            <input
              type="text"
              placeholder="Search gaming gear..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />

          </div>

        </div>


        {/* ACTIVE FILTERS */}

        {(selectedCategory || selectedBrand || minPrice || maxPrice) && (

          <div className="active-filters">

            {selectedCategory && (
              <span className="filter-chip">
                Category: {categories.find(c => c._id === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory("")}>✕</button>
              </span>
            )}

            {selectedBrand && (
              <span className="filter-chip">
                Brand: {selectedBrand}
                <button onClick={() => setSelectedBrand("")}>✕</button>
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="filter-chip">
                ₹{minPrice || 0} - ₹{maxPrice || "∞"}
                <button onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                }}>
                  ✕
                </button>
              </span>
            )}

            <button
              className="clear-filters"
              onClick={() => {
                setSelectedCategory("");
                setSelectedBrand("");
                setMinPrice("");
                setMaxPrice("");
                setSearchKeyword("");
              }}
            >
              Clear Filters
            </button>

          </div>

        )}


        {/* MAIN LAYOUT */}

        <div className="products-wrapper">

          {/* SIDEBAR */}

          <aside className="products-sidebar">

            <h4>Filters</h4>

            {/* CATEGORY */}

            <div className="filter-group">

              <label>Category</label>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >

                <option value="">All Categories</option>

                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}

              </select>

            </div>


            {/* SORT */}

            <div className="filter-group">

              <label>Sort</label>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >

                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>

              </select>

            </div>


            {/* BRAND */}

            <div className="filter-group">

              <label>Brand</label>

              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >

                <option value="">All Brands</option>

                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}

              </select>

            </div>


            {/* PRICE RANGE */}

            <div className="filter-group">

              <label>Price Range</label>

              <div className="price-range">

                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />

              </div>

            </div>

          </aside>


          {/* PRODUCTS */}

          <div className="products-content">

            {loading && page === 1 ? (

              <div className="products-grid">

                {Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}

              </div>

            ) : products.length === 0 ? (

              <div className="empty-products">

                <h3>No products found</h3>
                <p>Try changing filters or search keyword.</p>

              </div>

            ) : (

              <>
                <div className="products-grid">

                  {products.map(product => (

                    <ProductCard
                      key={product._id}
                      product={product}
                    />

                  ))}

                </div>

                {/* INFINITE SCROLL TRIGGER */}

                {hasMore && (
                  <div ref={observerRef} className="infinite-loader">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                )}

              </>
            )}

          </div>

        </div>

      </div>

    </section>

  );

};

export default Products;
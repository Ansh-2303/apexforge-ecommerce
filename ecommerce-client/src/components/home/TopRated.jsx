import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import ProductCard from "../product/ProductCard";

const TopRated = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts(1, 20);

        if (!data || !data.products) {
          setProducts([]);
          return;
        }

        const sorted = data.products
          .filter((p) => p.rating && p.rating > 0)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4);

        setProducts(sorted);
      } catch (error) {
        console.error("TopRated fetch error:", error);
      }
    };

    fetchProducts();
  }, []);

  if (!products.length) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2>Community Favorites</h2>
            <p className="section-subtitle">
              Top rated gaming gear loved by players
            </p>
          </div>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRated;
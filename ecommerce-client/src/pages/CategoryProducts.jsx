import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import api from "../services/api";

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const decodedCategory = decodeURIComponent(categoryName);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        // 1️⃣ Get all categories
        const { data: categories } = await api.get("/categories");

        // 2️⃣ Find matching category by name
        const matchedCategory = categories.find(
          (cat) => cat.name === decodedCategory
        );

        if (!matchedCategory) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // 3️⃣ Fetch products using category ID
        const { data } = await api.get(
          `/products?category=${matchedCategory._id}`
        );

        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch category products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [decodedCategory]);

  if (loading) {
    return <div style={{ padding: "100px" }}>Loading...</div>;
  }

  return (
    <section style={{ padding: "100px 40px" }}>
      <h2 style={{ marginBottom: "40px" }}>
        {decodedCategory}
      </h2>

<div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default CategoryProducts;
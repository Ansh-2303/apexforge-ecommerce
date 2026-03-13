import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import { useNavigate } from "react-router-dom";
import "./Categories.css";

const Categories = () => {

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchCategories = async () => {

      try {

        const data = await getCategories();
        setCategories(data);

      } catch (error) {

        console.error("Failed to fetch categories", error);

      }

    };

    fetchCategories();

  }, []);

  return (

    <section className="section section-alt">

      <div className="container">

        <div className="section-header">

          <div>

            <h2>Shop by Category</h2>

            <p className="categories-subtitle">
              Discover gaming gear built for precision and performance
            </p>

          </div>

        </div>

        <div className="categories-grid">

          {categories.map((cat) => (

            <div
              key={cat._id}
              className="category-card"
              onClick={() =>
                navigate(`/category/${encodeURIComponent(cat.name)}`)
              }
            >

              <div className="category-image">

                <img
                  src={`https://picsum.photos/500?random=${cat._id}`}
                  alt={cat.name}
                />

              </div>

              <div className="category-info">

                <h3>{cat.name}</h3>

                <span className="category-arrow">
                  →
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

};

export default Categories;
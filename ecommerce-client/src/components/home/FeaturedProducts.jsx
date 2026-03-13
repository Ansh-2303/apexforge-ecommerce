import { useEffect, useState } from "react"
import { getFeaturedProducts } from "../../services/productService"
import ProductCard from "../product/ProductCard"
import SkeletonCard from "../ui/SkeletonCard"
import { Link } from "react-router-dom"

const FeaturedProducts = () => {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {

    const fetchFeatured = async () => {

      try {

        const data = await getFeaturedProducts()

        setProducts(data)

      } catch {

        setError("Failed to load featured products")

      } finally {

        setLoading(false)

      }

    }

    fetchFeatured()

  }, [])

  return (

<section className="section-sm featured-section">

      <div className="container">

        <div className="section-header">

          <div>

            <h2>Featured Gaming Gear</h2>

            <p className="section-subtitle">
              Precision-built peripherals designed for elite performance
            </p>

          </div>

          <Link to="/products" className="btn btn-outline">
            View All
          </Link>

        </div>

        {loading ? (

          <div className="products-grid">

            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}

          </div>

        ) : error ? (

          <p style={{ color: "red" }}>{error}</p>

        ) : (

          <div className="products-grid">

            {products.map((product) => (

              <ProductCard
                key={product._id}
                product={product}
              />

            ))}

          </div>

        )}

      </div>

    </section>

  )

}

export default FeaturedProducts
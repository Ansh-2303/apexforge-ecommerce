import "./ProductCard.css"
import { useNavigate } from "react-router-dom"
import { useWishlist } from "../../context/WishlistContext"
import { useCart } from "../../context/CartContext"
import Rating from "../ui/Rating"
import ProductQuickView from "./ProductQuickView"
import { useState } from "react"

const ProductCard = ({ product }) => {

  const navigate = useNavigate()

  const { toggleWishlist, wishlist } = useWishlist()
  const { addToCart } = useCart()

  const wishlisted = wishlist.some(item => item._id === product._id)

  const [quickView, setQuickView] = useState(null)

  const handleNavigate = () => {
    navigate(`/product/${product.slug}`)
  }

  const handleWishlist = (e) => {
    e.stopPropagation()
    e.preventDefault()
    toggleWishlist(product._id)
  }

  const handleAddToCart = (e) => {

    e.stopPropagation()
    e.preventDefault()

    if (!product.variants || product.variants.length === 0) return

    addToCart({
      productId: product._id,
      variantId: product.variants[0]._id,
      quantity: 1
    })
  }

  /* ========================
     PRICE
  ======================== */

  const getMinPrice = () => {
    if (!product.variants || product.variants.length === 0) return null
    return Math.min(...product.variants.map(v => v.price))
  }

  const minPrice = getMinPrice()

  /* ========================
     STOCK
  ======================== */

const totalStock = product?.variants?.reduce((sum, variant) => {

  const stock =
    variant.stock ??
    variant.quantity ??
    variant.countInStock ??
    variant.inventory ??
    0;

  return sum + stock;

}, 0) || 0;
  /* ========================
     IMAGES
  ======================== */

  const image1 = product.images?.length
    ? product.images[0]
    : "https://picsum.photos/600"

  const image2 = product.images?.length > 1
    ? product.images[1]
    : null

  return (
    <>
      <div className="product-card" onClick={handleNavigate}>

        <div className="product-image">

          {/* BADGE */}

          {product.badge && (
            <span className={`badge badge-${product.badge.toLowerCase()}`}>
              {product.badge === "TOP" && "🔥 Top Pick"}
              {product.badge === "PRO" && "⚡ Pro Gear"}
              {product.badge === "NEW" && "🆕 New"}
              {product.badge === "SALE" && "💸 Sale"}
            </span>
          )}

          {/* STOCK BADGE */}

          {totalStock === 0 && (
            <span className="stock-badge out">Out of Stock</span>
          )}

          {totalStock > 0 && totalStock <= 5 && (
            <span className="stock-badge low">Low Stock</span>
          )}

          {/* IMAGE WRAPPER */}

          <div className="image-wrapper">

            <img
              src={image1.startsWith("http") ? image1 : `http://localhost:5000${image1}`}
              alt={product.name}
              className="primary-img"
              loading="lazy"
              decoding="async"
            />

            {image2 && (
              <img
                src={image2.startsWith("http") ? image2 : `http://localhost:5000${image2}`}
                alt={product.name}
                className="hover-img"
                loading="lazy"
                decoding="async"
              />
            )}

          </div>

          {/* WISHLIST */}

          <button
            className={`wishlist-btn ${wishlisted ? "active" : ""}`}
            onClick={handleWishlist}
          >
            {wishlisted ? "❤" : "♡"}
          </button>

          {/* ACTION BUTTONS */}

          <div className="product-actions">

            <button
              className="cart-btn"
              disabled={totalStock === 0}
              onClick={handleAddToCart}
            >
              {totalStock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              className="view-btn"
              onClick={(e) => {
                e.stopPropagation()
                setQuickView(product)
              }}
            >
              Quick View
            </button>

          </div>

        </div>

        {/* PRODUCT INFO */}

        <div className="product-info">

          <h3 className="product-title">{product.name}</h3>

          {product.brand && (
            <p className="product-brand">{product.brand}</p>
          )}

          <p className="product-price">
            {minPrice ? `₹${minPrice}` : "Price unavailable"}
          </p>

          <Rating
            value={product.rating}
            count={product.reviews?.length || 0}
          />

        </div>

      </div>

      {/* QUICK VIEW */}

      {quickView && (
        <ProductQuickView
          product={quickView}
          onClose={() => setQuickView(null)}
        />
      )}
    </>
  )
}

export default ProductCard
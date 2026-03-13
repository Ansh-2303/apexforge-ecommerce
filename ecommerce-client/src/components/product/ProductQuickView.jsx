import { useState, useMemo } from "react"
import "./ProductQuickView.css"
import Rating from "../ui/Rating"
import { useCart } from "../../context/CartContext"
import formatPrice from "../../utils/formatPrice"

export default function ProductQuickView({ product, onClose }) {
  const { addToCart } = useCart()

  const [activeImage, setActiveImage] = useState(product.images?.[0])
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null
  )

  const stockStatus = useMemo(() => {
    if (!selectedVariant) return "out"

    if (selectedVariant.stock === 0) return "out"
    if (selectedVariant.stock < 5) return "low"
    return "in"
  }, [selectedVariant])

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock === 0) return

    addToCart({
      ...product,
      variant: selectedVariant
    })
  }

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div
        className="quickview-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="quickview-close" onClick={onClose}>
          ✕
        </button>

        <div className="quickview-content">
          {/* IMAGE SECTION */}

          <div className="quickview-images">
            <div className="quickview-main-image">
              <img src={activeImage} alt={product.name} />
            </div>

            <div className="quickview-thumbnails">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className={
                    activeImage === img ? "thumb active" : "thumb"
                  }
                  onClick={() => setActiveImage(img)}
                />
              ))}
            </div>
          </div>

          {/* INFO SECTION */}

          <div className="quickview-info">
            <p className="quickview-brand">{product.brand}</p>

            <h2 className="quickview-title">{product.name}</h2>

            <div className="quickview-rating">
              <Rating value={product.rating || 0} />
              <span className="review-count">
                ({product.numReviews || 0} reviews)
              </span>
            </div>

            {/* PRICE */}

            <div className="quickview-price">
              {selectedVariant?.salePrice ? (
                <>
                  <span className="sale">
                    {formatPrice(selectedVariant.salePrice)}
                  </span>
                  <span className="original">
                    {formatPrice(selectedVariant.price)}
                  </span>
                </>
              ) : (
                <span className="sale">
                  {formatPrice(selectedVariant?.price || 0)}
                </span>
              )}
            </div>

            {/* STOCK */}

            <div className={`stock ${stockStatus}`}>
              {stockStatus === "in" && "🟢 In Stock"}
              {stockStatus === "low" && "🟡 Low Stock"}
              {stockStatus === "out" && "🔴 Out of Stock"}
            </div>

            {/* VARIANTS */}

            {product.variants?.length > 0 && (
              <div className="variant-section">
                <p className="variant-title">Select Variant</p>

                <div className="variant-options">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      className={
                        selectedVariant?._id === variant._id
                          ? "variant active"
                          : "variant"
                      }
                      onClick={() => setSelectedVariant(variant)}
                    >
                      {variant.color || variant.size || variant.sku}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DESCRIPTION */}

            <p className="quickview-desc">
              {product.description?.slice(0, 150)}...
            </p>

            {/* ACTIONS */}

            <div className="quickview-actions">
              <button
                className="add-to-cart"
                disabled={stockStatus === "out"}
                onClick={handleAddToCart}
              >
                Add To Cart
              </button>

              <button
                className="view-product"
                onClick={() =>
                  (window.location.href = `/product/${product._id}`)
                }
              >
                View Full Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
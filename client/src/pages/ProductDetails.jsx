import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductBySlug, getAllProducts } from "../services/productService";
import "./ProductDetails.css";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import ProductCard from "../components/product/ProductCard";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();  
  const [selectedImage, setSelectedImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");
  const galleryImages =
  product?.images?.length && product.images[0].startsWith("http")
    ? product.images
    : [
        "https://picsum.photos/600",
        "https://picsum.photos/601",
        "https://picsum.photos/602"
      ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductBySlug(slug);
        console.log(data);
        
        setProduct(data);
        
const res = await getAllProducts();
const products = res.products;

const filtered = products
  .filter(p => p.category === data.category && p._id !== data._id)
  .slice(0,4);

setRelatedProducts(filtered);
        
setSelectedImage(
  data.images?.length && data.images[0].startsWith("http")
    ? data.images[0]
    : "https://picsum.photos/600"
);
        if (data.variants?.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [slug]);

  const submitReview = async () => {
  try {

    await api.post(`/products/${product._id}/reviews`, {
      rating,
      comment
    });

    alert("Review submitted");

    const updated = await getProductBySlug(slug);
    setProduct(updated);

    setComment("");

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Error submitting review");
  }
};

  if (!product) return <h2>Loading...</h2>;

  const isOutOfStock = selectedVariant?.countInStock === 0;

 return (

  <div className="container">
    <div className="breadcrumb">
  <span>Home</span>
  <span className="breadcrumb-sep">›</span>
  <span>Products</span>
  <span className="breadcrumb-sep">›</span>
  <span className="breadcrumb-current">{product.name}</span>
</div>

    {/* PRODUCT SECTION */}
    <div className="product-details">

      <div className="product-image-box">

        <div className="product-gallery">

          <div className="product-thumbnails">
            {galleryImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumb"
                onClick={() => setSelectedImage(img)}
                className={selectedImage === img ? "active" : ""}
              />
            ))}
          </div>

         <div
  className="product-main-image"
  onMouseMove={(e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    e.currentTarget.style.setProperty("--zoom-x", `${x}%`);
    e.currentTarget.style.setProperty("--zoom-y", `${y}%`);
  }}
>
  <img
    src={
      selectedImage && selectedImage.startsWith("http")
        ? selectedImage
        : "https://picsum.photos/600"
    }
    alt={product?.name}
  />
</div>

        </div>

      </div>

      <div className="product-info-box">

        <h1>{product.name}</h1>

<div className="product-rating">
  {product.rating > 0 && "⭐".repeat(Math.round(product.rating))}
  <span className="rating-count">
    ({product.numReviews} reviews)
  </span>
</div>

        <p className="product-brand">Brand: {product.brand}</p>

        {/* Variant Selector */}
        <div>
          <label>Select Variant:</label>

          <select
            value={selectedVariant?._id || ""}
            onChange={(e) => {
              const variant = product.variants.find(
                (v) => v._id === e.target.value
              );
              setSelectedVariant(variant);
            }}
          >
            {product?.variants?.map((variant) => (
              <option key={variant._id} value={variant._id}>
                {variant.size} / {variant.color} — ₹{variant.price}
              </option>
            ))}
          </select>
        </div>

        <div className="product-price">
          ₹{selectedVariant?.price}
        </div>

        {/* Stock */}
        <div className="product-stock">
          {selectedVariant?.countInStock > 0 ? (
            <span style={{ color: "green" }}>
              In Stock ({selectedVariant.countInStock} available)
            </span>
          ) : (
            <span style={{ color: "red" }}>Out of Stock</span>
          )}
        </div>

        <div className="product-description">
          {product.description}
        </div>

        {/* Quantity */}
        <div className="quantity-selector">

          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          >
            −
          </button>

          <span>{quantity}</span>

          <button
            onClick={() =>
              setQuantity((prev) =>
                Math.min(selectedVariant?.countInStock || 1, prev + 1)
              )
            }
          >
            +
          </button>

        </div>

        {/* Add to Cart */}
        <button
          className="add-to-cart-btn"
          disabled={!selectedVariant || isOutOfStock}
          onClick={() =>
            addToCart({
              productId: product._id,
              variantId: selectedVariant._id,
              quantity: quantity,
            })
          }
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>

        <div className="product-trust">
  <span>✓ Secure Payment</span>
  <span>✓ Easy Returns</span>
  <span>✓ Fast Delivery</span>
</div>

      </div>

    </div>


    {/* PRODUCT TABS */}
    <div className="product-tabs">

      <div className="tab-buttons">

        <button
          className={activeTab === "description" ? "active" : ""}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>

        <button
          className={activeTab === "specs" ? "active" : ""}
          onClick={() => setActiveTab("specs")}
        >
          Specifications
        </button>

        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>

      </div>


      <div className="tab-content">

        {activeTab === "description" && (
          <p>{product.description}</p>
        )}

        {activeTab === "specs" && (
          <div>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Category:</strong> {product.category}</p>
          </div>
        )}

     {activeTab === "reviews" && (

<div className="reviews-section">

<h3>Customer Reviews</h3>

<div className="review-summary">

  <div className="review-average">

    <h2>{product.rating?.toFixed(1) || 0} ⭐</h2>

    <p>{product.numReviews} reviews</p>

  </div>

  <div className="review-bars">

    {[5,4,3,2,1].map((star) => {

      const count = product.reviews.filter(r => r.rating === star).length

      const percent =
        product.reviews.length > 0
          ? (count / product.reviews.length) * 100
          : 0

      return (

        <div key={star} className="review-bar-row">

          <span>{star} ⭐</span>

          <div className="review-bar">

            <div
              className="review-bar-fill"
              style={{ width: `${percent}%` }}
            ></div>

          </div>

          <span>{count}</span>

        </div>

      )

    })}

  </div>

</div>

  {product.reviews?.length === 0 && (
    <p>No reviews yet.</p>
  )}

{product.reviews?.map((review) => (

  <div key={review._id} className="review-item">

    <div className="review-header">

      <strong>{review.name}</strong>

      <span className="verified-badge">
        ✔ Verified Buyer
      </span>

    </div>

    <div className="review-stars">
      {"⭐".repeat(review.rating)}
    </div>

    <p className="review-comment">
      {review.comment}
    </p>

    <span className="review-date">
      {new Date(review.createdAt).toLocaleDateString()}
    </span>

  </div>

))}

  <div className="review-form">

    <h4>Write a Review</h4>

<div className="star-rating">

  {[1,2,3,4,5].map((star) => (

    <span
      key={star}
      onClick={() => setRating(star)}
      className={star <= rating ? "star active" : "star"}
    >
      ★
    </span>

  ))}

</div>

    <textarea
      placeholder="Write your review..."
      value={comment}
      onChange={(e) => setComment(e.target.value)}
    />

    <button onClick={submitReview}>
      Submit Review
    </button>

  </div>

</div>

)}
      </div>

      <div className="related-products">

  <h2>You may also like</h2>

  <div className="related-products-grid">
    {relatedProducts.map((item) => (
      <ProductCard key={item._id} product={item} />
    ))}
  </div>

</div>

    </div>

<div className="sticky-cart">
  <div className="sticky-cart-content">

    <div className="sticky-cart-info">
      <span className="sticky-name">{product.name}</span>
      <span className="sticky-price">₹{selectedVariant?.price}</span>
    </div>

    <button
      className="sticky-cart-btn"
      disabled={!selectedVariant || isOutOfStock}
      onClick={() =>
        addToCart({
          productId: product._id,
          variantId: selectedVariant._id,
          quantity: quantity,
        })
      }
    >
      Add to Cart
    </button>

  </div>
</div>
  </div>
);  
};

export default ProductDetails;
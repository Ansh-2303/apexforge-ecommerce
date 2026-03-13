import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";
import toast from "react-hot-toast";

const Cart = () => {

  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc + (item.variantDetails?.price || item.price) * item.quantity,
    0
  );

  const freeShippingThreshold = 200;
  const progress = Math.min((totalPrice / freeShippingThreshold) * 100, 100);

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any gear yet.</p>

        <button
          className="browse-btn"
          onClick={() => navigate("/products")}
        >
          Browse Gaming Gear
        </button>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container">

        <h2 className="cart-title">Shopping Cart</h2>

        {/* SHIPPING PROGRESS */}

        <div className="shipping-progress">

          <p>
            {totalPrice >= freeShippingThreshold
              ? "You unlocked free shipping!"
              : `Add ₹${(freeShippingThreshold - totalPrice).toFixed(2)} more for free shipping`}
          </p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

        <div className="cart-layout">

          {/* LEFT SIDE */}

          <div>

            <div className="cart-header">
              <span>Product</span>
              <span></span>
              <span>Price</span>
              <span>Action</span>
            </div>

            <div className="cart-items">

              {cartItems.map((item) => {

                const price = item.variantDetails?.price || item.price;

               const stock =
  item.variantDetails?.stock ??
  item.variantDetails?.countInStock ??
  item.variant?.stock ??
  item.variant?.countInStock ??
  0

                return (

                  <div
                    key={`${item.product._id}-${item.variant}`}
                    className={`cart-item ${item.removing ? "removing" : ""}`}
                  >

                    {/* IMAGE */}

                    <div className="cart-image">
                      <img
                        src={
                          item.product.images?.[0]?.url ||
                          item.product.image ||
                          "https://picsum.photos/100"
                        }
                        alt={item.product.name}
                      />
                    </div>

                    {/* INFO */}

                    <div className="cart-item-info">

                      <h3>{item.product.name}</h3>

                      <p>SKU: {item.sku}</p>

                      {stock > 0 && stock <= 5 && (
                        <p className="stock-warning">
                          Only {stock} left in stock
                        </p>
                      )}

                      {/* QUANTITY */}

                      <div className="cart-quantity">

                        <button
                          disabled={item.quantity === 1}
                          onClick={() => {

                            updateQuantity(
                              item.product._id,
                              item.variant,
                              item.quantity - 1
                            );

                            toast.success("Cart updated");

                          }}
                        >
                          -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() => {

                            if (item.quantity >= stock) {
                              toast.error("Maximum stock reached");
                              return;
                            }

                            updateQuantity(
                              item.product._id,
                              item.variant,
                              item.quantity + 1
                            );

                            toast.success("Cart updated");

                          }}
                        >
                          +
                        </button>

                      </div>

                      {/* ITEM SUBTOTAL */}

                      <p className="item-subtotal">
                        Subtotal: ₹{(price * item.quantity).toFixed(2)}
                      </p>

                    </div>

                    {/* PRICE */}

                    <div className="cart-item-total">
                      ₹{(price * item.quantity).toFixed(2)}
                    </div>

                    {/* REMOVE */}

                    <button
                      className="remove-btn"
                      onClick={() => {

                        removeFromCart(item.product._id, item.variant);
                        toast.success("Item removed");

                      }}
                    >
                      Remove
                    </button>

                  </div>

                );

              })}

            </div>

          </div>

          {/* ORDER SUMMARY */}

          <div className="cart-summary">

            <h3>Order Summary</h3>

            {(() => {

              const subtotal = totalPrice;
              const shipping = subtotal >= freeShippingThreshold ? 0 : 40;
              const tax = subtotal * 0.05;
              const total = subtotal + shipping + tax;

              return (
                <>
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                  </div>

                  <div className="summary-row">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>

                  <div className="summary-total">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </>
              );

            })()}

            {/* COUPON */}

            <input
              className="coupon-input"
              placeholder="Coupon Code"
            />

            <button className="apply-coupon">
              Apply
            </button>

            {/* CHECKOUT */}

            <button
              className="checkout-btn"
              disabled={cartItems.length === 0}
              onClick={() => navigate("/checkout")}
            >
              Secure Checkout
            </button>

            <div className="secure-checkout">
              🔒 Secure Payments
            </div>

          </div>

        </div>

      </div>
    </section>
  );

};

export default Cart;
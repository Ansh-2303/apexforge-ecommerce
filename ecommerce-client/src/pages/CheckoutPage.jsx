import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/checkout.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, fetchCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setAddressLoading(true);
        const { data } = await api.get("/addresses");
        setAddresses(data);

        const defaultAddress = data.find((a) => a.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        } else if (data.length > 0) {
          setSelectedAddressId(data[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      } finally {
        setAddressLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    if (!orderPlaced && cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, orderPlaced, navigate]);

  useEffect(() => {
    if (!addressLoading && addresses.length === 0) {
      alert("Please add an address before checkout");
      navigate("/addresses");
    }
  }, [addressLoading, addresses, navigate]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || item.price) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (loading) return;
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

    if (!selectedAddress) {
      alert("Please select a shipping address.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/orders", {
        shippingAddress: {
          fullName: selectedAddress.fullName,
          address: selectedAddress.address,
          city: selectedAddress.city,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
        },
        paymentMethod: "COD",
        couponCode,
      });

      const orderId = data._id || data.order?._id;

      if (!orderId) {
        alert("Order creation failed");
        return;
      }
      
      setOrderPlaced(true);
      await fetchCart();
      navigate(`/payment/${orderId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkout">
      <div className="checkout-container">
        
        {/* LEFT SIDE */}
        <div className="checkout-left">
          <h2 className="checkout-title">Select Shipping Address</h2>

          <div className="checkout-steps">
            <div className="step completed">
              <span>1</span><p>Cart</p>
            </div>
            <div className="step active">
              <span>2</span><p>Address</p>
            </div>
            <div className="step">
              <span>3</span><p>Payment</p>
            </div>
          </div>

          <div className="addresses">
            {addressLoading ? (
              <p className="loading-text">Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <p>No address found. Please add one.</p>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr._id}
                  onClick={() => setSelectedAddressId(addr._id)}
                  className={`address-card ${selectedAddressId === addr._id ? "active" : ""}`}
                >
                  <div className="address-top">
                    <h4>{addr.label || "Home"}</h4>
                    {addr.isDefault && <span className="default-badge">Default</span>}
                  </div>
                  <p>{addr.fullName}</p>
                  <p>{addr.address}</p>
                  <p>{addr.city}, {addr.postalCode}</p>
                  <p>{addr.country}</p>
                </div>
              ))
            )}
          </div>

          {/* CART ITEMS */}
          <div className="checkout-items">
            <h2>Your Items</h2>
            {cartItems.map((item) => (
              <div key={item._id} className="checkout-item">
                <img
                  src={
                    item.product?.images?.[0]?.url ||
                    item.product?.image ||
                    "https://picsum.photos/100"
                  }
                  alt={item.product?.name}
                />
                <div className="item-info">
                  <p className="item-name">{item.product?.name}</p>
                  <p className="item-qty">Qty: {item.quantity}</p>
                </div>
                <div className="item-price">
                  ₹{((item.product?.price || item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          
          <div className="divider"></div>
          
          <div className="summary-total">
            <span>Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <input
            className="coupon"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />

          <button
            className="place-order"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>

          <div className="secure-checkout">
            🔒 Secure 256-bit Encryption
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
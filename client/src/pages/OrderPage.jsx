import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/order-details.css";

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        alert("Order not found");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="order-loading">
        <div className="spinner"></div>
        <p>Decrypting Secure Order Data...</p>
      </div>
    );
  }

  if (!order) return null;

  // --- Utility Functions ---
  const steps = ["Placed", "Paid", "Shipped", "Delivered"];

  const getCurrentStep = () => {
    if (order.status === "pending") return 0;
    if (order.status === "paid" || order.status === "processing") return 1;
    if (order.status === "shipped") return 2;
    if (order.status === "delivered") return 3;
    return 0;
  };

  const currentStep = getCurrentStep();

  const getTrackingLink = () => {
    if (!order.shipment?.trackingNumber) return null;
    let url = order.shipment.trackingUrl;
    if (url && !url.startsWith("http")) url = "https://" + url;
    return url || `https://www.google.com/search?q=${order.shipment.courier}+${order.shipment.trackingNumber}`;
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(order._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadInvoice = () => {
    window.print(); // Triggers browser print/save as PDF. Styled in CSS!
  };

  const formattedDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <section className="order-section">
      <div className="order-container">
        
        {/* --- Header Area --- */}
        <div className="order-header-main">
          <div className="order-title-group">
            <h2 className="order-page-title">
  Order <span>#{order._id}</span>
</h2>
            <button className="btn-copy" onClick={handleCopyId} title="Copy Order ID">
              {copied ? "✓ Copied" : "📋 Copy ID"}
            </button>
          </div>
          <div className="order-actions">
            <button className="btn-invoice" onClick={handleDownloadInvoice}>
              📄 Download Invoice
            </button>
          </div>
        </div>
        
        <p className="order-date-text">Placed on {formattedDate}</p>

        {/* --- Neon Timeline --- */}
        <div className="order-timeline">
          <div
            className="timeline-progress"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((step, index) => (
            <div key={index} className={`timeline-step ${index <= currentStep ? "active" : ""}`}>
              <div className="timeline-circle">
                {index <= currentStep ? "✓" : index + 1}
              </div>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="order-grid">
          
          {/* --- LEFT COLUMN: Order Info --- */}
          <div className="order-left">
            
            <div className="order-card">
              <h3>Transaction Summary</h3>
              <div className="order-row">
                <span>Status</span>
                <span className={`status-badge ${order.status}`}>{order.status}</span>
              </div>
              <div className="order-row">
                <span>Payment Method</span>
                <span className="text-highlight">{order.paymentMethod || "COD"}</span>
              </div>
              <div className="order-row">
                <span>Total Amount</span>
                <span className="order-total-price">₹{order.totalPrice.toFixed(2)}</span>
              </div>
              <div className="order-row">
                <span>Payment Status</span>
                <span className={order.isPaid ? "text-green" : "text-red"}>
                  {order.isPaid ? "Payment Secured" : "Pending Verification"}
                </span>
              </div>

              {!order.isPaid && (
                <button className="btn-pay-now" onClick={() => navigate(`/payment/${order._id}`)}>
                  Complete Secure Payment
                </button>
              )}
            </div>

            {/* Shipping Address Card */}
            {order.shippingAddress && (
              <div className="order-card address-card">
                <h3>Shipping Destination</h3>
                <div className="address-details">
                  <p className="address-name">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            )}

            {/* Shipment Tracking Card */}
            {order.shipment?.courier && (
              <div className="order-card">
                <h3>Logistics & Tracking</h3>
                <div className="order-row">
                  <span>Carrier</span>
                  <span className="text-highlight">{order.shipment.courier}</span>
                </div>
                <div className="order-row">
                  <span>Tracking ID</span>
                  <span className="text-highlight">{order.shipment.trackingNumber}</span>
                </div>
                {getTrackingLink() && (
                  <a href={getTrackingLink()} target="_blank" rel="noopener noreferrer" className="track-link">
                    Track Live Status ➔
                  </a>
                )}
              </div>
            )}

          </div>

          {/* --- RIGHT COLUMN: Items & Support --- */}
          <div className="order-right">
            
            <div className="order-card items-card">
              <h3>Equipment Roster</h3>
              <div className="order-items-list">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-left">
                      <div className="image-wrapper">
                        <img
                          src={item.image || item.product?.image || "https://via.placeholder.com/80x80/0f172a/22c55e?text=GEAR"}
                          alt={item.name}
                          className="item-image"
                        />
                        <span className="item-qty-badge">{item.quantity}</span>
                      </div>
                      <div className="item-info">
                        <p className="item-name">{item.name}</p>
                        <span className="item-price-small">₹{item.price.toFixed(2)} each</span>
                      </div>
                    </div>
                    <div className="item-price">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Card */}
            <div className="order-card support-card">
              <h3>Need Assistance?</h3>
              <p>Our elite support team is on standby 24/7 for order modifications or technical help.</p>
              <button className="btn-support" onClick={() => navigate('/contact')}>
                Open Support Ticket
              </button>
            </div>

          </div>
          
        </div>
      </div>
    </section>
  );
};

export default OrderPage;
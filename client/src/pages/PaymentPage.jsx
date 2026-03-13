import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/payment.css";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [method, setMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [checkingOrder, setCheckingOrder] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyOrder = async () => {
      try {
        await api.get(`/orders/${id}`);
        setCheckingOrder(false);
      } catch (err) {
        alert("Invalid or expired order.");
        navigate("/");
      }
    };
    verifyOrder();
  }, [id, navigate]);

  const handlePayment = async () => {
    if (method === "ONLINE") {
      setError("Online payment will be enabled soon. Please select COD.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      await api.post(`/orders/${id}/pay`, {
        paymentMethod: "COD"
      });

      navigate(`/order/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingOrder) {
    return (
      <div className="payment-loading">
        <div className="spinner"></div>
        <p>Verifying Secure Environment...</p>
      </div>
    );
  }

  return (
    <section className="payment-section">
      <div className="payment-container">
        
        <div className="order-header">
          <p>Order ID</p>
          <h3>{id}</h3>
        </div>

        <div className="payment-methods">
          {/* COD OPTION */}
          <div
            className={`payment-card ${method === "COD" ? "active" : ""}`}
            onClick={() => {
              setMethod("COD");
              setError("");
            }}
          >
            <div className="custom-radio"></div>
            <div className="payment-info">
              <h4>Cash On Delivery</h4>
              <p>Pay safely when the gear arrives at your door.</p>
            </div>
          </div>

          {/* ONLINE OPTION (DISABLED) */}
          <div
            className={`payment-card disabled ${method === "ONLINE" ? "active" : ""}`}
            onClick={() => setMethod("ONLINE")}
          >
            <div className="custom-radio"></div>
            <div className="payment-info">
              <h4>Pay Online (Razorpay)</h4>
              <p>Secure payment via Credit/Debit or UPI.</p>
            </div>
            <span className="badge-soon">Coming Soon</span>
          </div>
        </div>

        {error && (
          <div className="payment-error">
            ⚠️ {error}
          </div>
        )}

        <button
          className="btn-confirm"
          onClick={handlePayment}
          disabled={loading || method === "ONLINE"}
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </button>

        <p className="secure-footer">
          🔒 256-bit Encrypted Checkout
        </p>

      </div>
    </section>
  );
};

export default PaymentPage;
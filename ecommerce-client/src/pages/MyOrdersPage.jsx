import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/orders.css";

const MyOrdersPage = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const { data } = await api.get("/orders/my");
        setOrders(data || []);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, []);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          Loading orders...
        </div>
      </section>
    );
  }

  if (!orders.length) {

    return (
      <section className="section">

        <div className="container empty-state">

          <h2>No orders yet</h2>

          <p>
            Start shopping to see your orders here.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </button>

        </div>

      </section>
    );

  }

  return (

    <section className="section">

      <div className="container">

        <h2 className="orders-title">
          My Orders
        </h2>

        <div className="orders-grid">

          {orders.map((order) => (

            <div
              key={order._id}
              className="order-card"
            >

              <div className="order-card-top">

                <span className="order-id">
                  #{order._id.slice(-6).toUpperCase()}
                </span>

                <span
                  className={`order-status ${order.status?.toLowerCase()}`}
                >
                  {order.status}
                </span>

              </div>

              <div className="order-info">

                <div className="order-row">
                  <span>Total</span>
                  <strong>
                    ₹{order.totalPrice.toFixed(2)}
                  </strong>
                </div>

                <div className="order-row">
                  <span>Items</span>
                  <span>
                    {order.orderItems?.length || 1}
                  </span>
                </div>

                <div className="order-row">
                  <span>Date</span>
                  <span>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

              </div>

              <button
                className="btn btn-outline order-view-btn"
                onClick={() =>
                  navigate(`/order/${order._id}`)
                }
              >
                View Details →
              </button>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

};

export default MyOrdersPage;
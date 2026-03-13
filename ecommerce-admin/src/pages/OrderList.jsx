import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import "./OrderList.css";

const OrderList = () => {


  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showShipModal, setShowShipModal] = useState(false);
  const [selectedOrder,setSelectedOrder] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

const updateStatus = async (id, status) => {
  try {

    await api.put(`/orders/${id}`, { status });

    // update UI instantly
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === id ? { ...order, status } : order
      )
    );

  } catch (error) {
    console.error("Error updating status:", error);
  }
};
  const openShipModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCourier("");
    setTrackingNumber("");
    setTrackingUrl("");
    setShowShipModal(true);
  };

  const handleShip = async () => {
    try {

      await api.put(`/orders/${selectedOrderId}/ship`, {
        courier,
        trackingNumber,
        trackingUrl,
      });

      setShowShipModal(false);
      fetchOrders();

    } catch (error) {
      console.error("Error shipping order:", error);
    }
  };

  const handleDeliver = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/deliver`);
      fetchOrders();
    } catch (error) {
      console.error("Error delivering order:", error);
    }
  };

  const exportCSV = () => {

    const rows = [
      ["OrderID","Customer","Total","Status"]
    ];

    orders.forEach(o => {
      rows.push([
        o._id,
        o.user?.name || "Customer",
        o.totalPrice,
        o.status
      ]);
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map(e => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "orders.csv";

    document.body.appendChild(link);
    link.click();

  };

  const filteredOrders = orders.filter(order => {

    const matchesSearch =
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;

  });

  return (

    <AdminLayout>

      <div className="orders-header">
        <h2>Order Management</h2>
        <p>Manage all customer orders</p>
      </div>

      {/* Tools */}

      <div className="orders-tools">

        <input
          type="text"
          placeholder="Search order or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="orders-search"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="orders-filter"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          className="export-btn"
          onClick={exportCSV}
        >
          Export CSV
        </button>

      </div>

      {/* Orders Table */}

      <div className="orders-table-wrapper">

        <table className="orders-table">

          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredOrders.map(order => (

              <tr key={order._id}>

    <td>
<span
className="order-id"
onClick={()=>setSelectedOrder(order)}
>
#ORD-{order._id.slice(-5).toUpperCase()}
</span>
</td>

                <td>
                  {order.user?.name || "User"}
                </td>

                <td>
                  ₹{order.totalPrice.toFixed(2)}
                </td>

                <td>
                  {order.isPaid ? (
                    <span className="badge paid">Paid</span>
                  ) : (
                    <span className="badge unpaid">Unpaid</span>
                  )}
                </td>

                <td>
                  <span className={`badge status-${order.status}`}>
                    {order.status}
                  </span>
                </td>

                <td className="order-actions">

                  {order.isPaid &&
                    (order.status === "paid" ||
                      order.status === "processing") && (

                      <button
                        className="action-btn ship"
                        onClick={() => openShipModal(order._id)}
                      >
                        Ship
                      </button>

                    )}

                  {order.status === "shipped" && (

                    <button
                      className="action-btn deliver"
                      onClick={() => handleDeliver(order._id)}
                    >
                      Deliver
                    </button>

                  )}

                  {order.status !== "delivered" &&
                    order.status !== "cancelled" && (

                      <button
                        className="action-btn cancel"
                        onClick={() =>
                          updateStatus(order._id, "cancelled")
                        }
                      >
                        Cancel
                      </button>

                    )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Ship Modal */}

      {showShipModal && (

        <div className="ship-modal">

          <div className="ship-modal-card">

            <h3>Ship Order</h3>

            <input
              placeholder="Courier"
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
            />

            <input
              placeholder="Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />

            <input
              placeholder="Tracking URL (optional)"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
            />

            <div className="modal-actions">

              <button onClick={handleShip}>
                Confirm
              </button>

              <button
                onClick={() => setShowShipModal(false)}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

      {selectedOrder && (

<div className="order-drawer">

<div className="drawer-content">

<div className="drawer-header">

<h3>Order Details</h3>
<p className="drawer-order-id">
#ORD-{selectedOrder._id.slice(-5).toUpperCase()}
</p>

<button
className="drawer-close"
onClick={()=>setSelectedOrder(null)}
>
✕
</button>

</div>


<div className="drawer-section">

<h4>Customer</h4>

<p>{selectedOrder.user?.name}</p>
<p>{selectedOrder.user?.email}</p>

</div>


<div className="drawer-section">

<h4>Items</h4>

{selectedOrder?.orderItems?.length > 0 ? (

selectedOrder.orderItems.map((item,index)=>{

const qty = item.qty || 1
const price = item.price || 0
const total = qty * price

return(

<div key={index} className="drawer-item">

<div className="drawer-item-left">

<span className="item-name">
{item.name}
</span>

</div>

<div className="drawer-item-right">

<span className="item-qty">
x{qty}
</span>

<span className="item-price">
₹{price}
</span>

<span className="item-total">
₹{total}
</span>

</div>

</div>

)

})

) : (

<p className="no-items">No items found</p>

)}

</div>


{/* ORDER SUMMARY */}

<div className="drawer-section total-section">

<h4>Order Summary</h4>

<div className="summary-row">
<span>Total Items</span>
<span>{selectedOrder.orderItems?.length}</span>
</div>

<div className="summary-row">
<span>Total Price</span>
<span>
₹{Number(selectedOrder.totalAmount || selectedOrder.totalPrice).toFixed(2)}
</span>
</div>

<div className="summary-row">
<span>Payment</span>
<span>{selectedOrder.isPaid ? "Paid" : "Unpaid"}</span>
</div>

</div>


{/* ORDER PROGRESS */}

<div className="drawer-section">

<h4>Order Progress</h4>

<div className="order-timeline">

<div className="timeline-step active">
Order Placed
</div>

<div className={`timeline-step ${selectedOrder.isPaid ? "active" : ""}`}>
Payment Confirmed
</div>

<div className={`timeline-step ${selectedOrder.status === "processing" ? "active" : ""}`}>
Processing
</div>

<div className={`timeline-step ${selectedOrder.status === "shipped" ? "active" : ""}`}>
Shipped
</div>

<div className={`timeline-step ${selectedOrder.status === "delivered" ? "active" : ""}`}>
Delivered
</div>

</div>

</div>


{/* ADMIN ACTIONS */}

<div className="drawer-section">

<h4>Admin Actions</h4>

<div className="order-actions">

<button
className="action-btn processing"
disabled={selectedOrder.status === "processing"}
onClick={() => updateStatus(selectedOrder._id, "processing")}
>
Mark Processing
</button>

<button
className="action-btn shipped"
disabled={selectedOrder.status === "shipped"}
onClick={() => updateStatus(selectedOrder._id, "shipped")}
>
Mark Shipped
</button>

<button
className="action-btn delivered"
disabled={selectedOrder.status === "delivered"}
onClick={() => updateStatus(selectedOrder._id, "delivered")}
>
Mark Delivered
</button>

</div>

</div>
</div>

</div>

)}

    </AdminLayout>

  );

};

export default OrderList;
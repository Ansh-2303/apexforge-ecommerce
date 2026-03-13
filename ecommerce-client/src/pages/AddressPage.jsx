import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/addresses.css";
import toast from "react-hot-toast";

const AddressPage = () => {

  const [addresses, setAddresses] = useState([]);

  const [formData, setFormData] = useState({
    label: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });

  const fetchAddresses = async () => {
    const { data } = await api.get("/addresses");
    setAddresses(data);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

 const handleAdd = async () => {
  try {
    await api.post("/addresses", formData);

    toast.success("Address added successfully");

    setFormData({
      label: "",
      fullName: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      isDefault: false,
    });

    fetchAddresses();

  } catch (error) {
    toast.error("Failed to add address");
  }
};

 const handleDelete = async (id) => {
  try {
    await api.delete(`/addresses/${id}`);

    toast.success("Address deleted");

    fetchAddresses();

  } catch (error) {
    toast.error("Delete failed");
  }
};
 const handleSetDefault = async (id) => {
  try {
    await api.put(`/addresses/default/${id}`);

    toast.success("Default address updated");

    fetchAddresses();

  } catch (error) {
    toast.error("Failed to update default address");
  }
};

  return (
    <section className="addresses-page">

      <div className="addresses-container">

        <h2 className="addresses-title">My Addresses</h2>

        {/* Add Address Card */}

        <div className="address-form-card">

          <h3>Add New Address</h3>

          <div className="address-form">

            <input
              name="label"
              placeholder="Label (Home/Office)"
              value={formData.label}
              onChange={handleChange}
            />

            <input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />

            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />

            <input
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
            />

            <input
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
            />

            <label className="default-checkbox">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />
              Set as Default
            </label>

            <button
              className="btn btn-primary add-address-btn"
              onClick={handleAdd}
            >
              Add Address
            </button>

          </div>
        </div>

        {/* Saved Addresses */}

        <h3 className="saved-title">Saved Addresses</h3>

        {addresses.map((addr) => (

          <div
            key={addr._id}
            className={`address-card ${addr.isDefault ? "default" : ""}`}
          >

            <div className="address-header">

              <strong>{addr.label}</strong>

              {addr.isDefault && (
                <span className="default-badge">
                  Default
                </span>
              )}

            </div>

            <p>{addr.fullName}</p>
            <p>{addr.address}</p>
            <p>{addr.city}, {addr.postalCode}</p>
            <p>{addr.country}</p>

            <div className="address-buttons">

              {!addr.isDefault && (
                <button
                  className="btn btn-outline"
                  onClick={() => handleSetDefault(addr._id)}
                >
                  Set Default
                </button>
              )}

              <button
                className="btn btn-outline"
                onClick={() => handleDelete(addr._id)}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default AddressPage;
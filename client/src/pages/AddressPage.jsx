import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { MapPin, Phone, User, Building2, Map, Globe, Plus, Trash2, Star, Loader2 } from "lucide-react";
import "../styles/addresses.css";

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    try {
      const { data } = await api.get("/addresses");
      setAddresses(data);
    } catch (error) {
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
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

  const handleAdd = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.address || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/addresses", formData);
      toast.success("Coordinates locked! Address added.");
      
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
      
      await fetchAddresses();
    } catch (error) {
      toast.error("Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      toast.success("Address purged from database");
      fetchAddresses();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.put(`/addresses/default/${id}`);
      toast.success("Primary drop zone updated");
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to update default address");
    }
  };

  if (isLoading) {
    return (
      <div className="address-loading">
        <Loader2 className="spinner-icon spin" size={40} />
        <p>Accessing Secure Vault...</p>
      </div>
    );
  }

  return (
    <section className="addresses-page">
      <div className="addresses-container">
        
        {/* LEFT COLUMN: Saved Addresses */}
        <div className="address-list-section">
          
          {/* FIXED HEADER ALIGNMENT */}
          <div className="section-header">
            <h2 className="addresses-title">Command Center:<br/><span>Locations</span></h2>
            <p className="addresses-subtitle">Manage your secure drop zones for gear delivery.</p>
          </div>

          <div className="addresses-grid">
            {addresses.length === 0 ? (
              <div className="empty-state">
                <MapPin size={48} className="empty-icon" />
                <h3>No Drop Zones Found</h3>
                <p>Add a new shipping location using the uplink panel.</p>
              </div>
            ) : (
              addresses.map((addr) => (
                <div key={addr._id} className={`address-card ${addr.isDefault ? "default-active" : ""}`}>
                  
                  <div className="address-header">
                    <div className="label-group">
                      <Building2 size={16} className="label-icon" />
                      <strong>{addr.label || "Location"}</strong>
                    </div>
                    {addr.isDefault && (
                      <span className="default-badge"><Star size={12} fill="currentColor"/> Primary</span>
                    )}
                  </div>

                  <div className="address-body">
                    <p className="addr-name">{addr.fullName}</p>
                    <p className="addr-text">{addr.address}</p>
                    <p className="addr-text">{addr.city}, {addr.postalCode}</p>
                    <p className="addr-text">{addr.country}</p>
                    <p className="addr-phone"><Phone size={12} /> {addr.phone}</p>
                  </div>

                  <div className="address-actions">
                    {!addr.isDefault && (
                      <button className="btn-action set-default" onClick={() => handleSetDefault(addr._id)}>
                        <Star size={14} /> Make Primary
                      </button>
                    )}
                    <button className="btn-action delete" onClick={() => handleDelete(addr._id)}>
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Add Address Form */}
        <div className="address-form-section">
          <div className="address-form-card">
            <h3><Plus size={20} className="text-neon" /> Establish New Zone</h3>
            
            <form onSubmit={handleAdd} className="address-form">
              
              <div className="input-row">
                <div className="input-group">
                  <User size={18} className="input-icon" />
                  <input type="text" name="fullName" placeholder="Full Name *" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <Phone size={18} className="input-icon" />
                  <input type="tel" name="phone" placeholder="Phone *" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>

              <div className="input-group">
                <Building2 size={18} className="input-icon" />
                <input type="text" name="label" placeholder="Location Label (e.g. Home, Studio)" value={formData.label} onChange={handleChange} />
              </div>

              <div className="input-group">
                <MapPin size={18} className="input-icon" />
                <input type="text" name="address" placeholder="Street Address *" value={formData.address} onChange={handleChange} required />
              </div>

              <div className="input-row">
                <div className="input-group">
                  <Map size={18} className="input-icon" />
                  <input type="text" name="city" placeholder="City *" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <MapPin size={18} className="input-icon" />
                  <input type="text" name="postalCode" placeholder="Postal Code *" value={formData.postalCode} onChange={handleChange} required />
                </div>
              </div>

              <div className="input-group">
                <Globe size={18} className="input-icon" />
                <input type="text" name="country" placeholder="Country *" value={formData.country} onChange={handleChange} required />
              </div>

              <label className="custom-checkbox">
                <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleChange} />
                <span className="checkmark"></span>
                Set as Primary Drop Zone
              </label>

              <button type="submit" className="btn-submit-address" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 size={18} className="spin" /> : <Plus size={18} />}
                {isSubmitting ? "Locking Coordinates..." : "Save Address"}
              </button>

            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AddressPage;
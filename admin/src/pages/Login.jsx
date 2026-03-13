import { useState } from "react";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminName", data.name);  // 👈 ADD THIS
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
   <div className="login-container">
  <div className="login-card">
        <h2>Admin Panel</h2>
        <p className="subtitle">Login to manage your store</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={submitHandler}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
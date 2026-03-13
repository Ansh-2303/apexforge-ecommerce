import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn } from "lucide-react";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome back to ApexForge.");
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || "Authentication failed. Check your credentials.";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="login-page">
      {/* Subtle Ambient Glow */}
      <div className="glow-orb top-left"></div>
      <div className="glow-orb bottom-right"></div>

      <div className="login-container">
        
        {/* LEFT SIDE: Brand Hero */}
        <div className="login-hero">
          <h1 className="brand-label">APEXFORGE</h1>
          <h2>
            Enter the Forge.<br />
            <span className="text-neon">Dominate the Game.</span>
          </h2>
          <p>
            Equip yourself with elite gaming peripherals designed for precision, speed, and immersive performance. Log in to track orders and unlock exclusive gear.
          </p>
        </div>

        {/* RIGHT SIDE: Login Portal */}
        <div className="login-card">
          <div className="login-header">
            <h3>Login</h3>
            <p className="login-subtitle">Enter your credentials to access your dashboard</p>
          </div>

          {error && (
            <div className="login-error">
              <span className="error-icon">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="login-form">
            
            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
            </div>

            <button type="submit" className="btn-submit">
              <LogIn size={18} />
              Login
            </button>

          </form>

          <div className="login-footer">
            New to the Forge?{" "}
            <Link to="/register" className="register-link">Create Account</Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
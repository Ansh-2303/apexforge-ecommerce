import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../styles/auth.css";

const Login = () => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {

    e.preventDefault();

    try{

      await login(email,password);

      toast.success("Welcome back!");

      navigate("/");

    }
    catch(err){

      const message =
        err.response?.data?.message || "Login failed";

      setError(message);

      toast.error(message);
    }
  };

  return (

    <div className="login-page">

      <div className="login-container">

        {/* LEFT SIDE */}

        <div className="login-hero">

       <h1>MyStore</h1>

<h2>
  Premium shopping
  <br />
  experience
</h2>

<p>
  Discover curated products designed for modern lifestyles.
  Secure payments. Fast delivery. Trusted quality.
</p>
        </div>


        {/* RIGHT SIDE */}

        <div className="login-card">

          <h3>Welcome Back</h3>

          <p className="login-subtitle">
            Login to continue shopping
          </p>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="login-form">

            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e)=>{
                setEmail(e.target.value);
                setError("");
              }}
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e)=>{
                setPassword(e.target.value);
                setError("");
              }}
            />

            <button type="submit">
              Login
            </button>

          </form>

          <div className="login-footer">
            Don’t have an account?{" "}
            <Link to="/register">Register</Link>
          </div>

        </div>

      </div>

    </div>

  );
};

export default Login;
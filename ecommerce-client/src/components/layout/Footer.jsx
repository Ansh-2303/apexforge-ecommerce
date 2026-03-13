import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="container footer-grid">

        {/* BRAND */}

        <div className="footer-brand">

          <h3 className="footer-logo">ApexForge</h3>

          <p className="footer-tagline">
            Precision gaming gear built for speed, control and performance.
          </p>

        </div>


        {/* SHOP */}

        <div className="footer-col">

          <h4>Shop</h4>

          <Link to="/products">All Products</Link>
          <Link to="/products">Featured Gear</Link>
          <Link to="/products">New Arrivals</Link>

        </div>


        {/* ACCOUNT */}

        <div className="footer-col">

          <h4>Account</h4>

          <Link to="/login">Login</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/my-orders">Orders</Link>

        </div>


        {/* SUPPORT */}

        <div className="footer-col">

          <h4>Support</h4>

          <a href="#">Contact Us</a>
          <a href="#">Shipping Policy</a>
          <a href="#">Returns</a>

        </div>

      </div>


      {/* BOTTOM */}

      <div className="footer-bottom">

        <div className="container footer-bottom-inner">

          <span>
            © {new Date().getFullYear()} ApexForge. All rights reserved.
          </span>

          <span className="footer-built">
            Built for gamers
          </span>

        </div>

      </div>

    </footer>
  );
};

export default Footer;
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useWishlist } from "../../context/WishlistContext"
import { ShoppingCart, Heart, User, Package, MapPin, LogOut, ChevronDown } from "lucide-react"
import "./Navbar.css"
import SearchSuggestions from "../search/SearchSuggestions"
import { useState, useEffect, useRef } from "react"

const Navbar = () => {
  const { cartItems } = useCart()
  const { user, logout } = useAuth()
  const { wishlist } = useWishlist()
  const location = useLocation()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const isActive = (path) => location.pathname === path

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        
        {/* LOGO */}
        <Link to="/" className="logo">
          ApexForge
        </Link>

        {/* SEARCH */}
        <div className="nav-search">
          <SearchSuggestions />
        </div>

        {/* LINKS */}
        <div className="nav-links">
          
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            Home
          </Link>
          <Link to="/products" className={`nav-link ${isActive("/products") ? "active" : ""}`}>
            Products
          </Link>

          {/* WISHLIST */}
          <Link to="/wishlist" className="nav-icon">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="nav-badge">{wishlist.length}</span>
            )}
          </Link>

          {/* CART */}
          <Link to="/cart" className="nav-icon">
            <ShoppingCart size={20} />
            {totalQty > 0 && (
              <span className="nav-badge">{totalQty}</span>
            )}
          </Link>

          {/* USER MENU */}
          {user ? (
            <div className="nav-user-menu" ref={menuRef}>
              <button
                className={`nav-user-btn ${menuOpen ? 'active' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <User size={16} />
                <span>{user.name}</span>
                <ChevronDown size={14} className={`dropdown-arrow ${menuOpen ? 'open' : ''}`} />
              </button>

              {menuOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-label">Account</div>
                  
                  <Link to="/orders" onClick={() => setMenuOpen(false)}>
                    <Package size={16} />
                    My Orders
                  </Link>
                  
                  <Link to="/addresses" onClick={() => setMenuOpen(false)}>
                    <MapPin size={16} />
                    Addresses
                  </Link>

                  <div className="dropdown-divider"></div>

                  <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-login">
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar
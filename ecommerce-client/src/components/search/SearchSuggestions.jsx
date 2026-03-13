import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./SearchSuggestions.css";

const SearchSuggestions = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      try {
        setIsSearching(true);
        const { data } = await api.get(`/products?keyword=${query}&limit=5`);
        setResults(data.products || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const delay = setTimeout(fetchResults, 300);
    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (slug) => {
    navigate(`/product/${slug}`);
    setQuery(""); 
    setResults([]); 
  };

  // --- THE BULLETPROOF PRICE FORMATTER ---
  const formatPrice = (product) => {
    if (!product) return "0.00";
    
    let price = 0;
    
    // Check inside the variants array first
    if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
      if (product.variants[0] && product.variants[0].price !== undefined) {
          price = product.variants[0].price;
      }
    } 
    // Fallback if price is stored directly on the product
    else if (product.price !== undefined) {
      price = product.price; 
    }
    
    const numPrice = Number(price);
    return isNaN(numPrice) || numPrice === 0 ? "0.00" : numPrice.toFixed(2);
  };

  // --- THE BULLETPROOF IMAGE FORMATTER ---
  const getProductImage = (product) => {
    if (!product) return "https://via.placeholder.com/40x40/0f172a/22c55e?text=GEAR";

    let imgPath = null;
    
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      imgPath = product.images[0].url || product.images[0];
    } else if (product.image) {
      imgPath = product.image;
    }

    if (!imgPath) return "https://via.placeholder.com/40x40/0f172a/22c55e?text=GEAR";

    if (typeof imgPath === 'string' && imgPath.startsWith('/uploads')) {
      const backendURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      return `${backendURL.replace('/api', '')}${imgPath}`;
    }

    return imgPath;
  };

  return (
    <div className="search-box" ref={searchRef}>
      
      <div className="input-wrapper">
        <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        
        <input
          type="text"
          placeholder="Search gaming gear..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
        {isSearching && <div className="search-mini-spinner"></div>}
      </div>

      {results.length > 0 && (
        <div className="search-dropdown">
          {results.map((product) => (
            <div
              key={product._id}
              className="search-item"
              onClick={() => handleSelect(product.slug || product._id)}
            >
              <img 
                src={getProductImage(product)} 
                alt={product.name} 
                className="search-item-image"
              />
              <div className="search-item-info">
                <span className="search-item-name">{product.name}</span>
                {/* THE FIX IS HERE: Passing 'product', not 'product.price' */}
                <span className="search-item-price">
                  ₹{formatPrice(product)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default SearchSuggestions;
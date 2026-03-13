import "./Hero.css";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

const Hero = () => {
  // Renamed to visualRef to be clear we are only tracking the right side
  const visualRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMouseMove = (e) => {
    const visual = visualRef.current;
    if (!visual) return;

    const { left, top, width, height } = visual.getBoundingClientRect();
    
    // Calculate distance from center of the visual area ONLY
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);

    visual.style.setProperty("--mouse-x", x);
    visual.style.setProperty("--mouse-y", y);
  };

  const handleMouseLeave = () => {
    const visual = visualRef.current;
    if (!visual) return;

    visual.style.setProperty("--mouse-x", 0);
    visual.style.setProperty("--mouse-y", 0);
  };

  return (
    <section className={`hero ${isLoaded ? 'is-loaded' : ''}`}>
      <div className="container hero-inner">
        
        {/* TEXT SIDE (Mouse movement here will no longer trigger parallax) */}
        <div className="hero-text">
          <div className="reveal-wrap">
            <span className="hero-tag">Elite Gaming Equipment</span>
          </div>

          <div className="reveal-wrap delay-1">
            <h1>
              Forge Your <span className="accent">Ultimate</span>
              <br />
              Gaming Setup
            </h1>
          </div>

          <div className="reveal-wrap delay-2">
            <p>
              Precision engineered gaming gear built for competitive speed,
              accuracy and immersive performance.
            </p>
          </div>

          <div className="reveal-wrap delay-3">
            <div className="hero-actions">
              <Link to="/products" className="hero-btn primary">
                Shop Gear
              </Link>
              <Link to="/products" className="hero-btn ghost">
                Explore Collection
              </Link>
            </div>
          </div>
        </div>

        {/* VISUAL SIDE (Events moved here!) */}
        <div 
          className="hero-visual"
          ref={visualRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Top-Down Spotlight Effect */}
          <div className="top-spotlight"></div>
          
          {/* Intense Ambient Stage Light */}
          <div className="stage-light"></div>

          {/* HEADSET */}
          <div className="gear-wrapper headset-wrapper">
            <img src="/headset.png" alt="RGB Headset" className="gear headset" />
            <div className="gear-shadow headset-shadow"></div>
          </div>

          {/* KEYBOARD */}
          <div className="gear-wrapper keyboard-wrapper">
            <img src="/keyboard.png" alt="RGB Keyboard" className="gear keyboard" />
            <div className="gear-shadow keyboard-shadow"></div>
          </div>

          {/* MOUSE */}
          <div className="gear-wrapper mouse-wrapper">
            <img src="/mouse.png" alt="RGB Mouse" className="gear mouse" />
            <div className="gear-shadow mouse-shadow"></div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
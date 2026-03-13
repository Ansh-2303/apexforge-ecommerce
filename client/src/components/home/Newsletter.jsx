import "./Newsletter.css";

const Newsletter = () => {
  return (
    <section className="newsletter-section">

      <div className="container">

        <div className="newsletter-box">

          <h2>Join the ApexForge Community</h2>

          <p className="newsletter-subtitle">
            Get early access to new gaming gear, exclusive deals and updates.
          </p>

          <div className="newsletter-form">

            <input
              type="email"
              placeholder="Enter your email address"
            />

            <button className="btn btn-accent">
              Subscribe
            </button>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Newsletter;
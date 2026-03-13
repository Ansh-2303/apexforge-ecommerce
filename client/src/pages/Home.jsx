import Hero from "../components/home/Hero";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Categories from "../components/home/Categories";
import WhyUs from "../components/home/WhyUs";
import TopRated from "../components/home/TopRated";
import Newsletter from "../components/home/Newsletter";

const Home = () => {
  return (
    <main className="home-page">

      {/* HERO */}
      <Hero />

      {/* FEATURED PRODUCTS */}
      <section className="section section-featured">
        <div className="container">
          <FeaturedProducts />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section section-alt section-categories">
        <div className="container">
          <Categories />
        </div>
      </section>

      {/* WHY US */}
      <section className="section section-why">
        <div className="container">
          <WhyUs />
        </div>
      </section>

      {/* TOP RATED */}
      <section className="section section-alt section-top">
        <div className="container">
          <TopRated />
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section section-newsletter">
        <div className="container">
          <Newsletter />
        </div>
      </section>

    </main>
  );
};

export default Home;
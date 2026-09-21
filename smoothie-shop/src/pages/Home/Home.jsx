import { useEffect, useState } from "react";
/* import { useEffect } from "react";
import axios from "axios"; */
import { Link } from "react-router-dom";
import productData from "../../data/product";
import "./Home.css";

import berryImage from "../../assets/berry.jpg";
import mangoImage from "../../assets/mango.png";
import strawberryImage from "../../assets/strawberry.jpg";
import tropicalImage from "../../assets/tropical.png";

const heroSlides = [
  { image: berryImage, label: "Berry bliss" },
  { image: mangoImage, label: "Mango glow" },
  { image: strawberryImage, label: "Strawberry freshness" },
  { image: tropicalImage, label: "Tropical energy" },
];

const Home = () => {
  const [product, setProduct] = useState(productData());
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const slideTimer = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(slideTimer);
  }, []);

  const showSlide = (slideIndex) => {
    setActiveSlide((slideIndex + heroSlides.length) % heroSlides.length);
  };

  /*  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); */

  /*   useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          "https://dummyjson.com/products?limit=4",
        );
        setProduct(response.data.products);
        setLoading(false);
      } catch {
        setError("error");
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  } else if (error !== "") {
    return <p className="error-text">{error}</p>;
  } */

  return (
    <div>
      {" "}
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroSlides[activeSlide].image})` }}
      >
        <div className="hero-content">
          <p className="hero-eyebrow">{heroSlides[activeSlide].label}</p>
          <h1>Fresh Smoothies, Made Simple</h1>
          <p>Real fruit. Real flavor. Delivered fast.</p>
          <a className="hero-button" href="#products">
            Shop smoothies
          </a>
        </div>
        <div className="hero-controls" aria-label="Hero slideshow controls">
          <button
            type="button"
            className="hero-arrow"
            aria-label="Previous slide"
            onClick={() => showSlide(activeSlide - 1)}
          >
            &lt;
          </button>
          <div className="hero-dots">
            {heroSlides.map((slide, slideIndex) => (
              <button
                key={slide.label}
                type="button"
                className={`hero-dot${activeSlide === slideIndex ? " active" : ""}`}
                aria-label={`Show ${slide.label} slide`}
                aria-current={activeSlide === slideIndex ? "true" : undefined}
                onClick={() => showSlide(slideIndex)}
              />
            ))}
          </div>
          <button
            type="button"
            className="hero-arrow"
            aria-label="Next slide"
            onClick={() => showSlide(activeSlide + 1)}
          >
            &gt;
          </button>
        </div>
      </section>
      <div className="home-container" id="products">
        {product.map((item) => (
          <div key={item.id} className="product-card">
            <Link
              className="product-title-link"
              to={`/productDetail/${item.id}`}
            >
              <h2>{item.title}</h2>
              <img
                className="product-image"
                src={item.thumbnail}
                alt={item.title}
              />
            </Link>

            <p className="product-price"> ${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

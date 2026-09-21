import { useParams } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { /* useEffect, */ useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import productData from "../../data/product";
import LoginModal from "../../components/Login_Modal/LoginModal";
import { useNavigate } from "react-router-dom";
/* import axios from "axios";
 */ import "./productDetail.css";
const ProductDetails = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const productList = productData();
  const navigate = useNavigate();
  const product = productList.find((item) => item.id === id);
  if (product === undefined) {
    return <p className="product-status">Product not found</p>;
  }

  const currentIndex = productList.findIndex((item) => item.id === id);
  const nextindex = (currentIndex + 1) % productList.length;
  const previndex =
    (currentIndex - 1 + productList.length) % productList.length;
  const nextProduct = productList[nextindex];
  const previousProduct = productList[previndex];

  /* const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); */
  /*   const { id } = useParams();
   */
  /*   useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://dummyjson.com/products/${id}`,
        );
        setProduct(response.data);
        setLoading(false);
      } catch {
        setError("failed to fetch the error");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  if (loading) {
    return <p className="product-status">loading...</p>;
  }
  if (error !== "") {
    return <p className="product-status">{error}</p>;
  } */
  return (
    <div className="product-details-container">
      <div className="product-details-media">
        <img src={product.thumbnail} alt={product.title} />
      </div>
      <div className="product-details-info">
        <div className="product-details-heading">
          <p className="product-details-eyebrow">Fresh from the blender</p>
          <h1>{product.title}</h1>
          <p className="product-details-short-description">
            {product.shortDescription}
          </p>
        </div>
        <p className="product-details-price">${product.price}</p>
        <p className="product-details-description">{product.description}</p>
        <button
          className="product-details-buy"
          onClick={() => {
            isLoggedIn ? addToCart(product) : setShowModal(true);
          }}
        >
          Buy smoothie
        </button>
        <div className="navigation-buttons">
          <button
            onClick={() => {
              navigate(`/productDetail/${previousProduct.id}`);
            }}
          >
            Previous
          </button>
          <button
            onClick={() => {
              navigate(`/productDetail/${nextProduct.id}`);
            }}
          >
            Next
          </button>
        </div>
      </div>
      {showModal ? (
        <LoginModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            addToCart(product);
            setShowModal(false);
          }}
        />
      ) : null}{" "}
    </div>
  );
};
export default ProductDetails;

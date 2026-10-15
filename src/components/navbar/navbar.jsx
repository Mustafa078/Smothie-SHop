import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext.jsx";
import "./navbar.css";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const totalProduct = cart.reduce(
    (total, item) => (total = total + item.quantity),
    0,
  );
  return (
    <div className="navbar-container">
      <nav className="navbar">
        <Link className="nav-link" to={"/"}>
          Home
        </Link>
        <Link className="nav-link" to={"/about"}>
          About
        </Link>
        <Link className="nav-link" to={"/cart"}>
          Cart <span className="cart-badge">{totalProduct}</span>
        </Link>
        <Link className="nav-link" to={"/checkout"}>
          Checkout
        </Link>
        <Link className="nav-link nav-link--admin" to={"/admin"}>
          Admin
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;

import { CartContext } from "../../context/CartContext";
import { useContext } from "react";
import "./cart.css";
const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);

  return (
    <main className="cart-page">
      {cart.length === 0 ? (
        <section className="cart-empty">
          <p className="cart-empty__eyebrow">Your blender is waiting</p>
          <h1 className="cart-empty__title">Your cart is empty</h1>
          <p className="cart-empty__message">
            Pick a fresh smoothie and we&apos;ll have your order ready to go.
          </p>
          <a className="cart-empty__link" href="/#products">
            Explore smoothies
          </a>
        </section>
      ) : (
        cart.map((item) => (
          <article className="cart-item" key={item.id}>
            <img
              className="cart-item__image"
              src={item.thumbnail}
              alt={item.title}
            />
            <div className="cart-item__content">
              <h2 className="cart-item__title">{item.title}</h2>
              <p className="cart-item__description">{item.description}</p>
              <span className="cart-item__quantity">
                Quantity: {item.quantity}
              </span>
              <span className="cart-item__price">
                ${item.price * item.quantity}
              </span>
            </div>
            <div className="cart-item__actions">
              <button
                className="cart-item__quantity-button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>

              {item.quantity > 1 && (
                <button
                  className="cart-item__quantity-button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
              )}
              <button
                className="cart-item__remove"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
            <span className="cart-total">
              Total $
              {cart.reduce(
                (total, current) =>
                  (total = total + current.price * current.quantity),
                0,
              )}
            </span>
          </article>
        ))
      )}
    </main>
  );
};
export default Cart;

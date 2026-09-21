import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "./checkout.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  address: z.string().min(1, "Enter full address"),
  city: z.string().min(1, "Enter your city"),
  zip: z.string().min(1, "Enter your zip code"),
  card: z
    .string()
    .regex(
      /^\d{4}-\d{4}-\d{4}-\d{4}$/,
      "Card number must be in the format xxxx-xxxx-xxxx-xxxx",
    ),
});

const Checkout = () => {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    setCart([]);
    navigate("/");
  };

  if (cart.length === 0) {
    return (
      <div className="checkout checkout--empty">
        <h1 className="checkout__title">Your Cart Is Empty</h1>

        <p className="checkout__empty-message">
          Add some products to your cart before checking out.
        </p>

        <button className="checkout__back-button" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h1 className="checkout__title">Checkout</h1>

      <div className="checkout__content">
        <section className="checkout__summary">
          <h2 className="checkout__section-title">Order Summary</h2>

          <div className="checkout__items">
            {cart.map((item) => (
              <div className="checkout-item" key={item.id}>
                <h3 className="checkout-item__title">{item.title}</h3>

                <p className="checkout-item__detail">Price: ${item.price}</p>

                <p className="checkout-item__detail">
                  Quantity: {item.quantity}
                </p>

                <span className="checkout-item__total">
                  Total: ${item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="checkout__subtotal">
            <span>Sub-Total</span>

            <span>
              $
              {cart.reduce(
                (total, current) => total + current.price * current.quantity,
                0,
              )}
            </span>
          </div>
        </section>

        <section className="checkout__form-section">
          <h2 className="checkout__section-title">Billing Information</h2>

          <form className="checkout-form" onSubmit={handleSubmit(onSubmit)}>
            <label className="checkout-form__field" htmlFor="name">
              <span className="checkout-form__label">Name</span>

              <input
                className="checkout-form__input"
                type="text"
                id="name"
                {...register("name")}
              />

              {formState.errors.name ? (
                <span className="checkout-form__error">
                  {formState.errors.name.message}
                </span>
              ) : null}
            </label>

            <label className="checkout-form__field" htmlFor="email">
              <span className="checkout-form__label">Email</span>

              <input
                className="checkout-form__input"
                type="email"
                id="email"
                {...register("email")}
              />

              {formState.errors.email ? (
                <span className="checkout-form__error">
                  {formState.errors.email.message}
                </span>
              ) : null}
            </label>

            <label className="checkout-form__field" htmlFor="address">
              <span className="checkout-form__label">Address</span>

              <input
                className="checkout-form__input"
                type="text"
                id="address"
                {...register("address")}
              />

              {formState.errors.address ? (
                <span className="checkout-form__error">
                  {formState.errors.address.message}
                </span>
              ) : null}
            </label>

            <label className="checkout-form__field" htmlFor="city">
              <span className="checkout-form__label">City</span>

              <input
                className="checkout-form__input"
                type="text"
                id="city"
                {...register("city")}
              />

              {formState.errors.city ? (
                <span className="checkout-form__error">
                  {formState.errors.city.message}
                </span>
              ) : null}
            </label>

            <label className="checkout-form__field" htmlFor="zip">
              <span className="checkout-form__label">Zip Code</span>

              <input
                className="checkout-form__input"
                type="text"
                id="zip"
                {...register("zip")}
              />

              {formState.errors.zip ? (
                <span className="checkout-form__error">
                  {formState.errors.zip.message}
                </span>
              ) : null}
            </label>

            <label className="checkout-form__field" htmlFor="card">
              <span className="checkout-form__label">Card Number</span>

              <input
                className="checkout-form__input"
                type="text"
                id="card"
                placeholder="xxxx-xxxx-xxxx-xxxx"
                {...register("card")}
              />

              {formState.errors.card ? (
                <span className="checkout-form__error">
                  {formState.errors.card.message}
                </span>
              ) : null}
            </label>

            <button className="checkout-form__submit" type="submit">
              Submit Order
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Checkout;

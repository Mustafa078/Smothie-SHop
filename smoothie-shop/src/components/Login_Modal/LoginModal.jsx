import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import "./LoginModal.css";
const LoginModal = ({ onClose, onSuccess }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [loginError, setLoginError] = useState("");

  return (
    <div
      className="login-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div className="login-modal__panel">
        <button
          className="login-modal__close"
          type="button"
          aria-label="Close login dialog"
          onClick={onClose}
        >
          x
        </button>
        <h2 id="login-modal-title">Welcome back</h2>
        <form className="login-form">
          <label htmlFor="UserName">
            Username:
            <input
              className="login-form__input"
              type="text"
              required
              id="UserName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </label>
          <label htmlFor="password">
            Password:
            <input
              className="login-form__input"
              type="password"
              required
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button
            className="login-form__submit"
            type="button"
            onClick={() => {
              const success = login(userName, password);
              if (success) {
                onSuccess();
                onClose();
              } else {
                setLoginError("Invalid Username & Password");
              }
            }}
          >
            Login
          </button>
          {loginError !== "" ? (
            <p className="login-form__error">{loginError}</p>
          ) : null}
        </form>
      </div>
    </div>
  );
};
export default LoginModal;

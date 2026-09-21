import { createContext, useState } from "react";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  );
  const login = (username, password) => {
    let user = "admin";
    let pass = "admin";

    if (username === user && password === pass) {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
      return true;
    } else return false;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login }}>
      {children}
    </AuthContext.Provider>
  );
};

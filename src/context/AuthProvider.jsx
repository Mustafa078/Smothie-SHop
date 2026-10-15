import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  );

  const getAdminPassword = () => {
    return localStorage.getItem("smoothie_admin_password") || "admin";
  };

  const getAdminUsername = () => {
    return localStorage.getItem("smoothie_admin_username") || "admin";
  };

  const login = (username, password) => {
    const validUser = getAdminUsername();
    const validPass = getAdminPassword();

    if (username === validUser && password === validPass) {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  const changePassword = async (currentPassword, newPassword) => {
    const validPass = getAdminPassword();
    if (currentPassword !== validPass) {
      return { success: false, error: "Current password does not match." };
    }
    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, error: "New password must be at least 4 characters long." };
    }

    const trimmedNewPass = newPassword.trim();
    localStorage.setItem("smoothie_admin_password", trimmedNewPass);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: currentPassword, newPassword: trimmedNewPass }),
      });
      if (!res.ok) {
        const data = await res.json();
        console.warn("Backend password sync note:", data.error);
      }
    } catch (err) {
      console.warn("Backend password sync note:", err.message);
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

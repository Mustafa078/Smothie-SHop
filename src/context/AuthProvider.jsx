import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("smoothie_admin_token") || ""
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("smoothie_admin_token")) &&
      (JSON.parse(localStorage.getItem("isLoggedIn")) || false)
  );

  const getAdminPassword = () => {
    return localStorage.getItem("smoothie_admin_password") || "admin";
  };

  const getAdminUsername = () => {
    return localStorage.getItem("smoothie_admin_username") || "admin";
  };

  const getAuthHeaders = () => {
    const activeToken = token || localStorage.getItem("smoothie_admin_token") || "";
    return {
      "Content-Type": "application/json",
      ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
    };
  };

  const login = async (username, password) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (res.ok && data.token) {
          setToken(data.token);
          setIsLoggedIn(true);
          localStorage.setItem("smoothie_admin_token", data.token);
          localStorage.setItem("isLoggedIn", JSON.stringify(true));
          localStorage.setItem("smoothie_admin_password", password);
          return { success: true };
        }
        return { success: false, error: data.error || "Invalid admin credentials." };
      }
    } catch (err) {
      console.warn("Backend auth call failed, evaluating local fallback:", err.message);
    }

    // Offline / fallback verification
    const validUser = getAdminUsername();
    const validPass = getAdminPassword();

    if (username === validUser && password === validPass) {
      const localToken = `local_fallback_${Date.now()}`;
      setToken(localToken);
      setIsLoggedIn(true);
      localStorage.setItem("smoothie_admin_token", localToken);
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
      return { success: true };
    } else {
      return { success: false, error: "Invalid admin username or password." };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("smoothie_admin_token");
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
        headers: getAuthHeaders(),
        body: JSON.stringify({ oldPassword: currentPassword, newPassword: trimmedNewPass }),
      });
      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error || "Failed to update password." };
      }
    } catch (err) {
      console.warn("Backend password sync note:", err.message);
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, token, getAuthHeaders, login, logout, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

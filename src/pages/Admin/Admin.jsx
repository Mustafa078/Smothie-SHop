import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider.jsx";
import {
  presetImages,
  resolveThumbnail,
  saveStoredProducts,
  getStoredProducts,
  defaultProductsList,
} from "../../data/product.jsx";
import "./admin.css";

const Admin = () => {
  const { isLoggedIn, login, logout, changePassword, getAuthHeaders } = useContext(AuthContext);

  // Login form state
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Owner Password Change Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Admin Dashboard State
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products"); // 'products' | 'orders'
  const [searchQuery, setSearchQuery] = useState("");
  const [mongoStatus, setMongoStatus] = useState({ connected: false, checked: false });
  const [notification, setNotification] = useState("");
  const [showOwnerDocs, setShowOwnerDocs] = useState(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Form states for Add / Edit
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    shortDescription: "",
    description: "",
    imageSourceType: "preset", // 'preset' | 'device' | 'url'
    thumbnail: "berry",
    customImage: "",
    deviceImage: "",
    deviceFileName: "",
    category: "Classic",
    inStock: true,
  });

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 3500);
  };

  // Fetch products from backend or local storage
  const fetchProducts = async () => {
    // Populate immediately from local storage so UI is never blank
    const local = getStoredProducts();
    if (local && local.length > 0) {
      setProducts(local);
    }

    try {
      const res = await fetch("/api/products");
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item) => ({
            ...item,
            thumbnail: resolveThumbnail(item.thumbnail),
            rawThumbnail: item.thumbnail,
          }));
          setProducts(mapped);
          saveStoredProducts(mapped);
        }
      }
    } catch (err) {
      console.warn("Backend API sync note (using store data):", err);
    }
  };

  // Fetch orders (Protected)
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", {
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        logout();
        return;
      }
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
          try {
            localStorage.setItem("smoothie_orders_cache", JSON.stringify(data));
          } catch {}
          return;
        }
      }
    } catch (err) {
      console.warn("Failed to fetch orders from backend:", err);
    }

    try {
      const cached = JSON.parse(localStorage.getItem("smoothie_orders_cache") || "[]");
      setOrders(cached);
    } catch {}
  };

  // Synchronize offline localStorage queue to MongoDB when connected (Protected)
  const syncOfflineData = async () => {
    try {
      // 1. Sync pending offline products
      const offlineProducts = JSON.parse(
        localStorage.getItem("smoothie_offline_products_queue") || "[]"
      );
      if (offlineProducts.length > 0) {
        const pRes = await fetch("/api/sync/products", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ products: offlineProducts }),
        });
        if (pRes.ok) {
          localStorage.removeItem("smoothie_offline_products_queue");
          showNotification(`🔄 Auto-synced ${offlineProducts.length} offline product(s) to MongoDB!`);
          fetchProducts();
        }
      }

      // 2. Sync pending offline orders
      const offlineOrders = JSON.parse(
        localStorage.getItem("smoothie_offline_orders_queue") || "[]"
      );
      if (offlineOrders.length > 0) {
        const oRes = await fetch("/api/sync/orders", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ orders: offlineOrders }),
        });
        if (oRes.ok) {
          localStorage.removeItem("smoothie_offline_orders_queue");
          showNotification(`🔄 Auto-synced ${offlineOrders.length} offline order(s) to MongoDB!`);
          fetchOrders();
        }
      }
    } catch (syncErr) {
      console.warn("Offline synchronization deferred:", syncErr);
    }
  };

  // Check health and MongoDB connection
  const checkHealth = async () => {
    try {
      const res = await fetch("/api/health");
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        const data = await res.json();
        const isConn = Boolean(data.mongoConnected);
        setMongoStatus({ connected: isConn, checked: true });
        if (isConn && isLoggedIn) {
          syncOfflineData();
        }
        return;
      }
    } catch {
      // safe fallback
    }
    setMongoStatus({ connected: false, checked: true });
  };

  useEffect(() => {
    fetchProducts();
    if (isLoggedIn) {
      fetchOrders();
    }
    checkHealth();
  }, [isLoggedIn]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const result = await login(usernameInput, passwordInput);
    if (result && result.success) {
      setLoginError("");
      fetchProducts();
      fetchOrders();
      checkHealth();
    } else {
      setLoginError(result?.error || "Invalid credentials. Try username: admin, password: admin (or your custom password)");
    }
  };

  // Handle owner changing password
  const handleOwnerChangePassword = async (e) => {
    e.preventDefault();
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }
    if (newPasswordInput.trim().length < 4) {
      setPasswordError("New password must be at least 4 characters long.");
      return;
    }

    const res = await changePassword(currentPasswordInput, newPasswordInput);
    if (res.success) {
      setIsPasswordModalOpen(false);
      setCurrentPasswordInput("");
      setNewPasswordInput("");
      setConfirmPasswordInput("");
      setPasswordError("");
      showNotification("🔒 Password changed successfully! Use your new password on next login.");
    } else {
      setPasswordError(res.error || "Failed to update password.");
    }
  };

  // Handle local device image file upload
  const handleDeviceFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, JPEG, WebP, SVG).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size exceeds 10MB. Please choose a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        imageSourceType: "device",
        deviceImage: event.target.result,
        deviceFileName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Compute final thumbnail payload based on selected source
  const getSelectedThumbnail = () => {
    if (formData.imageSourceType === "device") {
      if (!formData.deviceImage) {
        throw new Error("Please upload an image from your device.");
      }
      return formData.deviceImage;
    } else if (formData.imageSourceType === "url") {
      if (!formData.customImage || !formData.customImage.trim()) {
        throw new Error("Please provide a valid image web URL.");
      }
      return formData.customImage.trim();
    }
    return formData.thumbnail || "berry";
  };

  // Open Edit Modal
  const openEditModal = (prod) => {
    const raw = prod.rawThumbnail || prod.thumbnail;
    const isPreset = Object.keys(presetImages).includes(raw);
    const isDevice = typeof raw === "string" && raw.startsWith("data:image");
    const isUrl =
      !isPreset && !isDevice && typeof raw === "string" && (raw.startsWith("http") || raw.startsWith("/"));

    let source = "preset";
    if (isDevice) {
      source = "device";
    } else if (isUrl) {
      source = "url";
    }

    setFormData({
      title: prod.title || "",
      price: prod.price || "",
      shortDescription: prod.shortDescription || "",
      description: prod.description || "",
      imageSourceType: source,
      thumbnail: isPreset ? raw : "berry",
      customImage: isUrl ? raw : "",
      deviceImage: isDevice ? raw : "",
      deviceFileName: isDevice ? "Device Uploaded Image" : "",
      category: prod.category || "Classic",
      inStock: prod.inStock !== false,
    });
    setEditingProduct(prod);
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      title: "",
      price: "",
      shortDescription: "",
      description: "",
      imageSourceType: "preset",
      thumbnail: "berry",
      customImage: "",
      deviceImage: "",
      deviceFileName: "",
      category: "Classic",
      inStock: true,
    });
    setIsAddModalOpen(true);
  };

  // Save New Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert("Title and Price are required.");
      return;
    }

    let finalThumbnail;
    try {
      finalThumbnail = getSelectedThumbnail();
    } catch (err) {
      alert(err.message);
      return;
    }

    const payload = {
      title: formData.title.trim(),
      price: parseFloat(formData.price),
      shortDescription: formData.shortDescription?.trim() || "",
      description: formData.description?.trim() || "",
      thumbnail: finalThumbnail,
      category: formData.category || "Classic",
      inStock: Boolean(formData.inStock),
    };

    let backendSaved = false;
    let savedItem = null;

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        logout();
        alert("Session expired. Please log in again as admin.");
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        savedItem = await res.json();
        backendSaved = true;
      }
    } catch (apiErr) {
      console.warn("Backend API sync note (using local store):", apiErr.message);
    }

    // Always ensure product is committed to catalog
    const newProduct = {
      id: savedItem?.id || String(Date.now()),
      ...payload,
      thumbnail: resolveThumbnail(payload.thumbnail),
      rawThumbnail: payload.thumbnail,
    };

    const currentList = products && products.length > 0 ? products : getStoredProducts();
    const updated = [newProduct, ...currentList.filter((p) => p.id !== newProduct.id)];
    setProducts(updated);
    saveStoredProducts(updated);

    if (!backendSaved) {
      try {
        const queue = JSON.parse(localStorage.getItem("smoothie_offline_products_queue") || "[]");
        localStorage.setItem(
          "smoothie_offline_products_queue",
          JSON.stringify([...queue.filter((q) => q.id !== newProduct.id), newProduct])
        );
      } catch {}
    }

    setIsAddModalOpen(false);
    showNotification(
      backendSaved
        ? "✨ Smoothie product created successfully in MongoDB & store!"
        : "✨ Smoothie product saved offline in catalog (queued for auto-sync)!"
    );
  };

  // Save Product Changes
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    let finalThumbnail;
    try {
      finalThumbnail = getSelectedThumbnail();
    } catch (err) {
      alert(err.message);
      return;
    }

    const payload = {
      title: formData.title.trim(),
      price: parseFloat(formData.price),
      shortDescription: formData.shortDescription?.trim() || "",
      description: formData.description?.trim() || "",
      thumbnail: finalThumbnail,
      category: formData.category || "Classic",
      inStock: Boolean(formData.inStock),
    };

    let backendSaved = false;

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        logout();
        alert("Session expired. Please log in again as admin.");
        return;
      }
      if (res.ok) {
        backendSaved = true;
      }
    } catch (apiErr) {
      console.warn("Backend update sync note:", apiErr.message);
    }

    const currentList = products && products.length > 0 ? products : getStoredProducts();
    const updated = currentList.map((p) =>
      p.id === editingProduct.id
        ? {
            ...p,
            ...payload,
            thumbnail: resolveThumbnail(payload.thumbnail),
            rawThumbnail: payload.thumbnail,
          }
        : p
    );
    setProducts(updated);
    saveStoredProducts(updated);

    if (!backendSaved) {
      try {
        const queue = JSON.parse(localStorage.getItem("smoothie_offline_products_queue") || "[]");
        const itemToQueue = updated.find((p) => p.id === editingProduct.id);
        if (itemToQueue) {
          localStorage.setItem(
            "smoothie_offline_products_queue",
            JSON.stringify([...queue.filter((q) => q.id !== editingProduct.id), itemToQueue])
          );
        }
      } catch {}
    }

    setEditingProduct(null);
    showNotification(
      backendSaved
        ? `✅ Updated "${formData.title}" details & pricing in MongoDB!`
        : `✅ Updated "${formData.title}" offline (queued for auto-sync)!`
    );
  };

  // Delete Product
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        logout();
        alert("Session expired. Please log in again as admin.");
        return;
      }
    } catch (apiErr) {
      console.warn("Backend delete sync note:", apiErr.message);
    }

    const currentList = products && products.length > 0 ? products : getStoredProducts();
    const updated = currentList.filter((p) => p.id !== productToDelete.id);
    setProducts(updated);
    saveStoredProducts(updated);

    setProductToDelete(null);
    showNotification(`🗑️ Deleted smoothie "${productToDelete.title}"`);
  };

  // Reset to default seed products
  const handleResetProducts = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all products back to original 10 defaults? Any custom products will be restored."
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/products/reset", {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        logout();
        alert("Session expired. Please log in again as admin.");
        return;
      }
    } catch (apiErr) {
      console.warn("Backend reset sync note:", apiErr.message);
    }

    const resetDefaults = defaultProductsList.map((p) => ({
      ...p,
      thumbnail: resolveThumbnail(p.thumbnail),
      rawThumbnail: p.thumbnail,
    }));
    setProducts(resetDefaults);
    saveStoredProducts(resetDefaults);
    showNotification("🔄 Successfully reset product catalog to default smoothies!");
  };

  // Filtered products list
  const filteredProducts = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reusable Image Selection UI block
  const renderImagePicker = () => (
    <div className="form-group">
      <label>Smoothie Image Source</label>

      {/* Source selector buttons */}
      <div className="image-source-tabs">
        <button
          type="button"
          className={`image-source-tab ${formData.imageSourceType === "preset" ? "active" : ""}`}
          onClick={() => setFormData({ ...formData, imageSourceType: "preset" })}
        >
          🍓 Fruit Presets
        </button>
        <button
          type="button"
          className={`image-source-tab ${formData.imageSourceType === "device" ? "active" : ""}`}
          onClick={() => setFormData({ ...formData, imageSourceType: "device" })}
        >
          📱 Upload from Device
        </button>
        <button
          type="button"
          className={`image-source-tab ${formData.imageSourceType === "url" ? "active" : ""}`}
          onClick={() => setFormData({ ...formData, imageSourceType: "url" })}
        >
          🌐 Web Image URL
        </button>
      </div>

      {/* Option 1: Preset fruit icons */}
      {formData.imageSourceType === "preset" && (
        <div className="image-preset-picker">
          {Object.entries(presetImages).map(([key, img]) => (
            <button
              type="button"
              key={key}
              className={`preset-thumb-btn ${formData.thumbnail === key ? "selected" : ""}`}
              onClick={() => setFormData({ ...formData, thumbnail: key })}
            >
              <img src={img} alt={key} />
              <span>{key}</span>
            </button>
          ))}
        </div>
      )}

      {/* Option 2: Upload from Local Device */}
      {formData.imageSourceType === "device" && (
        <div className="device-upload-container">
          <input
            type="file"
            id="device-upload-file-input"
            accept="image/*"
            onChange={handleDeviceFileUpload}
            style={{ display: "none" }}
          />

          {!formData.deviceImage ? (
            <label htmlFor="device-upload-file-input" className="device-upload-dropzone">
              <span className="dropzone-icon">📷</span>
              <strong className="dropzone-title">Upload photo from your device</strong>
              <span className="dropzone-subtitle">
                Select any photo from your phone or computer (JPG, PNG, WebP)
              </span>
              <span className="dropzone-btn">Choose Image</span>
            </label>
          ) : (
            <div className="device-preview-card">
              <img
                src={formData.deviceImage}
                alt="Selected device upload"
                className="device-preview-thumb"
              />
              <div className="device-preview-meta">
                <strong className="device-preview-title">
                  {formData.deviceFileName || "Device Photo"}
                </strong>
                <span className="device-preview-ready">✓ Image loaded and ready to save</span>
                <div className="device-preview-actions">
                  <label htmlFor="device-upload-file-input" className="btn-device-reupload">
                    Change Photo
                  </label>
                  <button
                    type="button"
                    className="btn-device-remove"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        deviceImage: "",
                        deviceFileName: "",
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Option 3: External Web Image URL */}
      {formData.imageSourceType === "url" && (
        <div className="url-input-container">
          <input
            type="url"
            placeholder="Enter web image URL (e.g. https://images.unsplash.com/...)"
            value={formData.customImage}
            onChange={(e) => setFormData({ ...formData, customImage: e.target.value })}
            className="custom-url-input"
          />
          {formData.customImage && (
            <div className="url-preview-wrapper">
              <img
                src={formData.customImage}
                alt="Web URL Preview"
                className="url-preview-thumb"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span className="url-preview-label">Image URL Preview</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // If not logged in, show clean admin login panel
  if (!isLoggedIn) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="admin-login-icon">🛡️</div>
          <h2>Smoothie Shop Admin</h2>
          <p className="admin-login-subtitle">
            Sign in to manage smoothie products, pricing, inventory, and customer orders.
          </p>

          <form onSubmit={handleAdminLogin} className="admin-login-form">
            <div className="admin-field">
              <label htmlFor="admin-username">Username</label>
              <input
                id="admin-username"
                type="text"
                placeholder="Enter admin username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                placeholder="Enter admin password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </div>

            {loginError ? <div className="admin-error-box">{loginError}</div> : null}

            <button type="submit" className="admin-primary-btn">
              Sign In as Admin
            </button>

            <div className="admin-hint-box">
              <span>💡 Store Owner Credentials:</span>
              <code>Username: admin | Password: admin (or your custom password)</code>
            </div>
          </form>

          <div className="admin-back-link">
            <Link to="/">← Back to Storefront</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Toast Notification */}
      {notification ? <div className="admin-toast">{notification}</div> : null}

      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-header__brand">
          <h1>Smoothie Shop Admin</h1>
          <span className="admin-badge">Management Console</span>
        </div>

        <div className="admin-header__right">
          <div className="admin-db-status">
            <span
              className={`status-indicator ${
                mongoStatus.connected ? "connected" : "in-memory"
              }`}
            />
            <span>
              {mongoStatus.connected
                ? "MongoDB Connected"
                : "MongoDB Backend Active (Store Mode)"}
            </span>
          </div>

          <button
            type="button"
            className="admin-header-btn admin-password-btn"
            onClick={() => {
              setIsPasswordModalOpen(true);
              setPasswordError("");
            }}
            title="Change store owner password"
          >
            🔑 Change Password
          </button>

          <Link to="/" className="admin-store-link">
            🛍️ Storefront
          </Link>

          <button
            type="button"
            className="admin-header-btn admin-logout-btn"
            onClick={logout}
            title="Sign out of Admin Console"
          >
            🚪 Sign Out
          </button>
        </div>
      </header>

      {/* Dashboard Nav Tabs */}
      <div className="admin-tabs-bar">
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            🍹 Products & Pricing ({products.length})
          </button>
          <button
            className={`admin-tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("orders");
              fetchOrders();
            }}
          >
            📦 Customer Orders ({orders.length})
          </button>
        </div>

        {activeTab === "products" && (
          <div className="admin-actions-bar">
            <button className="admin-btn-add" onClick={openAddModal}>
              ➕ Add New Smoothie
            </button>
            <button className="admin-btn-reset" onClick={handleResetProducts}>
              🔄 Reset to Defaults
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === "products" && (
        <section className="admin-content-section">
          {/* Quick Metrics */}
          <div className="admin-metrics-row">
            <div className="metric-card">
              <span className="metric-label">Total Smoothies</span>
              <strong className="metric-value">{products.length}</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">In Stock</span>
              <strong className="metric-value">
                {products.filter((p) => p.inStock !== false).length}
              </strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Average Price</span>
              <strong className="metric-value">
                $
                {products.length > 0
                  ? (
                      products.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0) /
                      products.length
                    ).toFixed(2)
                  : "0.00"}
              </strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Database Engine</span>
              <strong className="metric-value text-accent">
                {mongoStatus.connected ? "MongoDB Cluster" : "REST + Memory Sync"}
              </strong>
            </div>
          </div>

          {/* Search bar */}
          <div className="admin-search-wrapper">
            <input
              type="text"
              placeholder="Search smoothies by name, flavor, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
          </div>

          {/* Products Table */}
          <div className="admin-table-container">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Smoothie Details</th>
                  <th>Price ($)</th>
                  <th>Inventory Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="admin-empty-table">
                      No smoothies found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((item) => (
                    <tr key={item.id} className="admin-table-row">
                      <td className="admin-td-thumb">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="admin-thumb-img"
                        />
                      </td>
                      <td className="admin-td-details">
                        <div className="product-title-row">
                          <strong className="admin-product-name">{item.title}</strong>
                          <span className="admin-id-tag">ID: {item.id}</span>
                        </div>
                        <p className="admin-short-desc">{item.shortDescription}</p>
                      </td>
                      <td className="admin-td-price">
                        <span className="admin-price-pill">${Number(item.price).toFixed(2)}</span>
                      </td>
                      <td className="admin-td-status">
                        <span
                          className={`stock-badge ${
                            item.inStock !== false ? "in-stock" : "out-of-stock"
                          }`}
                        >
                          {item.inStock !== false ? "In Stock" : "Unavailable"}
                        </span>
                      </td>
                      <td className="admin-td-actions">
                        <button
                          className="admin-action-btn edit"
                          onClick={() => openEditModal(item)}
                          title="Edit details and pricing"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="admin-action-btn delete"
                          onClick={() => setProductToDelete(item)}
                          title="Remove product"
                        >
                          🗑️ Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <section className="admin-content-section">
          <h2>Customer Store Orders ({orders.length})</h2>
          {orders.length === 0 ? (
            <div className="admin-empty-state">
              <span className="empty-icon">📦</span>
              <h3>No customer orders yet</h3>
              <p>
                When shoppers add smoothies to their cart and checkout, their orders will appear
                here in real-time.
              </p>
            </div>
          ) : (
            <div className="orders-grid">
              {orders.map((ord) => (
                <div key={ord.id} className="admin-order-card">
                  <div className="order-card-header">
                    <strong>Order #{ord.id}</strong>
                    <span className="order-date">
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleString() : "Just now"}
                    </span>
                  </div>

                  <div className="order-customer-info">
                    <p>
                      <strong>Customer:</strong> {ord.customer?.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {ord.customer?.email}
                    </p>
                    <p>
                      <strong>Ship To:</strong> {ord.customer?.address}, {ord.customer?.city},{" "}
                      {ord.customer?.zip}
                    </p>
                  </div>

                  <div className="order-items-list">
                    <strong>Items:</strong>
                    <ul>
                      {ord.items?.map((it, idx) => (
                        <li key={idx}>
                          {it.quantity}x {it.title} - ${Number(it.price * it.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="order-total-bar">
                    <span>Total Paid:</span>
                    <strong>${Number(ord.totalAmount).toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h2>Add New Smoothie Product</h2>
              <button
                className="admin-modal-close"
                onClick={() => setIsAddModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="admin-modal-form">
              <div className="form-group">
                <label>Smoothie Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Dragonfruit Glow Smoothie"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 6.49"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Classic">Classic Fruit</option>
                    <option value="Tropical">Tropical Blend</option>
                    <option value="Berries">Berry Power</option>
                    <option value="Wellness">Green & Wellness</option>
                    <option value="Indulgent">Indulgent & Protein</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Short Description (Tagline)</label>
                <input
                  type="text"
                  placeholder="e.g. Fresh. Energizing. Loaded with nutrients."
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Full Product Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe the smoothie flavor profile, ingredients, and health benefits..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Render Image Picker with Local Device Upload */}
              {renderImagePicker()}

              <div className="form-group-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  />
                  <span>Product is Available In Stock for Online Ordering</span>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h2>Edit Smoothie Details & Pricing</h2>
              <button className="admin-modal-close" onClick={() => setEditingProduct(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="admin-modal-form">
              <div className="form-group">
                <label>Smoothie Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Classic">Classic Fruit</option>
                    <option value="Tropical">Tropical Blend</option>
                    <option value="Berries">Berry Power</option>
                    <option value="Wellness">Green & Wellness</option>
                    <option value="Indulgent">Indulgent & Protein</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Short Description (Tagline)</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Full Product Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Render Image Picker with Local Device Upload */}
              {renderImagePicker()}

              <div className="form-group-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  />
                  <span>Product is Available In Stock</span>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box confirm-box">
            <h2>Delete Smoothie?</h2>
            <p>
              Are you sure you want to remove <strong>"{productToDelete.title}"</strong> from the
              smoothie menu? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setProductToDelete(null)}
              >
                Keep Item
              </button>
              <button
                type="button"
                className="btn-delete"
                onClick={handleDeleteProduct}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Owner Password Modal */}
      {isPasswordModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box confirm-box password-modal-box">
            <div className="admin-modal-header">
              <h2>Change Owner Password</h2>
              <button
                className="admin-modal-close"
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordError("");
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOwnerChangePassword} className="admin-modal-form">
              <div className="form-group text-left">
                <label>Current Password *</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1 text-left">
                  <label>New Password *</label>
                  <input
                    type="password"
                    placeholder="Min 4 characters"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group flex-1 text-left">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              {passwordError && (
                <div className="admin-error-box">{passwordError}</div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordError("");
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discreet Owner-Only Footer (Documentation is small, hidden by default, expandable only by owner) */}
      <footer className="admin-discreet-footer">
        <span className="admin-discreet-copy">Smoothie Shop Admin &bull; System Console v1.3</span>
        <div className="admin-discreet-tools">
          <button
            type="button"
            className="admin-discreet-toggle-btn"
            onClick={() => setShowOwnerDocs(!showOwnerDocs)}
            title="System Reference"
          >
            {showOwnerDocs ? "▾ Hide System Docs" : "⚙️ System Reference"}
          </button>
          {showOwnerDocs && (
            <a
              href="/Smoothie_Shop_Project_Documentation.pdf"
              download="Smoothie_Shop_Project_Documentation.pdf"
              className="admin-discreet-doc-download"
              target="_blank"
              rel="noopener noreferrer"
              title="Download Owner PDF Documentation"
            >
              📄 Download System Docs (PDF)
            </a>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Admin;

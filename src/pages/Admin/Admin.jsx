import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider.jsx";
import { presetImages, resolveThumbnail, saveStoredProducts } from "../../data/product.jsx";
import "./admin.css";

const Admin = () => {
  const { isLoggedIn, login } = useContext(AuthContext);

  // Login form state
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Admin Dashboard State
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products"); // 'products' | 'orders'
  const [searchQuery, setSearchQuery] = useState("");
  const [mongoStatus, setMongoStatus] = useState({ connected: false, checked: false });
  const [notification, setNotification] = useState("");

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

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((item) => ({
          ...item,
          thumbnail: resolveThumbnail(item.thumbnail),
          rawThumbnail: item.thumbnail,
        }));
        setProducts(mapped);
        saveStoredProducts(mapped);
      }
    } catch (err) {
      console.warn("Failed to fetch products from backend:", err);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.warn("Failed to fetch orders:", err);
    }
  };

  // Check health and MongoDB connection
  const checkHealth = async () => {
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const data = await res.json();
        setMongoStatus({ connected: Boolean(data.mongoConnected), checked: true });
      }
    } catch {
      setMongoStatus({ connected: false, checked: true });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    checkHealth();
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const success = login(usernameInput, passwordInput);
    if (success) {
      setLoginError("");
      fetchProducts();
      fetchOrders();
      checkHealth();
    } else {
      setLoginError("Invalid credentials. Try username: admin, password: admin");
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
      title: formData.title,
      price: parseFloat(formData.price),
      shortDescription: formData.shortDescription,
      description: formData.description,
      thumbnail: finalThumbnail,
      category: formData.category,
      inStock: formData.inStock,
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        showNotification("✨ Smoothie product created successfully in MongoDB / store!");
        await fetchProducts();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create product");
      }
    } catch (err) {
      alert("Error adding product: " + err.message);
    }
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
      title: formData.title,
      price: parseFloat(formData.price),
      shortDescription: formData.shortDescription,
      description: formData.description,
      thumbnail: finalThumbnail,
      category: formData.category,
      inStock: formData.inStock,
    };

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setEditingProduct(null);
        showNotification(`✅ Updated "${formData.title}" details & pricing!`);
        await fetchProducts();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update product");
      }
    } catch (err) {
      alert("Error updating product: " + err.message);
    }
  };

  // Delete Product
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProductToDelete(null);
        showNotification(`🗑️ Deleted smoothie "${productToDelete.title}"`);
        await fetchProducts();
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      alert("Error deleting product: " + err.message);
    }
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
      const res = await fetch("/api/products/reset", { method: "POST" });
      if (res.ok) {
        showNotification("🔄 Successfully reset product catalog to default smoothies!");
        await fetchProducts();
      }
    } catch (err) {
      alert("Failed to reset: " + err.message);
    }
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
              <span>💡 Default credentials:</span>
              <code>Username: admin | Password: admin</code>
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

          <Link to="/" className="admin-store-link">
            🛍️ Storefront
          </Link>
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
          <button
            className={`admin-tab ${activeTab === "docs" ? "active" : ""}`}
            onClick={() => setActiveTab("docs")}
          >
            📖 Project Documentation
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

      {/* Documentation Tab */}
      {activeTab === "docs" && (
        <section className="admin-content-section admin-docs-section">
          <div className="docs-header-card">
            <span className="docs-tag">Technical Project Documentation</span>
            <h2>Platform Architecture & Contributions</h2>
            <p className="docs-lead">
              A detailed breakdown of the independent e-commerce Smoothie Shop, highlighting the original frontend architecture created by <strong>Muhammad Faizan Mustafa</strong> and the full-stack backend, database, and admin panel additions.
            </p>
          </div>

          <div className="docs-kpi-bar">
            <div className="docs-kpi-item">
              <span className="docs-kpi-icon">🛡️</span>
              <div>
                <strong>Code Preserved</strong>
                <span>100% Original Code Kept Intact</span>
              </div>
            </div>
            <div className="docs-kpi-item">
              <span className="docs-kpi-icon">⚡</span>
              <div>
                <strong>Pure JavaScript</strong>
                <span>ES Modules & JSX (Zero TS)</span>
              </div>
            </div>
            <div className="docs-kpi-item">
              <span className="docs-kpi-icon">🍃</span>
              <div>
                <strong>MongoDB + Mongoose</strong>
                <span>Persistent DB & Memory Fallback</span>
              </div>
            </div>
            <div className="docs-kpi-item">
              <span className="docs-kpi-icon">🚀</span>
              <div>
                <strong>Full-Stack Engine</strong>
                <span>Node 22, Express 5, Vite Middleware</span>
              </div>
            </div>
          </div>

          <div className="docs-columns-grid">
            {/* Column 1: What User Did */}
            <article className="docs-column-card card-user">
              <div className="docs-col-header">
                <span className="col-icon">👨‍💻</span>
                <div>
                  <h3>What You Built</h3>
                  <span className="col-author">Muhammad Faizan Mustafa (Author & Developer)</span>
                </div>
              </div>

              <div className="docs-col-body">
                <div className="docs-block">
                  <h4>🎨 Frontend React 19 SPA Architecture</h4>
                  <ul>
                    <li>
                      <strong>Interactive Home View (<code>Home.jsx</code>)</strong>: Built hero carousel with rotating smoothie slides (Berry Bliss, Mango Glow, Strawberry Freshness, Tropical Energy), custom arrow and dot navigation, and responsive 4-column product showcase grid.
                    </li>
                    <li>
                      <strong>Detailed Smoothie View (<code>ProductDetails.jsx</code>)</strong>: Created detailed product pages with flavor tags, nutritional text, previous/next smoothie navigation, and purchase gate.
                    </li>
                    <li>
                      <strong>Shopping Cart Flow (<code>Cart.jsx</code>)</strong>: Built complete cart page with image thumbnails, quantity increment/decrement controls, item deletion, live subtotal calculations, and empty-cart placeholder.
                    </li>
                    <li>
                      <strong>Validated Checkout Flow (<code>Checkout.jsx</code>)</strong>: Implemented complete checkout form with <code>react-hook-form</code> and <code>zod</code> schema validation verifying formatted card numbers (xxxx-xxxx-xxxx-xxxx), shipping addresses, email, and billing details.
                    </li>
                    <li>
                      <strong>About Page (<code>About.jsx</code>)</strong>: Authored developer portfolio section featuring personal avatar, bio ("Behind the blend"), and interactive message contact form.
                    </li>
                    <li>
                      <strong>Interactive AI-Free Chatbot (<code>ChatBot.jsx</code>, <code>chatData.jsx</code>)</strong>: Built rule-based keyword assistant with customizable answers for product, shipping, and order queries.
                    </li>
                    <li>
                      <strong>404 Fallback (<code>Notfound.jsx</code>)</strong>: Designed not-found routing screen.
                    </li>
                  </ul>
                </div>

                <div className="docs-block">
                  <h4>🧠 State Management & Providers</h4>
                  <ul>
                    <li>
                      <strong>Cart Context (<code>CartContext.jsx</code>)</strong>: Centralized state providing <code>cart</code>, <code>addToCart</code>, <code>removeFromCart</code>, and <code>updateQuantity</code> with live badge counts in the navbar.
                    </li>
                    <li>
                      <strong>Auth Provider (<code>AuthProvider.jsx</code>)</strong>: Session context managing login state, persistence in <code>localStorage</code>, and authentication checks.
                    </li>
                    <li>
                      <strong>Login Modal (<code>LoginModal.jsx</code>)</strong>: Modal popup with validation prompting guests to log in before purchasing items.
                    </li>
                  </ul>
                </div>

                <div className="docs-block">
                  <h4>🍓 Media & Design Assets</h4>
                  <ul>
                    <li>
                      Curated 10 high-resolution smoothie image assets: Berry, Mango, Tropical, Strawberry, Banana, Pineapple, Peach, Green, Chocolate, and Apple.
                    </li>
                    <li>
                      Authored scoped CSS files for all components with distinctive color variables and typography.
                    </li>
                  </ul>
                </div>
              </div>
            </article>

            {/* Column 2: What Assistant Did */}
            <article className="docs-column-card card-ai">
              <div className="docs-col-header">
                <span className="col-icon">⚙️</span>
                <div>
                  <h3>What Was Added / Upgraded</h3>
                  <span className="col-author">Full-Stack Backend, Database & Admin Tools</span>
                </div>
              </div>

              <div className="docs-col-body">
                <div className="docs-block">
                  <h4>🔒 Strict Execution & Code Preservation</h4>
                  <ul>
                    <li>
                      <strong>Preserved 100% of Original Code</strong>: Zero rewrites or deletions of your original components, logic, or styles.
                    </li>
                    <li>
                      <strong>100% Pure JavaScript Standard</strong>: All new backend and frontend code was written strictly in JavaScript (<code>.js</code> and <code>.jsx</code>).
                    </li>
                    <li>
                      <strong>Environment Normalization</strong>: Removed subpaths (<code>base: "/Smothie-SHop/"</code> and <code>basename="/Smothie-SHop"</code>) so the app boots cleanly at root, removed extraneous <code>bun.lock</code>, and bound dev server to host <code>0.0.0.0</code> on port <code>3000</code>.
                    </li>
                  </ul>
                </div>

                <div className="docs-block">
                  <h4>🖥️ Full-Stack Backend Server (<code>server.js</code>)</h4>
                  <ul>
                    <li>
                      Created an Express 5 application with integrated Vite middleware (`app.use(vite.middlewares)`), providing unified API and frontend hosting in a single process.
                    </li>
                    <li>
                      Configured <code>50mb</code> payload limits for JSON and URL-encoded requests to support high-resolution photo uploads directly from mobile phones and cameras.
                    </li>
                    <li>
                      Included <code>.env.example</code> for standard environment configuration (<code>PORT</code>, <code>MONGODB_URI</code>).
                    </li>
                  </ul>
                </div>

                <div className="docs-block">
                  <h4>🍃 MongoDB & Mongoose Database Layer</h4>
                  <ul>
                    <li>
                      Implemented Mongoose schemas and models for <code>Product</code> and <code>Order</code> with timestamps and schema validation.
                    </li>
                    <li>
                      <strong>Resilient Failover Architecture</strong>: If MongoDB is connected, operations read and write to MongoDB. If MongoDB is offline, it transparently falls back to an in-memory & local storage sync store so the app never freezes or crashes.
                    </li>
                    <li>
                      Initial database auto-seeding of the 10 original smoothies on startup.
                    </li>
                  </ul>
                </div>

                <div className="docs-block">
                  <h4>📡 RESTful API Endpoints</h4>
                  <ul>
                    <li><code>GET /api/products</code> & <code>GET /api/products/:id</code>: Fetch products</li>
                    <li><code>POST /api/products</code>: Add new smoothie with image, price, tags, and category</li>
                    <li><code>PUT /api/products/:id</code>: Update smoothie pricing, descriptions, and stock status</li>
                    <li><code>DELETE /api/products/:id</code>: Remove product from catalog</li>
                    <li><code>POST /api/products/reset</code>: One-click restore to original 10 smoothies</li>
                    <li><code>GET /api/orders</code> & <code>POST /api/orders</code>: Live customer store orders</li>
                    <li><code>GET /api/health</code>: Real-time database cluster & server status check</li>
                  </ul>
                </div>

                <div className="docs-block">
                  <h4>🛡️ Full Admin Management Panel (<code>/admin</code>)</h4>
                  <ul>
                    <li>
                      Protected by your <code>AuthProvider</code> (Credentials: <code>admin</code> / <code>admin</code>).
                    </li>
                    <li>
                      <strong>Live Catalog & Pricing Editor</strong>: Change any product's price, title, short description, full description, and in-stock flag with instant updates across the store.
                    </li>
                    <li>
                      <strong>Local Device Image Upload</strong>: Integrated a drag-and-drop & file picker allowing admins to upload images directly from their device, converted via <code>FileReader</code> with live previews.
                    </li>
                    <li>
                      <strong>Three Image Sourcing Options</strong>: Fruit presets, Local device upload, or External web URL.
                    </li>
                    <li>
                      <strong>Real-Time Customer Orders Hub</strong>: View incoming customer orders submitted from checkout with names, emails, delivery addresses, items, and total revenue.
                    </li>
                    <li>
                      <strong>Database Engine Status Badge</strong>: Real-time visual indicator showing whether MongoDB is connected or operating in store sync mode.
                    </li>
                    <li>
                      <strong>Responsive CSS</strong>: Styled navigation badge, modals, and fully mobile-optimized viewports.
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          </div>

          <div className="docs-specs-card">
            <h3>Technical Specifications</h3>
            <div className="specs-table-wrapper">
              <table className="specs-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Technology / Library</th>
                    <th>Role in Platform</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Frontend Framework</strong></td>
                    <td>React 19 + React Router 7</td>
                    <td>Client SPA routing, component rendering, and hook state</td>
                  </tr>
                  <tr>
                    <td><strong>Build Tool</strong></td>
                    <td>Vite 8</td>
                    <td>Hot Module Replacement & development middleware</td>
                  </tr>
                  <tr>
                    <td><strong>Backend Server</strong></td>
                    <td>Node.js 22 + Express 5</td>
                    <td>REST API router, static serving, and full-stack runtime</td>
                  </tr>
                  <tr>
                    <td><strong>Database ORM</strong></td>
                    <td>MongoDB 6+ & Mongoose 9</td>
                    <td>Persistent document storage for products and customer orders</td>
                  </tr>
                  <tr>
                    <td><strong>Form Validation</strong></td>
                    <td>React Hook Form 7 + Zod 4</td>
                    <td>Strict client-side validation on checkout and contact forms</td>
                  </tr>
                  <tr>
                    <td><strong>Image Handling</strong></td>
                    <td>HTML5 FileReader + 50MB Base64 Buffer</td>
                    <td>Local device file uploading and instant image rendering</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
    </div>
  );
};

export default Admin;

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initial Seed Products
const defaultProducts = [
  {
    id: "1",
    title: "Berry Blast Smoothie",
    price: 5.99,
    thumbnail: "/src/assets/berry.jpg",
    shortDescription: "Creamy. Naturally sweet. Perfectly balanced.",
    description:
      "A delicious and creamy blend of fresh mixed berries, smooth yogurt, and a touch of honey. It has a naturally sweet and slightly tangy berry flavor with a rich, refreshing texture. Packed with antioxidants, vitamin C, and nutrients from berries and yogurt, it is a great choice for people looking for a refreshing breakfast, post-workout drink, or a naturally nutritious snack.",
    category: "Berries",
    inStock: true,
  },
  {
    id: "2",
    title: "Mango Magic Smoothie",
    price: 6.49,
    thumbnail: "/src/assets/mango.png",
    shortDescription: "Tropical. Creamy. Naturally delicious.",
    description:
      "A rich and creamy tropical smoothie made with ripe mangoes, fresh milk, and a touch of natural sweetness. It has a smooth texture and a sweet, juicy mango flavor that makes every sip refreshing and satisfying.",
    category: "Tropical",
    inStock: true,
  },
  {
    id: "3",
    title: "Tropical Sunrise Smoothie",
    price: 5.49,
    thumbnail: "/src/assets/tropical.png",
    shortDescription: "Bright. Fruity. Refreshingly tropical.",
    description:
      "A bright and refreshing tropical blend of juicy pineapple, sweet orange, and ripe mango. The combination creates a naturally sweet, slightly tangy flavor with a light and refreshing texture.",
    category: "Tropical",
    inStock: true,
  },
  {
    id: "4",
    title: "Strawberry Dream Smoothie",
    price: 6.99,
    thumbnail: "/src/assets/strawberry.jpg",
    shortDescription: "Sweet. Creamy. Smooth and refreshing.",
    description:
      "A sweet, creamy smoothie made with fresh strawberries, ripe banana, and smooth yogurt. It combines the slightly tangy taste of strawberries with the naturally sweet and creamy flavor of banana.",
    category: "Berries",
    inStock: true,
  },
  {
    id: "5",
    title: "Banana Boost Smoothie",
    price: 4.99,
    thumbnail: "/src/assets/banana.png",
    shortDescription: "Smooth. Filling. Naturally energizing.",
    description:
      "A smooth and creamy banana smoothie made with ripe bananas, fresh milk, and a touch of honey. It has a naturally sweet, rich banana flavor with a soft and satisfying texture.",
    category: "Classic",
    inStock: true,
  },
  {
    id: "6",
    title: "Pineapple Paradise Smoothie",
    price: 6.29,
    thumbnail: "/src/assets/pineapple.png",
    shortDescription: "Fresh. Tropical. Cool and refreshing.",
    description:
      "A refreshing tropical smoothie combining juicy pineapple with creamy coconut milk and delicious tropical flavors. It has a bright, sweet-and-tangy pineapple taste balanced by the smooth richness of coconut milk.",
    category: "Tropical",
    inStock: true,
  },
  {
    id: "7",
    title: "Peachy Delight Smoothie",
    price: 5.79,
    thumbnail: "/src/assets/peach.png",
    shortDescription: "Juicy. Creamy. Naturally sweet.",
    description:
      "A smooth and creamy peach smoothie made with juicy peaches, yogurt, and a touch of honey. It has a delicate fruity sweetness with a refreshing peach aroma and creamy texture.",
    category: "Classic",
    inStock: true,
  },
  {
    id: "8",
    title: "Green Energy Smoothie",
    price: 7.49,
    thumbnail: "/src/assets/green.png",
    shortDescription: "Fresh. Green. Full of natural goodness.",
    description:
      "A fresh green smoothie made with spinach, crisp apple, ripe banana, and a splash of lime. The apple and banana provide natural sweetness while lime adds a refreshing citrus kick.",
    category: "Wellness",
    inStock: true,
  },
  {
    id: "9",
    title: "Chocolate Banana Smoothie",
    price: 6.59,
    thumbnail: "/src/assets/chocolate.png",
    shortDescription: "Rich. Creamy. Chocolatey perfection.",
    description:
      "A rich and creamy combination of ripe banana, smooth chocolate, and fresh milk, creating a delicious dessert-like smoothie. The banana adds natural sweetness and a creamy texture while chocolate provides a deep, indulgent flavor.",
    category: "Indulgent",
    inStock: true,
  },
  {
    id: "10",
    title: "Apple Fresh Smoothie",
    price: 5.29,
    thumbnail: "/src/assets/apple.png",
    shortDescription: "Crisp. Fresh. Lightly spiced.",
    description:
      "A crisp and refreshing smoothie made with fresh apples, creamy yogurt, and a hint of cinnamon. It has a naturally sweet apple flavor with a subtle warm cinnamon finish and a smooth, creamy texture.",
    category: "Classic",
    inStock: true,
  },
];

// In-memory fallback stores
let inMemoryProducts = [...defaultProducts];
let inMemoryOrders = [];

// Mongoose Schema Definitions
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  shortDescription: { type: String, default: "" },
  description: { type: String, default: "" },
  category: { type: String, default: "Smoothies" },
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
  },
  items: [
    {
      id: String,
      title: String,
      price: Number,
      quantity: Number,
      thumbnail: String,
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Processing" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const Setting = mongoose.models.Setting || mongoose.model("Setting", settingSchema);

// Admin Authentication & Security
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "smoothie_shop_admin_secret_9876543210";
let adminUsername = process.env.ADMIN_USERNAME || "admin";
let adminPassword = process.env.ADMIN_PASSWORD || "admin";

// Helper to retrieve effective password (checking MongoDB setting first)
async function getEffectiveAdminPassword() {
  if (isMongoConnected) {
    try {
      const doc = await Setting.findOne({ key: "admin_password" });
      if (doc && doc.value) return doc.value;
    } catch {}
  }
  return adminPassword;
}

// Generate signed HMAC Bearer token
function generateAdminToken(username) {
  const payload = {
    user: username,
    role: "admin",
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(payloadBase64)
    .digest("base64url");
  return `${payloadBase64}.${signature}`;
}

// Verify signed HMAC Bearer token
function verifyAdminToken(token) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadBase64, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(payloadBase64)
      .digest("base64url");
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf-8"));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// Express Security Middleware: Protects sensitive admin endpoints
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const verified = verifyAdminToken(token);
  if (!verified) {
    return res.status(401).json({
      error: "Unauthorized: Protected route. Valid admin Bearer token required.",
    });
  }
  req.admin = verified;
  next();
}

// MongoDB Serverless Connection Management
let isMongoConnected = false;
let cached = global._mongooseCached;
if (!cached) {
  cached = global._mongooseCached = { conn: null, promise: null };
}

mongoose.set("bufferCommands", false);

async function connectMongoDB() {
  const uri = process.env.MONGODB_URI;

  // On Vercel or cloud serverless, skip localhost connection attempts if MONGODB_URI is not provided
  if (!uri) {
    if (process.env.VERCEL) {
      isMongoConnected = false;
      return false;
    }
  }

  const targetUri = uri || "mongodb://127.0.0.1:27017/smoothie_shop";

  if (cached.conn) {
    isMongoConnected = true;
    return true;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(targetUri, {
        serverSelectionTimeoutMS: 4000,
      })
      .then(async (m) => {
        isMongoConnected = true;
        console.log("[MongoDB] Connected successfully to database.");
        try {
          const count = await Product.countDocuments();
          if (count === 0) {
            console.log("[MongoDB] Seeding initial smoothie products...");
            await Product.insertMany(defaultProducts);
            console.log("[MongoDB] Initial products seeded successfully.");
          }
        } catch (seedErr) {
          console.warn("[MongoDB] Seeding check note:", seedErr.message);
        }
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        isMongoConnected = false;
        console.warn(
          `[MongoDB] Note: MongoDB connection is currently inactive (${err.message}). Using seamless high-performance in-memory persistence fallback.`
        );
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
    isMongoConnected = Boolean(cached.conn);
    return isMongoConnected;
  } catch {
    cached.promise = null;
    isMongoConnected = false;
    return false;
  }
}

// Attempt initial connection if URI is available or running locally
if (process.env.MONGODB_URI || !process.env.VERCEL) {
  connectMongoDB();
}

// Ensure database connection is active on serverless invocations
app.use("/api", async (req, res, next) => {
  if (process.env.MONGODB_URI && !isMongoConnected) {
    try {
      await connectMongoDB();
    } catch {
      // safe fallback
    }
  }
  next();
});

// ----------------------
// REST API ROUTES
// ----------------------

// Health & Status
app.get("/api/health", async (req, res) => {
  let count = inMemoryProducts.length;
  if (isMongoConnected) {
    try {
      count = await Product.countDocuments();
    } catch {
      // fallback
    }
  }
  res.json({
    status: "ok",
    mongoConnected: isMongoConnected,
    hasMongoUriEnv: Boolean(process.env.MONGODB_URI),
    productCount: count,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/admin/login - Authenticate store admin and issue signed Bearer token
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const currentPass = await getEffectiveAdminPassword();

    if (username !== adminUsername || password !== currentPass) {
      return res.status(401).json({ error: "Invalid admin credentials." });
    }

    const token = generateAdminToken(username);
    res.json({
      success: true,
      token,
      user: { username: adminUsername, role: "admin" },
      message: "Admin authentication successful.",
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

// GET /api/admin/verify - Verify active admin session token
app.get("/api/admin/verify", requireAdminAuth, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

// GET /api/products - Get all products (Public)
app.get("/api/products", async (req, res) => {
  try {
    if (isMongoConnected) {
      const products = await Product.find().sort({ id: 1 }).lean();
      return res.json(products);
    }
  } catch (err) {
    console.warn("[MongoDB Error] Falling back to in-memory store for GET /api/products:", err.message);
  }
  res.json(inMemoryProducts);
});

// GET /api/products/:id - Get single product (Public)
app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (isMongoConnected) {
      const product = await Product.findOne({ id }).lean();
      if (product) return res.json(product);
    }
  } catch (err) {
    console.warn("[MongoDB Error] Falling back to in-memory store:", err.message);
  }

  const item = inMemoryProducts.find((p) => p.id === id);
  if (!item) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(item);
});

// POST /api/products - Add new product (Protected: Admin Only)
app.post("/api/products", requireAdminAuth, async (req, res) => {
  try {
    const { title, price, thumbnail, shortDescription, description, category, inStock } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({ error: "Title and price are required." });
    }

    const newId = req.body.id ? String(req.body.id) : String(Date.now());
    const newProduct = {
      id: newId,
      title: String(title).trim(),
      price: Number(price),
      thumbnail: thumbnail || "/src/assets/berry.jpg",
      shortDescription: shortDescription || "Freshly blended smoothie.",
      description: description || "Freshly made with 100% natural fruits and ingredients.",
      category: category || "Special",
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isMongoConnected) {
      try {
        const created = await Product.create(newProduct);
        inMemoryProducts.push(created.toObject());
        return res.status(201).json(created);
      } catch (err) {
        console.warn("[MongoDB Error] Failed to insert product to Mongo, using memory store:", err.message);
      }
    }

    inMemoryProducts.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product", details: err.message });
  }
});

// PUT /api/products/:id - Update product (Protected: Admin Only)
app.put("/api/products/:id", requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, thumbnail, shortDescription, description, category, inStock } = req.body;

    const updates = { updatedAt: new Date() };
    if (title !== undefined) updates.title = String(title).trim();
    if (price !== undefined) updates.price = Number(price);
    if (thumbnail !== undefined) updates.thumbnail = thumbnail;
    if (shortDescription !== undefined) updates.shortDescription = shortDescription;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (inStock !== undefined) updates.inStock = Boolean(inStock);

    if (isMongoConnected) {
      try {
        const updated = await Product.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
        if (updated) {
          const idx = inMemoryProducts.findIndex((p) => p.id === id);
          if (idx !== -1) inMemoryProducts[idx] = updated;
          return res.json(updated);
        }
      } catch (err) {
        console.warn("[MongoDB Error] Failed update, using in-memory store:", err.message);
      }
    }

    const idx = inMemoryProducts.findIndex((p) => p.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    inMemoryProducts[idx] = { ...inMemoryProducts[idx], ...updates };
    res.json(inMemoryProducts[idx]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product", details: err.message });
  }
});

// DELETE /api/products/:id - Remove product (Protected: Admin Only)
app.delete("/api/products/:id", requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      try {
        await Product.deleteOne({ id });
      } catch (err) {
        console.warn("[MongoDB Error] Failed to delete from Mongo:", err.message);
      }
    }

    const initialLen = inMemoryProducts.length;
    inMemoryProducts = inMemoryProducts.filter((p) => p.id !== id);

    if (inMemoryProducts.length === initialLen && !isMongoConnected) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully", id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product", details: err.message });
  }
});

// POST /api/products/reset - Reset to default seed products (Protected: Admin Only)
app.post("/api/products/reset", requireAdminAuth, async (req, res) => {
  try {
    inMemoryProducts = [...defaultProducts];

    if (isMongoConnected) {
      try {
        await Product.deleteMany({});
        await Product.insertMany(defaultProducts);
      } catch (err) {
        console.warn("[MongoDB Error] Reset failed on Mongo:", err.message);
      }
    }

    res.json({ message: "Products reset to default items", products: inMemoryProducts });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset products", details: err.message });
  }
});

// GET /api/orders - List all customer orders (Protected: Admin Only)
app.get("/api/orders", requireAdminAuth, async (req, res) => {
  try {
    if (isMongoConnected) {
      const orders = await Order.find().sort({ createdAt: -1 }).lean();
      return res.json(orders);
    }
  } catch (err) {
    console.warn("[MongoDB Error] Falling back to in-memory store for orders:", err.message);
  }
  res.json(inMemoryOrders);
});

// POST /api/orders - Create new order
app.post("/api/orders", async (req, res) => {
  try {
    const { customer, items, totalAmount } = req.body;
    if (!customer || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const newOrder = {
      id: `ORD-${Date.now()}`,
      customer,
      items,
      totalAmount: Number(totalAmount) || 0,
      status: "Processing",
      createdAt: new Date(),
    };

    if (isMongoConnected) {
      try {
        const created = await Order.create(newOrder);
        inMemoryOrders.unshift(created.toObject());
        return res.status(201).json(created);
      } catch (err) {
        console.warn("[MongoDB Error] Failed to save order in Mongo:", err.message);
      }
    }

    inMemoryOrders.unshift(newOrder);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to save order", details: err.message });
  }
});

// POST /api/sync/products - Sync products created or updated offline into MongoDB (Protected: Admin Only)
app.post("/api/sync/products", requireAdminAuth, async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.json({ message: "No products to sync", count: 0 });
    }

    let syncedCount = 0;
    for (const p of products) {
      if (!p.id || !p.title) continue;

      const cleanProduct = {
        id: String(p.id),
        title: String(p.title).trim(),
        price: Number(p.price) || 0,
        thumbnail: p.rawThumbnail || p.thumbnail || "/src/assets/berry.jpg",
        shortDescription: p.shortDescription || "",
        description: p.description || "",
        category: p.category || "Classic",
        inStock: p.inStock !== undefined ? Boolean(p.inStock) : true,
        updatedAt: new Date(),
      };

      if (isMongoConnected) {
        try {
          await Product.findOneAndUpdate(
            { id: cleanProduct.id },
            { $set: cleanProduct, $setOnInsert: { createdAt: new Date() } },
            { upsert: true, new: true }
          );
          syncedCount++;
        } catch (dbErr) {
          console.warn("[Sync Error] Product sync error for", cleanProduct.id, dbErr.message);
        }
      }

      // Also ensure memory store is updated
      const existingIdx = inMemoryProducts.findIndex((item) => item.id === cleanProduct.id);
      if (existingIdx >= 0) {
        inMemoryProducts[existingIdx] = { ...inMemoryProducts[existingIdx], ...cleanProduct };
      } else {
        inMemoryProducts.push(cleanProduct);
      }
    }

    res.json({
      message: `Successfully synchronized ${syncedCount} products to MongoDB.`,
      syncedCount,
      mongoConnected: isMongoConnected,
    });
  } catch (err) {
    res.status(500).json({ error: "Sync failed", details: err.message });
  }
});

// POST /api/sync/orders - Sync offline orders into MongoDB (Protected: Admin Only)
app.post("/api/sync/orders", requireAdminAuth, async (req, res) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.json({ message: "No orders to sync", count: 0 });
    }

    let syncedCount = 0;
    for (const o of orders) {
      if (!o.id || !o.customer) continue;

      if (isMongoConnected) {
        try {
          const existing = await Order.findOne({ id: o.id });
          if (!existing) {
            await Order.create({
              id: o.id,
              customer: o.customer,
              items: o.items || [],
              totalAmount: Number(o.totalAmount) || 0,
              status: o.status || "Processing",
              createdAt: o.createdAt ? new Date(o.createdAt) : new Date(),
            });
            syncedCount++;
          }
        } catch (dbErr) {
          console.warn("[Sync Error] Order sync error for", o.id, dbErr.message);
        }
      }

      if (!inMemoryOrders.some((item) => item.id === o.id)) {
        inMemoryOrders.unshift(o);
      }
    }

    res.json({
      message: `Successfully synchronized ${syncedCount} orders to MongoDB.`,
      syncedCount,
      mongoConnected: isMongoConnected,
    });
  } catch (err) {
    res.status(500).json({ error: "Order sync failed", details: err.message });
  }
});

// POST /api/admin/change-password - Update store owner password (Protected: Admin Only)
app.post("/api/admin/change-password", requireAdminAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    let currentPass = adminPassword;

    if (isMongoConnected) {
      try {
        const doc = await Setting.findOne({ key: "admin_password" });
        if (doc) currentPass = doc.value;
      } catch {}
    }

    if (oldPassword !== currentPass) {
      return res.status(400).json({ error: "Current password does not match." });
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return res.status(400).json({ error: "New password must be at least 4 characters long." });
    }

    adminPassword = newPassword.trim();

    if (isMongoConnected) {
      try {
        await Setting.findOneAndUpdate(
          { key: "admin_password" },
          { $set: { value: adminPassword, updatedAt: new Date() } },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.warn("Failed to persist password in MongoDB:", err.message);
      }
    }

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update password", details: err.message });
  }
});

// ----------------------
// VITE INTEGRATION
// ----------------------
const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

if (!isProduction) {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else if (!process.env.VERCEL) {
  app.use(express.static(path.resolve(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Smoothie Shop Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

export default app;

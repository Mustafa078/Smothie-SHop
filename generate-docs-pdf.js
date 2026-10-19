import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath1 = path.join(__dirname, "Smoothie_Shop_Project_Documentation.pdf");
const outputPath2 = path.join(__dirname, "public", "Smoothie_Shop_Project_Documentation.pdf");

// Ensure public directory exists
if (!fs.existsSync(path.join(__dirname, "public"))) {
  fs.mkdirSync(path.join(__dirname, "public"), { recursive: true });
}

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 45, bottom: 45, left: 45, right: 45 },
  bufferPages: true,
});

const stream1 = fs.createWriteStream(outputPath1);
const stream2 = fs.createWriteStream(outputPath2);

doc.pipe(stream1);
doc.pipe(stream2);

// Color Palette
const PRIMARY = "#9c2f5f"; // Berry burgundy
const SECONDARY = "#2f7d5a"; // Fresh green
const DARK = "#20251f"; // Dark text
const MUTED = "#555d54"; // Muted text
const LIGHT_BG = "#f5ede0"; // Warm soft bg
const BORDER = "#eadfce"; // Border tint
const BOX_BG_PROCESS = "#fdf2f8"; // Light rose for processes
const BOX_BORDER_PROCESS = "#f472b6";
const BOX_BG_ENTITY = "#ecfdf5"; // Light emerald for external entities
const BOX_BORDER_ENTITY = "#34d399";
const BOX_BG_DATA = "#fef3c7"; // Light amber for data stores
const BOX_BORDER_DATA = "#f59e0b";

// Helper: Section Header
function renderSectionHeader(title, subtitle) {
  doc.moveDown(0.6);
  doc.fillColor(PRIMARY).fontSize(13.5).font("Helvetica-Bold").text(title.toUpperCase(), { characterSpacing: 0.5 });
  if (subtitle) {
    doc.fillColor(MUTED).fontSize(9).font("Helvetica-Oblique").text(subtitle);
  }
  doc.moveDown(0.25);
  doc.strokeColor(BORDER).lineWidth(1).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.4);
}

// Helper: Bullet point
function renderBullet(title, description) {
  const currentY = doc.y;
  doc.fillColor(SECONDARY).fontSize(9.5).font("Helvetica-Bold").text("• ", 50, currentY, { continued: true });
  doc.fillColor(DARK).font("Helvetica-Bold").text(title + ": ", { continued: true });
  doc.fillColor(MUTED).font("Helvetica").text(description, { lineGap: 1.8 });
  doc.moveDown(0.25);
}

// Diagram Helper: Entity Box (Rectangle with solid border)
function drawEntityBox(x, y, w, h, title, subtitle) {
  doc.roundedRect(x, y, w, h, 6).fillAndStroke(BOX_BG_ENTITY, BOX_BORDER_ENTITY);
  doc.fillColor(SECONDARY).fontSize(8.5).font("Helvetica-Bold").text(title, x + 4, y + 8, {
    width: w - 8,
    align: "center",
  });
  if (subtitle) {
    doc.fillColor(DARK).fontSize(7).font("Helvetica").text(subtitle, x + 4, y + 22, {
      width: w - 8,
      align: "center",
    });
  }
}

// Diagram Helper: Process Box (Rounded container with badge)
function drawProcessBox(x, y, w, h, id, title, subtitle) {
  doc.roundedRect(x, y, w, h, 8).fillAndStroke(BOX_BG_PROCESS, BOX_BORDER_PROCESS);
  
  // Badge
  doc.roundedRect(x + 6, y + 5, 26, 12, 3).fillAndStroke(PRIMARY, PRIMARY);
  doc.fillColor("#ffffff").fontSize(7).font("Helvetica-Bold").text(id, x + 6, y + 7, { width: 26, align: "center" });

  doc.fillColor(PRIMARY).fontSize(8).font("Helvetica-Bold").text(title, x + 36, y + 6, {
    width: w - 42,
    align: "left",
  });
  if (subtitle) {
    doc.fillColor(DARK).fontSize(6.8).font("Helvetica").text(subtitle, x + 8, y + 21, {
      width: w - 16,
      align: "center",
    });
  }
}

// Diagram Helper: Data Store (Open-ended or double-line container)
function drawDataStoreBox(x, y, w, h, id, title, subtitle) {
  doc.roundedRect(x, y, w, h, 5).fillAndStroke(BOX_BG_DATA, BOX_BORDER_DATA);
  
  // Left color bar
  doc.rect(x, y, 6, h).fill(BOX_BORDER_DATA);

  doc.fillColor("#92400e").fontSize(7.5).font("Helvetica-Bold").text(`[${id}] ${title}`, x + 10, y + 6, {
    width: w - 14,
    align: "left",
  });
  if (subtitle) {
    doc.fillColor(DARK).fontSize(6.8).font("Helvetica").text(subtitle, x + 10, y + 19, {
      width: w - 14,
      align: "left",
    });
  }
}

// -------------------------------------------------------------
// PAGE 1: COVER & OVERVIEW & ORIGINAL BUILDS
// -------------------------------------------------------------
doc.rect(45, 45, 505, 90).fillAndStroke(LIGHT_BG, BORDER);
doc.fillColor(PRIMARY).fontSize(19).font("Helvetica-Bold").text("SMOOTHIE SHOP E-COMMERCE", 60, 58);
doc.fillColor(DARK).fontSize(10.5).font("Helvetica").text("Complete Project Documentation, UML Diagrams & Technical Architecture", 60, 83);
doc.fillColor(MUTED).fontSize(8.5).font("Helvetica").text("Frontend by Muhammad Faizan Mustafa  |  Full-Stack, Security, & UML Upgrades", 60, 101);

doc.y = 148;

renderSectionHeader("1. Project Overview & System Scope", "Standalone Full-Stack Smoothie E-Commerce Application");

doc.fillColor(DARK).fontSize(9).font("Helvetica").text(
  "Smoothie Shop is a modern, standalone full-stack e-commerce web platform designed for browsing, customizing, ordering handcrafted fruit smoothies, and administering store inventory and customer orders in real time. The system unites a responsive React 19 client storefront with a robust Node.js/Express 5 backend, persistent MongoDB database, and an HMAC Bearer token authenticated management dashboard.",
  { lineGap: 2.5, align: "justify" }
);

renderSectionHeader("2. What You Built (Original Developer Architecture)", "Authored by Muhammad Faizan Mustafa");

doc.fillColor(PRIMARY).fontSize(10).font("Helvetica-Bold").text("A. Frontend React 19 SPA Architecture");
doc.moveDown(0.15);
renderBullet("Home Showcase (Home.jsx)", "Hero slideshow carousel featuring 4 rotating banner slides (Berry Bliss, Mango Glow, Strawberry Freshness, Tropical Energy) with manual navigation controls and a 4-column responsive product card grid.");
renderBullet("Product Details View (ProductDetails.jsx)", "Rich product view showing short taglines, nutritional descriptions, dynamic pricing, and sequential Previous/Next smoothie navigation.");
renderBullet("Shopping Cart Management (Cart.jsx)", "Full cart overview featuring product thumbnails, quantity increment/decrement controls, item removal, real-time subtotal calculations, and responsive layout.");
renderBullet("Validated Checkout Flow (Checkout.jsx)", "End-to-end checkout form built with React Hook Form and Zod schema validation ensuring valid credit card format (xxxx-xxxx-xxxx-xxxx), shipping addresses, and customer emails.");
renderBullet("Developer Biography (About.jsx)", "Portfolio section showcasing developer avatar, 'Behind the blend' bio, and an interactive contact inquiry form.");
renderBullet("Interactive Chatbot (ChatBot.jsx)", "Rule-based keyword matching customer service assistant with predefined answers for product flavors, shipping times, and ordering guidelines.");
renderBullet("404 Error Routing (Notfound.jsx)", "Clean fallback view handling unknown routes.");

doc.moveDown(0.3);
doc.fillColor(PRIMARY).fontSize(10).font("Helvetica-Bold").text("B. State Management & Authentication");
doc.moveDown(0.15);
renderBullet("CartContext (CartContext.jsx)", "Centralized React context provider supplying cart item state, live badge counter for the navbar, and quantity mutation actions.");
renderBullet("AuthProvider (AuthProvider.jsx)", "Client-side authentication provider handling session state and persistence in browser localStorage.");
renderBullet("LoginModal (LoginModal.jsx)", "Interactive modal dialog prompting customers to sign in before purchasing smoothies.");
renderBullet("Asset Library & Styling", "10 high-resolution smoothie image assets and modular CSS stylesheets.");

// -------------------------------------------------------------
// PAGE 2: WHAT WAS ADDED & UPGRADED
// -------------------------------------------------------------
doc.addPage();

renderSectionHeader("3. What Was Added & Upgraded", "Backend, Database Integration, Admin Console, and Device Upload");

doc.fillColor(SECONDARY).fontSize(10).font("Helvetica-Bold").text("A. Strict Code Preservation & Language Standard");
doc.moveDown(0.15);
renderBullet("Zero Destructive Changes", "100% of the original codebase, components, logic, and styling were strictly preserved without altering user-written workflows.");
renderBullet("100% Pure JavaScript", "All newly created files and backend modules were written in pure JavaScript (ES Modules, JSX, zero TypeScript).");
renderBullet("Clean Environment Routing", "Normalized Vite config and BrowserRouter by removing legacy GitHub Pages subpaths so the application serves natively at root.");

doc.moveDown(0.35);
doc.fillColor(SECONDARY).fontSize(10).font("Helvetica-Bold").text("B. Full-Stack Express Backend (server.js)");
doc.moveDown(0.15);
renderBullet("Unified Server Architecture", "Built an Express 5 server mounted with Vite development middleware on port 3000 (host 0.0.0.0).");
renderBullet("High-Capacity Body Parsers", "Configured 50MB payload limits for JSON and URL-encoded requests to support high-resolution local device photo uploads.");
renderBullet("Configuration Template (.env.example)", "Documented PORT and MONGODB_URI variables for simple environment bootstrapping.");

doc.moveDown(0.35);
doc.fillColor(SECONDARY).fontSize(10).font("Helvetica-Bold").text("C. MongoDB & Mongoose Database Integration");
doc.moveDown(0.15);
renderBullet("Mongoose Document Models", "Created schemas for Product (id, title, price, thumbnail, shortDescription, description, category, inStock, timestamps), Order (customer, items, totalAmount, status, timestamps), and Setting.");
renderBullet("Resilient Failover Architecture", "If MongoDB is connected, operations read/write to MongoDB. If offline or unconfigured, the server transparently operates in an in-memory & localStorage sync mode so the app never freezes or crashes.");
renderBullet("Automated Seeding", "Auto-populates MongoDB with the 10 initial smoothie products on first connection.");

doc.moveDown(0.35);
doc.fillColor(SECONDARY).fontSize(10).font("Helvetica-Bold").text("D. Complete RESTful API Endpoints (/api/*)");
doc.moveDown(0.15);
renderBullet("GET /api/products", "Publicly retrieves complete catalog of available smoothies.");
renderBullet("POST /api/products", "Protected admin route to create a new smoothie with validation, category, and pricing.");
renderBullet("PUT /api/products/:id", "Protected admin route to update pricing, descriptions, titles, and in-stock inventory.");
renderBullet("DELETE /api/products/:id", "Protected admin route to delete a smoothie from the product catalog.");
renderBullet("POST /api/products/reset", "Protected admin route for one-click restore of the original 10 smoothie catalog items.");
renderBullet("POST /api/orders", "Public customer route to place orders from the validated checkout form.");
renderBullet("GET /api/orders", "Protected admin route providing full real-time order history and shipping details.");
renderBullet("GET /api/health", "Live status probe reporting MongoDB connectivity and product counts.");

doc.moveDown(0.35);
doc.fillColor(SECONDARY).fontSize(10).font("Helvetica-Bold").text("E. Admin Management Console (/admin)");
doc.moveDown(0.15);
renderBullet("Product & Pricing Manager", "Live table editor to adjust smoothie prices, edit descriptions, toggle stock availability, or delete items.");
renderBullet("Customer Orders Hub", "Real-time dashboard displaying buyer shipping addresses, ordered items, and order revenue.");
renderBullet("Database Status Pill", "Visual indicator displaying MongoDB Connected vs. Store Mode.");

// -------------------------------------------------------------
// PAGE 3: DEPLOYMENT, SECURITY & DEVICE UPLOADS
// -------------------------------------------------------------
doc.addPage();

renderSectionHeader("4. Local Device Image Upload, Security & Vercel Config", "Production Hardening and Cloud Deployment");

doc.fillColor(PRIMARY).fontSize(10).font("Helvetica-Bold").text("A. Local Device Image Upload Engine");
doc.moveDown(0.15);
renderBullet("3 Image Sourcing Modes", "Allows store managers to pick from (1) Store Fruit Presets, (2) Local Device Upload, or (3) External Web Image URLs.");
renderBullet("Interactive File Dropzone", "Admins can browse or drag-and-drop photos directly from their phone, tablet, or laptop (PNG, JPG, WebP, SVG).");
renderBullet("Client-Side FileReader", "Converts device photos to Base64 data URLs client-side, showing instant image previews with file details and file-reselection controls.");
renderBullet("Full-Stack Persistence", "Data URLs are processed through the 50MB Express body parser and stored in MongoDB / localStorage for storefront rendering.");

doc.moveDown(0.35);
doc.fillColor(PRIMARY).fontSize(10).font("Helvetica-Bold").text("B. Vercel SPA Deployment & Environment Variables Guide");
doc.moveDown(0.15);
renderBullet("Problem Diagnosed", "When refreshing pages on Vercel or sending API requests on static hosting, Vercel returned 404 NOT_FOUND or routed POST /api/products to index.html (returning 405/empty body, causing 'Unexpected end of JSON input').");
renderBullet("vercel.json & api/index.js", "Configured Vercel rewrites to route /api/(.*) to the serverless Express backend in /api/index.js, while retaining SPA client routing for (.*) to /index.html.");
renderBullet("Environment Variables in Vercel", "When MONGODB_URI is added in Vercel, Vercel ONLY injects it into NEW deployments. You MUST trigger a 'Redeploy' from the Deployments tab for changes to take effect.");
renderBullet("Environments Scope Checklist", "Ensure MONGODB_URI is checked for both 'Production' and 'Preview' environments in Vercel so branch deployments receive the variable.");
renderBullet("MongoDB Atlas Whitelist", "Ensure Network Access in MongoDB Atlas has 0.0.0.0/0 enabled (allow access from anywhere) so Vercel's serverless IP addresses can connect.");
renderBullet("Client-Side Resilience", "Admin product addition and management safely checks response Content-Type and gracefully falls back to persistent localStorage so product additions never fail or crash on Vercel.");

doc.moveDown(0.35);
doc.fillColor(PRIMARY).fontSize(10).font("Helvetica-Bold").text("C. Store Owner Password Management");
doc.moveDown(0.15);
renderBullet("Owner Password Control", "The store owner can update their login password directly inside the Admin Console via the 'Change Password' modal.");
renderBullet("Persistent Verification", "Password changes are validated against the current password and saved both in local storage and MongoDB for full-stack persistence.");

doc.moveDown(0.35);
doc.fillColor(PRIMARY).fontSize(10).font("Helvetica-Bold").text("D. API Route Protection & Bearer Token Security");
doc.moveDown(0.15);
renderBullet("Route Authorization", "Sensitive endpoints (POST/PUT/DELETE products, GET orders, bulk sync, password reset) require a cryptographically signed HMAC Bearer token.");
renderBullet("Public vs. Protected Scope", "Customer storefront endpoints (GET /api/products, POST /api/orders, GET /api/health) remain public so shoppers can browse and order without authentication.");
renderBullet("401 Unauthorized Defense", "Unauthenticated API calls receive HTTP 401 Unauthorized, preventing malicious product deletion, customer data theft, or tampering.");

// -------------------------------------------------------------
// PAGE 4: UML LEVEL 0 SYSTEM CONTEXT DIAGRAM
// -------------------------------------------------------------
doc.addPage();

renderSectionHeader("5. UML Level 0 System Architecture (Context Diagram)", "High-Level System Boundary, External Entities & Data Flows");

doc.fillColor(DARK).fontSize(8.5).font("Helvetica").text(
  "The Level 0 UML System Context Diagram defines the macroscopic operational boundary of the Smoothie Shop E-Commerce platform. It illustrates how external entities (Customers, Store Administrators, MongoDB Atlas Cloud, and Client LocalStorage) interact directly with the central application system.",
  { lineGap: 2 }
);

doc.moveDown(0.4);

// DRAW LEVEL 0 DIAGRAM CANVAS
const l0Y = doc.y + 5;
doc.roundedRect(45, l0Y, 505, 235, 8).fillAndStroke("#faf8f5", BORDER);

// Center System Box
drawProcessBox(190, l0Y + 80, 215, 75, "0.0", "Smoothie Shop Core System", "React 19 SPA + Express 5 Serverless Engine\nState Management & Business Logic");

// Left Entity: Customer / Shopper
drawEntityBox(55, l0Y + 85, 105, 65, "Customer / Shopper", "Client Web Browser\n(Desktop & Mobile)");

// Right Entity: Store Owner / Admin
drawEntityBox(435, l0Y + 85, 105, 65, "Store Administrator", "Management Console\n(Authenticated Owner)");

// Bottom Left: MongoDB Atlas
drawDataStoreBox(80, l0Y + 180, 175, 42, "D1", "MongoDB Atlas Database", "Cloud NoSQL Collections (Products, Orders, Settings)");

// Bottom Right: Client LocalStorage
drawDataStoreBox(340, l0Y + 180, 175, 42, "D2", "Browser LocalStorage", "Cart State, Bearer Token, Offline Sync Queues");

// Draw Flow Lines
// 1. Customer -> System
doc.strokeColor(MUTED).lineWidth(1);
doc.moveTo(160, l0Y + 105).lineTo(190, l0Y + 105).stroke();
doc.fillColor(MUTED).fontSize(6.5).font("Helvetica-Bold").text("Browse / Order ➔", 145, l0Y + 95, { width: 60, align: "center" });

// Customer <- System
doc.moveTo(190, l0Y + 125).lineTo(160, l0Y + 125).stroke();
doc.fillColor(MUTED).fontSize(6.5).font("Helvetica").text("◀ Catalog / Status", 145, l0Y + 127, { width: 60, align: "center" });

// 2. Admin -> System
doc.moveTo(435, l0Y + 105).lineTo(405, l0Y + 105).stroke();
doc.fillColor(MUTED).fontSize(6.5).font("Helvetica-Bold").text("◀ Login / Mutations", 390, l0Y + 95, { width: 60, align: "center" });

// Admin <- System
doc.moveTo(405, l0Y + 125).lineTo(435, l0Y + 125).stroke();
doc.fillColor(MUTED).fontSize(6.5).font("Helvetica").text("Token / Orders ➔", 390, l0Y + 127, { width: 60, align: "center" });

// 3. System <-> MongoDB
doc.moveTo(240, l0Y + 155).lineTo(180, l0Y + 180).stroke();
doc.fillColor("#b45309").fontSize(6.5).font("Helvetica-Bold").text("Mongoose CRUD (SSL) ⬇", 150, l0Y + 162);

// 4. System <-> LocalStorage
doc.moveTo(350, l0Y + 155).lineTo(410, l0Y + 180).stroke();
doc.fillColor("#b45309").fontSize(6.5).font("Helvetica-Bold").text("⬇ Offline Queue & Cache", 345, l0Y + 162);

doc.y = l0Y + 250;

doc.fillColor(PRIMARY).fontSize(9.5).font("Helvetica-Bold").text("Level 0 System Flow Narrative:");
doc.moveDown(0.2);
renderBullet("Customer Inflow & Outflow", "Customers request catalog data, product ingredient breakdowns, and submit validated checkout orders. The system returns live smoothie models, badge counters, and order confirmations.");
renderBullet("Administrator Inflow & Outflow", "Admins transmit authentication credentials, product creations with Base64 photos, pricing modifications, and status changes. The system responds with signed HMAC Bearer tokens, live order feeds, and database metrics.");
renderBullet("Data Storage Interaction", "The central engine executes persistent reads and writes to MongoDB Atlas (D1) when online, and synchronizes with Browser LocalStorage (D2) for resilient caching and offline queue recovery.");

// -------------------------------------------------------------
// PAGE 5: UML LEVEL 1 SUBSYSTEM DECOMPOSITION DIAGRAM
// -------------------------------------------------------------
doc.addPage();

renderSectionHeader("6. UML Level 1 Subsystem Decomposition Diagram", "Detailed Functional Processes, Internal Component Interactions & Data Stores");

doc.fillColor(DARK).fontSize(8.5).font("Helvetica").text(
  "The Level 1 UML Diagram decomposes Process 0.0 into its six constituent subsystem components and two primary data repositories, detailing how data flows across validation, authentication, order intake, and offline synchronization.",
  { lineGap: 2 }
);

doc.moveDown(0.3);

// DRAW LEVEL 1 DIAGRAM CANVAS
const l1Y = doc.y + 5;
doc.roundedRect(45, l1Y, 505, 275, 8).fillAndStroke("#faf8f5", BORDER);

// Row 1 Processes
drawProcessBox(55, l1Y + 20, 140, 50, "1.0", "Catalog & Details Engine", "Product browsing, filtering,\npricing & nutrition views");
drawProcessBox(225, l1Y + 20, 145, 50, "3.0", "Security & Auth Guard", "HMAC token signing, login,\n& requireAdminAuth guard");
drawProcessBox(395, l1Y + 20, 145, 50, "4.0", "Admin Console Engine", "Product CRUD, 50MB uploads,\npricing & stock toggles");

// Row 2 Processes
drawProcessBox(55, l1Y + 105, 140, 50, "2.0", "Cart & Validated Checkout", "CartContext, React Hook Form\n& Zod schema validation");
drawProcessBox(225, l1Y + 105, 145, 50, "5.0", "Order Ingestion Engine", "Revenue calculation, order\ncreation, address tracking");
drawProcessBox(395, l1Y + 105, 145, 50, "6.0", "Offline Reconciliation", "Health monitoring & automatic\nlocal queue upsert to Mongo");

// Row 3 Data Stores
drawDataStoreBox(110, l1Y + 195, 185, 45, "D1", "MongoDB Atlas Cloud", "Collections: products, orders, settings\n(Mongoose ORM with SSL connection)");
drawDataStoreBox(325, l1Y + 195, 185, 45, "D2", "Browser LocalStorage", "Key stores: smoothie_orders_cache,\nsmoothie_offline_queues, auth_token");

// Draw Flow Lines Row 1 & 2
doc.strokeColor(MUTED).lineWidth(0.9);

// 1.0 -> 2.0 (Add to cart)
doc.moveTo(125, l1Y + 70).lineTo(125, l1Y + 105).stroke();
doc.fillColor(MUTED).fontSize(6.2).font("Helvetica").text("Add to Cart ⬇", 80, l1Y + 84);

// 2.0 -> 5.0 (Submit Order)
doc.moveTo(195, l1Y + 130).lineTo(225, l1Y + 130).stroke();
doc.fillColor(MUTED).fontSize(6.2).font("Helvetica").text("Order Data ➔", 188, l1Y + 120);

// 3.0 -> 4.0 (Auth Token)
doc.moveTo(370, l1Y + 45).lineTo(395, l1Y + 45).stroke();
doc.fillColor(MUTED).fontSize(6.2).font("Helvetica").text("Bearer Token ➔", 360, l1Y + 35);

// 4.0 -> 6.0 (Offline fallback queue)
doc.moveTo(465, l1Y + 70).lineTo(465, l1Y + 105).stroke();
doc.fillColor(MUTED).fontSize(6.2).font("Helvetica").text("Fallback Queue ⬇", 445, l1Y + 84);

// 5.0 -> D1 (Save Order)
doc.moveTo(280, l1Y + 155).lineTo(220, l1Y + 195).stroke();
doc.fillColor("#b45309").fontSize(6.2).font("Helvetica").text("Commit Order ⬇", 205, l1Y + 168);

// 5.0 -> D2 (Cache Order)
doc.moveTo(310, l1Y + 155).lineTo(360, l1Y + 195).stroke();
doc.fillColor("#b45309").fontSize(6.2).font("Helvetica").text("⬇ Local Cache", 325, l1Y + 168);

// 6.0 -> D1 (Sync Batch)
doc.moveTo(440, l1Y + 155).lineTo(280, l1Y + 205).stroke();
doc.fillColor("#b45309").fontSize(6.2).font("Helvetica-Bold").text("Sync Batch Upsert ➔ D1", 335, l1Y + 178);

// Legend box inside diagram
doc.rect(55, l1Y + 248, 485, 20).fillAndStroke("#ffffff", BORDER);
doc.fillColor(PRIMARY).fontSize(7).font("Helvetica-Bold").text("UML LEGEND: ", 65, l1Y + 254);
doc.fillColor(PRIMARY).font("Helvetica").text("Rounded Pink = Subsystem Process  |  ", 125, l1Y + 254);
doc.fillColor("#b45309").font("Helvetica").text("Amber Box = Data Store (D1, D2)  |  ", 260, l1Y + 254);
doc.fillColor(MUTED).font("Helvetica").text("Arrows = Unidirectional Data Pipeline", 400, l1Y + 254);

doc.y = l1Y + 290;

doc.fillColor(PRIMARY).fontSize(9.5).font("Helvetica-Bold").text("Level 1 Subsystem Descriptions:");
doc.moveDown(0.2);
renderBullet("Process 1.0 & 2.0 (Storefront & Checkout)", "Manages real-time catalog rendering, nutritional overlays, cart mutations, and strict Zod validation on shipping details and credit card numbers.");
renderBullet("Process 3.0 & 4.0 (Authentication & Management)", "Gatekeeps administrative capabilities with HMAC SHA-256 tokens and provides product CRUD, 50MB Base64 device upload parsing, and pricing management.");
renderBullet("Process 5.0 & 6.0 (Ingestion & Offline Sync)", "Ingests customer transactions, persists records to MongoDB Atlas (D1), caches to LocalStorage (D2), and triggers automatic batch synchronization upon network reconnect.");

// -------------------------------------------------------------
// PAGE 6: TECHNICAL SPECIFICATIONS & QUICK REFERENCE
// -------------------------------------------------------------
doc.addPage();

renderSectionHeader("7. Technical Architecture & Quick Reference", "Platform Matrix, Endpoints & Security Credentials");

const tableTop = doc.y + 5;
const col1 = 50;
const col2 = 180;
const col3 = 330;

// Header Row
doc.rect(45, tableTop, 505, 20).fillAndStroke(PRIMARY, PRIMARY);
doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold");
doc.text("LAYER / COMPONENT", col1, tableTop + 5);
doc.text("TECHNOLOGY STACK", col2, tableTop + 5);
doc.text("PURPOSE & ROLE", col3, tableTop + 5);

const rows = [
  ["Frontend Framework", "React 19 + React Router 7", "Client-side SPA UI rendering and routing"],
  ["Build Engine", "Vite 8", "Development server & production bundling"],
  ["Backend Server", "Node.js 22 + Express 5", "Unified REST API & static asset serving"],
  ["Database Layer", "MongoDB 6+ & Mongoose 9", "Document storage with in-memory failover"],
  ["Form Validation", "React Hook Form 7 + Zod 4", "Strict schema validation on checkout & forms"],
  ["Image Processing", "FileReader API + 50MB Buffer", "Local photo upload & Base64 encoding"],
  ["API Security", "HMAC-SHA256 Bearer Token", "Protects sensitive CRUD, sync, and orders routes"],
  ["Deployment Config", "vercel.json SPA Rewrites", "Prevents 404 errors on browser page refreshes"],
];

let rowY = tableTop + 20;
rows.forEach((row, i) => {
  const bg = i % 2 === 0 ? LIGHT_BG : "#ffffff";
  doc.rect(45, rowY, 505, 18).fillAndStroke(bg, BORDER);
  doc.fillColor(DARK).fontSize(8.5).font("Helvetica-Bold").text(row[0], col1, rowY + 4);
  doc.fillColor(DARK).font("Helvetica").text(row[1], col2, rowY + 4);
  doc.fillColor(MUTED).text(row[2], col3, rowY + 4);
  rowY += 18;
});

doc.y = rowY + 15;

// Quick Access Box
doc.rect(45, doc.y, 505, 55).fillAndStroke(LIGHT_BG, BORDER);
doc.fillColor(PRIMARY).fontSize(9.5).font("Helvetica-Bold").text("QUICK REFERENCE & CREDENTIALS", 55, doc.y + 8);
doc.fillColor(DARK).fontSize(8.5).font("Helvetica");
doc.text("• Admin URL: /admin   |   Storefront URL: /", 55, doc.y + 24);
doc.text("• Admin Credentials: Username: admin  |  Password: admin (Customizable by owner)", 55, doc.y + 36);

// -------------------------------------------------------------
// FOOTER ON ALL PAGES
// -------------------------------------------------------------
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc.fillColor(MUTED).fontSize(8).font("Helvetica").text(
    `Smoothie Shop Project Documentation  |  Page ${i + 1} of ${range.count}`,
    45,
    785,
    { align: "center", width: 505 }
  );
}

doc.end();

console.log("PDF generated successfully at:", outputPath1, "and", outputPath2);

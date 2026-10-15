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

// Helper: Section Header
function renderSectionHeader(title, subtitle) {
  doc.moveDown(0.7);
  doc.fillColor(PRIMARY).fontSize(14).font("Helvetica-Bold").text(title.toUpperCase(), { characterSpacing: 0.5 });
  if (subtitle) {
    doc.fillColor(MUTED).fontSize(9.5).font("Helvetica-Oblique").text(subtitle);
  }
  doc.moveDown(0.3);
  doc.strokeColor(BORDER).lineWidth(1).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);
}

// Helper: Bullet point
function renderBullet(title, description) {
  const currentY = doc.y;
  doc.fillColor(SECONDARY).fontSize(10).font("Helvetica-Bold").text("• ", 50, currentY, { continued: true });
  doc.fillColor(DARK).font("Helvetica-Bold").text(title + ": ", { continued: true });
  doc.fillColor(MUTED).font("Helvetica").text(description, { lineGap: 2 });
  doc.moveDown(0.3);
}

// -------------------------------------------------------------
// COVER / TITLE HEADER
// -------------------------------------------------------------
doc.rect(45, 45, 505, 95).fillAndStroke(LIGHT_BG, BORDER);
doc.fillColor(PRIMARY).fontSize(20).font("Helvetica-Bold").text("SMOOTHIE SHOP E-COMMERCE", 60, 60);
doc.fillColor(DARK).fontSize(11).font("Helvetica").text("Complete Project Documentation & Technical Architecture", 60, 86);
doc.fillColor(MUTED).fontSize(9).font("Helvetica").text("Original Frontend by Muhammad Faizan Mustafa  |  Full-Stack & Admin Upgrades", 60, 105);

doc.y = 155;

// -------------------------------------------------------------
// SECTION 1: PROJECT OVERVIEW
// -------------------------------------------------------------
renderSectionHeader("1. Project Overview & System Scope", "Independent Full-Stack Smoothie E-Commerce Application");

doc.fillColor(DARK).fontSize(9.5).font("Helvetica").text(
  "Smoothie Shop is a modern, standalone full-stack e-commerce web application designed for browsing, customizing, ordering handcrafted fresh fruit smoothies, and administering store inventory and customer orders in real time. The platform pairs a responsive React 19 client storefront with a robust Node.js/Express backend, persistent MongoDB database, and an authenticated management dashboard.",
  { lineGap: 3, align: "justify" }
);

// -------------------------------------------------------------
// SECTION 2: WHAT YOU BUILT (MUHAMMAD FAIZAN MUSTAFA)
// -------------------------------------------------------------
renderSectionHeader("2. What You Built (Original Developer Architecture)", "Authored by Muhammad Faizan Mustafa");

doc.fillColor(PRIMARY).fontSize(10.5).font("Helvetica-Bold").text("A. Frontend React 19 SPA Architecture");
doc.moveDown(0.2);

renderBullet("Home Showcase (Home.jsx)", "Hero slideshow carousel featuring 4 rotating banner slides (Berry Bliss, Mango Glow, Strawberry Freshness, Tropical Energy) with manual arrow and dot controls, accompanied by a 4-column responsive product card grid.");
renderBullet("Product Details View (ProductDetails.jsx)", "Rich product view showing short taglines, comprehensive nutritional descriptions, ingredient highlights, dynamic pricing, and sequential Previous/Next smoothie navigation.");
renderBullet("Shopping Cart Management (Cart.jsx)", "Full cart overview featuring product thumbnails, quantity increment/decrement controls, item removal, real-time subtotal calculations, and responsive layout.");
renderBullet("Validated Checkout Flow (Checkout.jsx)", "End-to-end checkout form built with React Hook Form and Zod schema validation ensuring valid credit card format (xxxx-xxxx-xxxx-xxxx), shipping addresses, and customer emails.");
renderBullet("Developer Biography (About.jsx)", "Portfolio section showcasing developer avatar, 'Behind the blend' bio, and an interactive contact inquiry form.");
renderBullet("Interactive Chatbot (ChatBot.jsx)", "Rule-based keyword matching customer service assistant with predefined answers for product flavors, shipping times, and ordering guidelines.");
renderBullet("404 Error Routing (Notfound.jsx)", "Clean fallback view handling unknown routes.");

doc.moveDown(0.4);
doc.fillColor(PRIMARY).fontSize(10.5).font("Helvetica-Bold").text("B. State Management & Authentication");
doc.moveDown(0.2);

renderBullet("CartContext (CartContext.jsx)", "Centralized React context provider supplying cart item state, live badge counter for the navbar, and quantity mutation actions.");
renderBullet("AuthProvider (AuthProvider.jsx)", "Client-side authentication provider handling session state and persistence in browser localStorage.");
renderBullet("LoginModal (LoginModal.jsx)", "Interactive modal dialog prompting customers to sign in before purchasing smoothies.");
renderBullet("Asset Library & Styling", "10 high-resolution smoothie image assets (Berry, Mango, Tropical, Strawberry, Banana, Pineapple, Peach, Green, Chocolate, Apple) and modular CSS stylesheets.");

// -------------------------------------------------------------
// SECTION 3: WHAT WAS ADDED & UPGRADED
// -------------------------------------------------------------
doc.addPage();

renderSectionHeader("3. What Was Added & Upgraded", "Backend, Database Integration, Admin Console, and Device Upload");

doc.fillColor(SECONDARY).fontSize(10.5).font("Helvetica-Bold").text("A. Strict Code Preservation & Language Standard");
doc.moveDown(0.2);
renderBullet("Zero Destructive Changes", "100% of the original codebase, components, logic, and styling were strictly preserved without altering user-written workflows.");
renderBullet("100% Pure JavaScript", "All newly created files and backend modules were written in pure JavaScript (ES Modules, JSX, zero TypeScript).");
renderBullet("Clean Environment Routing", "Normalized Vite config and BrowserRouter by removing legacy GitHub Pages subpaths (/Smothie-SHop/) so the application serves natively at root.");

doc.moveDown(0.4);
doc.fillColor(SECONDARY).fontSize(10.5).font("Helvetica-Bold").text("B. Full-Stack Express Backend (server.js)");
doc.moveDown(0.2);
renderBullet("Unified Server Architecture", "Built an Express 5 server mounted with Vite development middleware (app.use(vite.middlewares)) on port 3000 (host 0.0.0.0).");
renderBullet("High-Capacity Body Parsers", "Configured 50MB payload limits for JSON and URL-encoded requests to support high-resolution local device photo uploads.");
renderBullet("Configuration Template (.env.example)", "Documented PORT and MONGODB_URI variables for simple environment bootstrapping.");

doc.moveDown(0.4);
doc.fillColor(SECONDARY).fontSize(10.5).font("Helvetica-Bold").text("C. MongoDB & Mongoose Database Integration");
doc.moveDown(0.2);
renderBullet("Mongoose Document Models", "Created schemas for Product (id, title, price, thumbnail, shortDescription, description, category, inStock, timestamps) and Order (customer, items, totalAmount, status, timestamps).");
renderBullet("Resilient Failover Architecture", "If MongoDB is connected, operations read/write to MongoDB. If offline or unconfigured, the server transparently operates in an in-memory & localStorage sync mode so the app never freezes or crashes.");
renderBullet("Automated Seeding", "Auto-populates MongoDB with the 10 initial smoothie products on first connection.");

doc.moveDown(0.4);
doc.fillColor(SECONDARY).fontSize(10.5).font("Helvetica-Bold").text("D. Complete RESTful API Endpoints (/api/*)");
doc.moveDown(0.2);
renderBullet("GET /api/products", "Retrieves complete catalog of available smoothies.");
renderBullet("POST /api/products", "Creates a new smoothie product with validation, category, and pricing.");
renderBullet("PUT /api/products/:id", "Updates pricing, descriptions, titles, and in-stock inventory status.");
renderBullet("DELETE /api/products/:id", "Deletes a smoothie from the product catalog.");
renderBullet("POST /api/products/reset", "One-click restore of the original 10 smoothie catalog items.");
renderBullet("GET & POST /api/orders", "Receives checkout orders and supplies real-time order history.");
renderBullet("GET /api/health", "Live status probe reporting MongoDB connectivity and product counts.");

doc.moveDown(0.4);
doc.fillColor(SECONDARY).fontSize(10.5).font("Helvetica-Bold").text("E. Admin Management Console (/admin)");
doc.moveDown(0.2);
renderBullet("Protected Access", "Gated using the existing AuthProvider with fixed admin credentials.");
renderBullet("Product & Pricing Manager", "Live table editor to adjust smoothie prices, edit descriptions, toggle stock availability, or delete items.");
renderBullet("Customer Orders Hub", "Real-time dashboard displaying buyer shipping addresses, ordered items, and order revenue.");
renderBullet("Database Status Pill", "Visual indicator displaying MongoDB Connected vs. Store Mode.");

// -------------------------------------------------------------
// SECTION 4: LOCAL DEVICE IMAGE UPLOAD & HOSTING
// -------------------------------------------------------------
doc.addPage();

renderSectionHeader("4. Local Device Image Upload & Deployment Configuration", "Media Processing and Hosting Fixes");

doc.fillColor(PRIMARY).fontSize(10.5).font("Helvetica-Bold").text("A. Local Device Image Upload Engine");
doc.moveDown(0.2);
renderBullet("3 Image Sourcing Modes", "Allows store managers to pick from (1) Store Fruit Presets, (2) Local Device Upload, or (3) External Web Image URLs.");
renderBullet("Interactive File Dropzone", "Admins can browse or drag-and-drop photos directly from their phone, tablet, or laptop (PNG, JPG, WebP, SVG).");
renderBullet("Client-Side FileReader", "Converts device photos to Base64 data URLs client-side, showing instant image previews with file details and file-reselection controls.");
renderBullet("Full-Stack Persistence", "Data URLs are processed through the 50MB Express body parser and stored in MongoDB / localStorage for storefront rendering.");

doc.moveDown(0.4);
doc.fillColor(PRIMARY).fontSize(10.5).font("Helvetica-Bold").text("B. Vercel SPA Deployment & 404 Refresh Fix (vercel.json)");
doc.moveDown(0.2);
renderBullet("Problem Diagnosed", "When refreshing pages on Vercel or sending API requests on static hosting, Vercel either returned 404 NOT_FOUND or routed POST /api/products to index.html (returning 405/empty body, causing 'Unexpected end of JSON input').");
renderBullet("vercel.json & api/index.js", "Configured Vercel rewrites to route /api/(.*) to the serverless Express backend in /api/index.js, while retaining SPA client routing for (.*) to /index.html.");
renderBullet("Client-Side Resilience", "Admin product addition and management now safely checks response Content-Type and gracefully falls back to persistent localStorage so product additions never fail or crash on Vercel.");

doc.moveDown(0.4);
doc.fillColor(PRIMARY).fontSize(10.5).font("Helvetica-Bold").text("C. Store Owner Password Management");
doc.moveDown(0.2);
renderBullet("Owner Password Control", "The store owner can update their login password directly inside the Admin Console via the 'Change Password' modal.");
renderBullet("Persistent Verification", "Password changes are validated against the current password and saved both in local storage and MongoDB for full-stack persistence.");

// -------------------------------------------------------------
// SECTION 5: TECHNICAL SPECIFICATIONS TABLE
// -------------------------------------------------------------
renderSectionHeader("5. Technical Architecture & Quick Reference", "Platform Matrix and Endpoints");

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

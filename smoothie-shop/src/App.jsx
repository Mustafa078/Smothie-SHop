import Cart from "./pages/Cart/Cart.jsx";
import Home from "./pages/Home/Home.jsx";
import ProductDetails from "./pages/ProductDetails/ProductDetails.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Navbar from "./components/navbar/navbar.jsx";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import NotFound from "./pages/Not-found/Notfound.jsx";
import ChatBot from "./components/chatBot/Chatbot.jsx";
import Footer from "./components/footer/footer.jsx";
import About from "./pages/About/About.jsx";
import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar></Navbar>
        <ChatBot></ChatBot>
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/cart" element={<Cart />}></Route>
            <Route
              path="/productDetail/:id"
              element={<ProductDetails />}
            ></Route>
            <Route path="/checkout" element={<Checkout />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </main>
        <Footer></Footer>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products'; // Add this import
import ProductDetail from './pages/ProductDetail';
import Drops from './pages/Drops';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';
import ScrollToTop from './services/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CartProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/drops" element={<Drops />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
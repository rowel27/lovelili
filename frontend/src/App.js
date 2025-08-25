import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products'; // Add this import
import ProductDetail from './pages/ProductDetail';
import DropPage from './pages/DropPage';
import ProductFeed from './pages/ProductFeed';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';
import ScrollToTop from './services/ScrollToTop';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';


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
              <Route path="/cart" element={<CartPage />} />
              <Route path="/drops" element={<DropPage />} />
              <Route path="/drops/:dropId" element={<DropPage />} />
              <Route path="/products/all" element={<ProductFeed />} />
              <Route path="/products/drop/:dropId" element={<ProductFeed/>} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/cancel" element={<CancelPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
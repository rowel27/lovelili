import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Drops from './pages/Drops';
import PreviousDrops from './pages/PreviousDrops';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/drops" element={<Drops />} />
            <Route path="/previous-drops" element={<PreviousDrops />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { AuthProvider } from './context/AuthProvider';
import Order from './pages/Orders';
import Products from './pages/Products';
import './App.css';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import ProductDetail from './pages/ProductDetail';
import Category from './pages/Category';
import Login from './pages/Login';
import Register from './pages/SignUp';
import CartPage from './pages/CartPage';
import PrivateRoute from './routes/PrivateRoute';
import Checkout from './pages/Checkout';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import ErrorPage from './pages/ErorePgage';
import UserPage from './pages/UseraPage';
import PrivateRouteAdmin from './routes/PrivateRouteAdmin';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRouteAdmin>
                <div className="zoom-75">
                  <Sidebar />
                  <div className="admin-content">
                    <Routes>
                      <Route path="" element={<Dashboard />} />
                      <Route path="products" element={<Products />} />
                      <Route path="orders" element={<Order />} />
                    </Routes>
                  </div>
                </div>
              </PrivateRouteAdmin>
            }
          />

          {/* Public routes */}
          <Route
            path="/"
            element={
              <div className="zoom-75">
                <Navbar />
                <HomePage />
              </div>
            }
          />

          {/* Product detail using SEO-friendly slug */}
          <Route
            path="/product/:id"
            element={
              <div className="zoom-75">
                <Navbar />
                <ProductDetail />
              </div>
            }
          />

          {/* Category page */}
          <Route
            path="/category/:category"
            element={
              <div className="zoom-75">
                <Navbar />
                <Category />
              </div>
            }
          />

          {/* Search page */}
          <Route
            path="/search/:search"
            element={
              <div className="zoom-75">
                <Navbar />
                <Search />
              </div>
            }
          />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Cart & checkout */}
          <Route
            path="/cart"
            element={
              <div className="zoom-75">
                <Navbar />
                <CartPage />
              </div>
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />

          {/* User dashboard */}
          <Route
            path="/user"
            element={
              <PrivateRoute>
                <UserPage />
              </PrivateRoute>
            }
          />

          {/* Error / 404 page */}
          <Route
            path="*"
            element={
              <div className="zoom-75" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <Navbar />
                <ErrorPage />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

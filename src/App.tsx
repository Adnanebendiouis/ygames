import { BrowserRouter as Router, Routes, Route, Suspense, lazy } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { AuthProvider } from './context/AuthProvider';
import './App.css';
import Navbar from './components/Navbar';
import PrivateRoute from './routes/PrivateRoute';
import PrivateRouteAdmin from './routes/PrivateRouteAdmin';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from "react-hot-toast";

const HomePage     = lazy(() => import('./pages/HomePage'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Category     = lazy(() => import('./pages/Category'));
const Login        = lazy(() => import('./pages/Login'));
const Register     = lazy(() => import('./pages/SignUp'));
const CartPage     = lazy(() => import('./pages/CartPage'));
const Checkout     = lazy(() => import('./pages/Checkout'));
const Search       = lazy(() => import('./pages/Search'));
const Dashboard    = lazy(() => import('./pages/Dashboard'));
const ErrorPage    = lazy(() => import('./pages/ErorePgage'));
const UserPage     = lazy(() => import('./pages/UseraPage'));
const Products     = lazy(() => import('./pages/Products'));
const Order        = lazy(() => import('./pages/Orders'));
const Carousel     = lazy(() => import('./pages/carousel'));


function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div></div>}>
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
                      <Route path="carousel" element={<Carousel />} />
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
        </Suspense>
      </Router>
      
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

// // AdminPanel.tsx
// import { useEffect, useState, useRef, Fragment, useContext } from "react";
// import { Link, useLocation, useNavigate, Routes, Route } from "react-router-dom";
// import { API_BASE_URL } from "../constants/baseUrl";
// import "../styles/AdminPanel.css";
// import { fetchWithCSRF, refreshCSRFToken } from "../utils/csrf";
// import { AuthContext } from "../context/auth-context";
// import {
//   FaUsers,
//   FaBox,
//   FaMoneyBillWave,
//   FaShoppingCart,
//   FaTrashAlt,
//   FaEllipsisV,
// } from "react-icons/fa";
// import {
//   MdDashboard,
//   MdShoppingCart,
//   MdLogout,
//   MdProductionQuantityLimits,
//   MdArrowBack,
//   MdMenu,
//   MdClose,
// } from "react-icons/md";
// import ygames from "../images/Y game LOGO 2[1].pdf (60 x 60 px).svg";

// // ================== Sidebar ==================
// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { logout } = useContext(AuthContext);
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   const isActive = (path: string) => {
//     if (path === "/admin") return location.pathname === path ? "active-link" : "";
//     return location.pathname.startsWith(path) ? "active-link" : "";
//   };

//   return (
//     <>
//       <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
//         {isOpen ? <MdClose /> : <MdMenu />}
//       </button>

//       <div className={`sidebar ${isOpen ? "open" : ""}`}>
//         <button className="back-button" onClick={() => navigate("/")}>
//           <MdArrowBack />
//         </button>

//         <div className="profile-section">
//           <div className="profile-img">
//             <img src={ygames} alt="YGAMES Logo" />
//           </div>
//           <p className="profile-name">YGAMES</p>
//           <p className="profile-email">admin</p>
//         </div>

//         <nav onClick={() => setIsOpen(false)}>
//           <Link to="/admin" className={isActive("/admin")}>
//             <MdDashboard /> Dashboard
//           </Link>
//           <Link to="/admin/products" className={isActive("/admin/products")}>
//             <MdProductionQuantityLimits /> Produits
//           </Link>
//           <Link to="/admin/orders" className={isActive("/admin/orders")}>
//             <MdShoppingCart /> Commandes
//           </Link>
//           <Link to="/" onClick={handleLogout} className={`logout-button ${isActive("/logout")}`}>
//             <MdLogout /> Déconnexion
//           </Link>
//         </nav>
//       </div>
//     </>
//   );
// };

// // ================== Dashboard ==================
// const Dashboard = () => {
//   const [userCount, setUserCount] = useState<number | null>(null);
//   const [orderCount, setOrderCount] = useState<number | null>(null);
//   const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
//   const [totalProducts, setTotalProducts] = useState<number | null>(null);
//   const [ordersSummary, setOrdersSummary] = useState<any[]>([]);
//   const [homeProducts, setHomeProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const [userRes, orderRes, revenueRes, productsRes, summaryRes, homeRes] =
//           await Promise.all([
//             fetchWithCSRF(`${API_BASE_URL}/api/user-count/`),
//             fetchWithCSRF(`${API_BASE_URL}/api/order-count/`),
//             fetchWithCSRF(`${API_BASE_URL}/api/total-revenue/`),
//             fetchWithCSRF(`${API_BASE_URL}/api/products-total/`),
//             fetchWithCSRF(`${API_BASE_URL}/api/orders-summary/`),
//             fetchWithCSRF(`${API_BASE_URL}/api/home/`),
//           ]);

//         const userData = await userRes.json();
//         const orderData = await orderRes.json();
//         const revenueData = await revenueRes.json();
//         const productsData = await productsRes.json();
//         const summaryData = await summaryRes.json();
//         const homeData = await homeRes.json();

//         setUserCount(userData.user_count);
//         setOrderCount(orderData.order_count);
//         setTotalRevenue(revenueData.total_revenue);
//         setTotalProducts(productsData.total_products);
//         setOrdersSummary(summaryData);
//         setHomeProducts(homeData);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       <div className="stats-grid">
//         <div className="stat-card">
//           <FaUsers />
//           <h3>Utilisateurs</h3>
//           <p>{userCount}</p>
//         </div>
//         <div className="stat-card">
//           <FaShoppingCart />
//           <h3>Commandes</h3>
//           <p>{orderCount}</p>
//         </div>
//         <div className="stat-card">
//           <FaMoneyBillWave />
//           <h3>Revenu</h3>
//           <p>{totalRevenue?.toLocaleString()} DA</p>
//         </div>
//         <div className="stat-card">
//           <FaBox />
//           <h3>Produits</h3>
//           <p>{totalProducts}</p>
//         </div>
//       </div>

//       <div className="sections-grid">
//         <div className="section-box">
//           <h2>Historique des Commandes</h2>
//           <div className="scrollable-section">
//             <table className="order-table">
//               <thead>
//                 <tr>
//                   <th>ID de Commande</th>
//                   <th>Client</th>
//                   <th>Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {ordersSummary.map((order) => (
//                   <tr key={order.order_id}>
//                     <td>{order.order_id}</td>
//                     <td>{order.client_name}</td>
//                     <td>{order.total?.toLocaleString()} DA</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="section-box">
//           <h2>Top Products</h2>
//           <div className="scrollable-section top-products">
//             {homeProducts.map((product) => (
//               <div key={product.id} className="product-card">
//                 <img src={product.image} alt={product.name} />
//                 <div className="product-info">
//                   <h4>{product.name}</h4>
//                   <small>ACTION</small>
//                   <p>{product.price?.toLocaleString()} DA</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ================== OrderHistory ==================
// const OrderHistory = () => {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
//   const [filterStatuses, setFilterStatuses] = useState<string[]>([]);

//   const statusOptions = [
//     { value: "en cours", label: "En cours" },
//     { value: "livre", label: "Livré" },
//     { value: "recu", label: "Reçu" },
//     { value: "annule", label: "Annulé" },
//   ];

//   useEffect(() => {
//     fetchWithCSRF(`${API_BASE_URL}/api/orders/`)
//       .then((res) => res.json())
//       .then((data) => setOrders(data))
//       .catch((err) => console.error("Error:", err));
//   }, []);

//   const handleStatusChange = async (order: any, newStatus: string) => {
//     try {
//       const res = await fetchWithCSRF(`${API_BASE_URL}/api/orders/${order.id}/`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });
//       if (!res.ok) throw new Error("Failed to update order");
//       setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)));
//       setDropdownOpenId(null);
//     } catch (err) {
//       console.error("Update failed:", err);
//     }
//   };

//   const deleteOrder = async (order: any) => {
//     try {
//       const res = await fetchWithCSRF(`${API_BASE_URL}/api/orders/${order.id}/`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Failed to delete order");
//       setOrders((prev) => prev.filter((o) => o.id !== order.id));
//     } catch (err) {
//       console.error("Delete failed:", err);
//     }
//   };

//   const toggleFilter = (status: string) => {
//     setFilterStatuses((prev) =>
//       prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
//     );
//   };

//   const filteredOrders =
//     filterStatuses.length === 0 ? orders : orders.filter((o) => filterStatuses.includes(o.status));

//   return (
//     <div className="order-history-container">
//       <h2>Historique des commandes</h2>

//       <div className="filter-bar">
//         <span style={{ fontWeight: "bold" }}>Filtrer par statut:</span>
//         <div className="filter-options">
//           {statusOptions.map((status) => (
//             <label key={status.value}>
//               <input
//                 type="checkbox"
//                 checked={filterStatuses.includes(status.value)}
//                 onChange={() => toggleFilter(status.value)}
//               />
//               {status.label}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="table-wrapper1">
//         <table className="order-table1">
//           <thead>
//             <tr>
//               <th>Client</th>
//               <th>Total (DA)</th>
//               <th>Status</th>
//               <th>ID</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredOrders.map((order) => (
//               <Fragment key={order.id}>
//                 <tr>
//                   <td data-label="Client">{order.full_name || order.client_name}</td>
//                   <td data-label="Total">{Number(order.total).toLocaleString()} DA</td>
//                   <td data-label="Status" className={`status ${order.status.toLowerCase().replace(" ", "-")}`}>
//                     {statusOptions.find((s) => s.value === order.status)?.label || order.status}
//                   </td>
//                   <td data-label="ID">{order.id}</td>
//                   <td data-label="Actions" className="actions">
//                     <div className="dropdown">
//                       <FaEllipsisV
//                         className="icon"
//                         onClick={() =>
//                           setDropdownOpenId(dropdownOpenId === order.id ? null : order.id)
//                         }
//                       />
//                       {dropdownOpenId === order.id && (
//                         <div className="status-dropdown">
//                           {statusOptions.map((option) => (
//                             <div
//                               key={option.value}
//                               onClick={() => handleStatusChange(order, option.value)}
//                               className="dropdown-item"
//                             >
//                               {option.label}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                     <FaTrashAlt className="icon delete" onClick={() => deleteOrder(order)} />
//                   </td>
//                 </tr>
//               </Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // ================== ProductPage ==================
// const ProductPage = () => {
//   const [products, setProducts] = useState<any[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   const nameRef = useRef<HTMLInputElement>(null);
//   const priceRef = useRef<HTMLInputElement>(null);
//   const stockRef = useRef<HTMLInputElement>(null);
//   const descRef = useRef<HTMLTextAreaElement>(null);
//   const etatRef = useRef<HTMLSelectElement>(null);
//   const noteRef = useRef<HTMLInputElement>(null);
//   const imageRef = useRef<HTMLInputElement>(null);
//   const categoryRef = useRef<HTMLSelectElement>(null);

//   const [editingProduct, setEditingProduct] = useState<any | null>(null);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);

//   const PRODUCT_API = `${API_BASE_URL}/api/products/`;

//   const loadProducts = async () => {
//     try {
//       const res = await fetch(PRODUCT_API, { credentials: "include" });
//       const data = await res.json();
//       const result = Array.isArray(data) ? data : data.results || [];
//       setProducts(result);
//       setFilteredProducts(result);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => { loadProducts(); }, []);

//   const populateForm = (product: any) => {
//     setEditingProduct(product);
//     setPreviewImage(product.image || null);
//     setTimeout(() => {
//       if (nameRef.current) nameRef.current.value = product.name;
//       if (priceRef.current) priceRef.current.value = String(product.price);
//       if (stockRef.current) stockRef.current.value = String(product.stock);
//       if (descRef.current) descRef.current.value = product.description;
//       if (etatRef.current) etatRef.current.value = product.etat.toLowerCase();
//       if (noteRef.current) noteRef.current.value = String(product.note);
//       if (categoryRef.current) categoryRef.current.value = product.categorie?.path || "";
//     }, 50);
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this product?")) return;
//     const csrfToken = await refreshCSRFToken();
//     const res = await fetch(PRODUCT_API + id + "/", {
//       method: "DELETE",
//       credentials: "include",
//       headers: { "X-CSRFToken": csrfToken || "" },
//     });
//     if (res.ok) loadProducts();
//     else alert("Failed to delete product");
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     setFilteredProducts(products.filter((p) =>
//       p.name.toLowerCase().includes(value.toLowerCase())
//     ));
//   };

//   return (
//     <div className="product-page">
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={searchTerm}
//           onChange={handleSearchChange}
//         />
//       </div>

//       <div className="products-grid">
//         {filteredProducts.map((product) => (
//           <div key={product.id} className="product-card">
//             <img src={product.image || "/placeholder.png"} alt={product.name} />
//             <h4>{product.name}</h4>
//             <p>{product.price?.toLocaleString()} DA</p>
//             <div className="actions">
//               <button onClick={() => populateForm(product)}>Edit</button>
//               <button onClick={() => handleDelete(product.id)}>Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // ================== AdminPanel ==================
// const AdminPanel = () => {
//   return (
//     <div className="admin-layout">
//       <Sidebar />
//       <div className="main-content">
//         <Routes>
//           <Route path="" element={<Dashboard />} />
//           <Route path="products" element={<ProductPage />} />
//           <Route path="orders" element={<OrderHistory />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;

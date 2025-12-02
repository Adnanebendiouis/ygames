// Dashboard.tsx
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../constants/baseUrl";
import { fetchWithCSRF } from "../utils/csrf";
import "../styles/dashboard.css";
import { FaUsers, FaBox, FaMoneyBillWave, FaShoppingCart } from "react-icons/fa";

interface OrderSummary {
  order_id: string;
  client_name: string;
  total: number;
  status: string;
}

// ----------------- Module-level cache -----------------
let dashboardCache: {
  userCount?: number;
  orderCount?: number;
  totalRevenue?: number;
  totalProducts?: number;
  ordersSummary?: OrderSummary[];
} = {};

const Dashboard = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [ordersSummary, setOrdersSummary] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        // If cache exists, use it first
        if (dashboardCache.userCount !== undefined) {
          setUserCount(dashboardCache.userCount);
          setOrderCount(dashboardCache.orderCount ?? null);
          setTotalRevenue(dashboardCache.totalRevenue ?? null);
          setTotalProducts(dashboardCache.totalProducts ?? null);
          setOrdersSummary(dashboardCache.ordersSummary ?? []);
          setLoading(false); // stop loading while we show cached data
        }

        // Fetch fresh data regardless of cache
        const [
          userRes,
          orderRes,
          revenueRes,
          productsRes,
          summaryRes,
        ] = await Promise.all([
          fetchWithCSRF(`${API_BASE_URL}/api/user-count/`),
          fetchWithCSRF(`${API_BASE_URL}/api/order-count/`),
          fetchWithCSRF(`${API_BASE_URL}/api/total-revenue/`),
          fetchWithCSRF(`${API_BASE_URL}/api/products-total/`),
          fetchWithCSRF(`${API_BASE_URL}/api/orders-summary/`),
        ]);

        const userData = await userRes.json();
        const orderData = await orderRes.json();
        const revenueData = await revenueRes.json();
        const productsData = await productsRes.json();
        const summaryData = await summaryRes.json();

        setUserCount(userData.user_count);
        setOrderCount(orderData.order_count);
        setTotalRevenue(revenueData.total_revenue);
        setTotalProducts(productsData.total_products);
        setOrdersSummary(summaryData);

        // Update cache
        dashboardCache = {
          userCount: userData.user_count,
          orderCount: orderData.order_count,
          totalRevenue: revenueData.total_revenue,
          totalProducts: productsData.total_products,
          ordersSummary: summaryData,
        };
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* TOP STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <FaUsers />
          <h3>Utilisateurs</h3>
          <p>{userCount ?? 0}</p>
        </div>
        <div className="stat-card">
          <FaShoppingCart />
          <h3>Commandes</h3>
          <p>{orderCount ?? 0}</p>
        </div>
        <div className="stat-card">
          <FaMoneyBillWave />
          <h3>Revenu</h3>
          <p>{totalRevenue ?? 0} DA</p>
        </div>
        <div className="stat-card">
          <FaBox />
          <h3>Produits</h3>
          <p>{totalProducts ?? 0}</p>
        </div>
      </div>

      {/* ORDER HISTORY */}
      <div className="sections-grid">
        <div className="section-box">
          <h2>Historique des Commandes</h2>
          <div className="scrollable-section">
            <table className="order-table">
              <thead>
                <tr>
                  <th>ID de Commande</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ordersSummary.length > 0 ? (
                  ordersSummary.map((order) => (
                    <tr key={order.order_id}>
                      <td data-label="ID de Commande">{order.order_id}</td>
                      <td data-label="Client">{order.client_name}</td>
                      <td data-label="Total">{order.total} DA</td>
                      <td data-label="Status">
                        <span
                          className={`status-badge ${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                      Aucune commande disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

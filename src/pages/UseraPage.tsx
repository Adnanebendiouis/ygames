import { useState, useEffect, useContext } from "react";
import "../styles/UserPage.css";
import { fetchWithCSRF } from "../utils/csrf";
import { API_BASE_URL } from "../constants/baseUrl";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

interface IUserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface IOrder {
  id: string;
  client: string;
  date_commande: string;
  total: string;
  status: string;
  full_name: string;
  phone: string;
  wilaya: string;
  type: string;
  commune: string;
  adresse: string;
  items: {
    produit_id: number;
    quantity: number;
    produit: { name: string };
    prix_unit: number;
  }[];
}

export default function UserPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithCSRF(`${API_BASE_URL}/api/current_user/`);
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || "Impossible de charger le profil utilisateur.");
        }

        const ordersResponse = await fetchWithCSRF(`${API_BASE_URL}/api/client/orders/`);
        if (!ordersResponse.ok) {
          const errData = await ordersResponse.json().catch(() => ({}));
          throw new Error(errData.detail || "Impossible de charger les commandes.");
        }

        const userData = await response.json();
        const ordersData = await ordersResponse.json();

        setUser(userData);
        setOrders(ordersData);
      } catch (err: any) {
        console.error("Erreur:", err);
        setError(err.message || "Une erreur est survenue.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="user-page">
      {/* Mobile menu button */}
      <button
        className="menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <button className="back-button" onClick={() => navigate("/")}>
          <MdArrowBack />
        </button>
        <h2 className="sidebar-title">Compte</h2>
        <nav>
          <ul>
            <li
              onClick={() => {
                setActiveTab("profile");
                setSidebarOpen(false);
              }}
            >
              Informations du profil
            </li>
            <li
              onClick={() => {
                setActiveTab("orders");
                setSidebarOpen(false);
              }}
            >
              Historique des commandes
            </li>
            <li
              onClick={() => {
                setActiveTab("password");
                setSidebarOpen(false);
              }}
            >
              Changer le mot de passe
            </li>
            <li
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
            >
              Se déconnecter
            </li>
          </ul>
        </nav>
      </aside>

      <section className="main-content">
        {error ? (
          <div className="error-message">{error}</div>
        ) : activeTab === "profile" ? (
          <ProfileInfo user={user} />
        ) : activeTab === "orders" ? (
          <OrderHistory orders={orders} />
        ) : activeTab === "password" ? (
          <ChangePassword />
        ) : null}
      </section>
    </div>
  );
}

function ProfileInfo({ user }: { user: IUserProfile | null }) {
  const full_name = user ? `${user.first_name} ${user.last_name}`.trim() : "N/A";

  return (
    <div className="form">
      <h2>Informations du profil</h2>
      <label>
        Nom d'utilisateur:
        <div className="name">{user?.username || "N/A"}</div>
      </label>
      <label>
        Email:
        <div className="name">{user?.email || "N/A"}</div>
      </label>
      <label>
        Nom complet:
        <div className="name">{full_name || "N/A"}</div>
      </label>
    </div>
  );
}

function OrderHistory({ orders }: { orders: IOrder[] }) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (orders.length === 0) {
    return <p>Aucune commande trouvée.</p>;
  }

  return (
    <div className="table-wrapper1">
      <table className="order-table1">
        <thead>
          <tr>
            <th>Client</th>
            <th>Téléphone</th>
            <th>Total (DA)</th>
            <th>Status</th>
            <th>Type</th>
            <th>Wilaya</th>
            <th>Articles</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.full_name}</td>
              <td>{order.phone}</td>
              <td>{Number(order.total).toLocaleString()} DA</td>
              <td>{order.status}</td>
              <td>{order.type}</td>
              <td>{order.wilaya}</td>
              <td>
                {expandedOrderId === order.id ? (
                  <div className="expanded-order">
                    <ul className="item-list">
                      {order.items.map((item, index) => (
                        <li key={index} className="item">
                          <div className="item-info">
                            <span className="item-name">
                              Produit: {item.produit.name}
                            </span>
                            <span className="item-quantity">
                              Quantité: {item.quantity}
                            </span>
                            <span className="item-price">
                              Prix: {Number(item.prix_unit).toLocaleString()} DA
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <button
                      className="modern-button1"
                      onClick={() => toggleExpand(order.id)}
                    >
                      Voir moins
                    </button>
                  </div>
                ) : (
                  <button
                    className="modern-button"
                    onClick={() => toggleExpand(order.id)}
                  >
                    Voir plus
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChangePassword() {
  const [form, setForm] = useState({ current: "", new: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.current || !form.new || !form.confirm) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (form.new !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetchWithCSRF(`${API_BASE_URL}/api/change_password/`, {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Impossible de changer le mot de passe.");
      }

      setSuccess("Mot de passe changé avec succès.");
      setForm({ current: "", new: "", confirm: "" });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Changer le mot de passe</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <label>
        Mot de passe actuel:
        <input
          type="password"
          name="current"
          value={form.current}
          onChange={handleChange}
        />
      </label>
      <label>
        Nouveau mot de passe:
        <input
          type="password"
          name="new"
          value={form.new}
          onChange={handleChange}
        />
      </label>
      <label>
        Confirmer le mot de passe:
        <input
          type="password"
          name="confirm"
          value={form.confirm}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Changer le mot de passe</button>
    </form>
  );
}

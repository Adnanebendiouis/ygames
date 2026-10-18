import { useState, useEffect, useContext } from "react";
import "../styles/UserPage.css";
import { fetchWithCSRF } from "../utils/csrf";
import { API_BASE_URL } from "../constants/baseUrl";
import { MdArrowBack, MdMenu } from "react-icons/md";
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

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  "en cours": { label: "En cours",  cls: "badge--pending"   },
  "livré":    { label: "Livré",     cls: "badge--delivered" },
  "livre":    { label: "Livré",     cls: "badge--delivered" },
  "recu":     { label: "Reçu",      cls: "badge--received"  },
  "annulé":   { label: "Annulé",    cls: "badge--cancelled" },
  "annule":   { label: "Annulé",    cls: "badge--cancelled" },
};

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
        const [userRes, ordersRes] = await Promise.all([
          fetchWithCSRF(`${API_BASE_URL}/api/current_user/`),
          fetchWithCSRF(`${API_BASE_URL}/api/client/orders/`),
        ]);

        if (!userRes.ok) {
          const d = await userRes.json().catch(() => ({}));
          throw new Error(d.detail || "Impossible de charger le profil.");
        }
        if (!ordersRes.ok) {
          const d = await ordersRes.json().catch(() => ({}));
          throw new Error(d.detail || "Impossible de charger les commandes.");
        }

        const [userData, ordersData] = await Promise.all([
          userRes.json(),
          ordersRes.json(),
        ]);

        setUser(userData);
        setOrders(ordersData);
      } catch (err: any) {
        console.error("Erreur:", err);
        setError(err.message || "Une erreur est survenue.");
      }
    };

    fetchData();
  }, []);

  const nav = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="user-page">
      <button
        className="menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Menu"
      >
        <MdMenu />
      </button>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <button className="back-button" onClick={() => navigate("/")}>
          <MdArrowBack />
        </button>
        <h2 className="sidebar-title">Mon compte</h2>
        {user && (
          <div className="sidebar-user">
            <span className="sidebar-user__name">
              {user.first_name || user.username}
            </span>
            <span className="sidebar-user__email">{user.email}</span>
          </div>
        )}
        <nav>
          <ul>
            <li className={activeTab === "profile" ? "active" : ""} onClick={() => nav("profile")}>
              Profil
            </li>
            <li className={activeTab === "orders" ? "active" : ""} onClick={() => nav("orders")}>
              Commandes
              {orders.length > 0 && (
                <span className="sidebar-badge">{orders.length}</span>
              )}
            </li>
            <li className={activeTab === "password" ? "active" : ""} onClick={() => nav("password")}>
              Mot de passe
            </li>
            <li className="sidebar-logout" onClick={() => { handleLogout(); setSidebarOpen(false); }}>
              Déconnexion
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
  const full_name = user ? `${user.first_name} ${user.last_name}`.trim() : "";

  return (
    <div className="form">
      <h2>Informations du profil</h2>
      <label>
        Nom d'utilisateur
        <div className="name">{user?.username || "—"}</div>
      </label>
      <label>
        Email
        <div className="name">{user?.email || "—"}</div>
      </label>
      <label>
        Nom complet
        <div className="name">{full_name || "—"}</div>
      </label>
    </div>
  );
}

function OrderHistory({ orders }: { orders: IOrder[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <p>Aucune commande trouvée.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-title">Historique des commandes</h2>
      <div className="order-cards">
        {orders.map((order) => {
          const s = STATUS_LABELS[order.status.toLowerCase()] ?? { label: order.status, cls: "badge--default" };
          const isOpen = expandedId === order.id;
          return (
            <div key={order.id} className="order-card">
              <div className="order-card__header">
                <div className="order-card__meta">
                  <span className="order-card__name">{order.full_name}</span>
                  <span className="order-card__sub">{order.type} · {order.wilaya !== "none" ? order.wilaya : "Retrait magasin"}</span>
                </div>
                <div className="order-card__right">
                  <span className={`status-badge ${s.cls}`}>{s.label}</span>
                  <span className="order-card__total">{Number(order.total).toLocaleString("fr-DZ")} DA</span>
                </div>
              </div>

              {isOpen && (
                <div className="order-card__items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item">
                      <span className="order-item__name">{item.produit.name}</span>
                      <span className="order-item__qty">×{item.quantity}</span>
                      <span className="order-item__price">{Number(item.prix_unit).toLocaleString("fr-DZ")} DA</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                className={`order-card__toggle ${isOpen ? "order-card__toggle--open" : ""}`}
                onClick={() => setExpandedId(isOpen ? null : order.id)}
              >
                {isOpen ? "Masquer les articles" : "Voir les articles"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChangePassword() {
  const [form, setForm] = useState({ current: "", new: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    if (form.new.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithCSRF(`${API_BASE_URL}/api/change_password/`, {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || "Impossible de changer le mot de passe.");

      setSuccess(data.message || "Mot de passe changé avec succès.");
      setForm({ current: "", new: "", confirm: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Changer le mot de passe</h2>
      {error   && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <label>
        Mot de passe actuel
        <input type="password" name="current" value={form.current} onChange={handleChange} required />
      </label>
      <label>
        Nouveau mot de passe
        <input type="password" name="new" value={form.new} onChange={handleChange} required />
      </label>
      <label>
        Confirmer le mot de passe
        <input type="password" name="confirm" value={form.confirm} onChange={handleChange} required />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Chargement..." : "Changer le mot de passe"}
      </button>
    </form>
  );
}

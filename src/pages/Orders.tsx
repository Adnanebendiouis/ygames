import { API_BASE_URL } from "../constants/baseUrl";
import { fetchWithCSRF } from "../utils/csrf";
import { useEffect, useState } from "react";
import "../styles/OrderHistory.css";
import { FaTrashAlt, FaEllipsisV } from "react-icons/fa";
import { Fragment } from "react";

interface Order {
  id: string;
  client_name: string;
  date_commande?: string;
  total: string;
  status: string;
  full_name: string;
  phone: string;
  wilaya: string;
  commune: string;
  adresse: string;
  type: string;
  items: {
    produit: { id: number; name: string; image: string };
    quantity: number;
    prix_unit: string;
  }[];
}

// Backend enum-compatible statuses
const statusOptions = [
  { value: "en cours", label: "En cours" },
  { value: "livre", label: "Livré" },
  { value: "recu", label: "Reçu" },
  { value: "annule", label: "Annulé" },
];

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);

  useEffect(() => {
    fetchWithCSRF(`${API_BASE_URL}/api/orders/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched orders:", data);
        setOrders(data);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const handleStatusChange = async (order: Order, newStatus: string) => {
    try {
      const res = await fetchWithCSRF(
        `${API_BASE_URL}/api/orders/${order.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update order");

      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
      );
      setDropdownOpenId(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const deleteOrder = async (order: Order) => {
    try {
      const res = await fetchWithCSRF(
        `${API_BASE_URL}/api/orders/${order.id}/`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete order");

      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const toggleFilter = (status: string) => {
    setFilterStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredOrders =
    filterStatuses.length === 0
      ? orders
      : orders.filter((o) => filterStatuses.includes(o.status));

  return (
    <div className="order-history-container">
      <h2>Historique des commandes</h2>

      <div className="filter-bar">
        <span style={{ fontWeight: "bold" }}>Filtrer par statut:</span>
        <div className="filter-options">
          {statusOptions.map((status) => (
            <label key={status.value}>
              <input
                type="checkbox"
                checked={filterStatuses.includes(status.value)}
                onChange={() => toggleFilter(status.value)}
              />
              {status.label}
            </label>
          ))}
        </div>
      </div>

      <div className="table-wrapper1">
        <table className="order-table1">
          <thead>
            <tr>
              <th>Client</th>
              <th>Total (DA)</th>
              <th>Status</th>
              <th>ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <Fragment key={order.id}>
                <tr>
                  <td>{order.full_name || order.client_name}</td>
                  <td>{Number(order.total).toLocaleString()} DA</td>
                  <td
                    className={`status ${order.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {statusOptions.find((s) => s.value === order.status)
                      ?.label || order.status}
                  </td>
                  <td className="id-column">{order.id}</td>
                  <td className="actions">
                    <div className="dropdown">
                      <FaEllipsisV
                        className="icon"
                        onClick={() =>
                          setDropdownOpenId(
                            dropdownOpenId === order.id ? null : order.id
                          )
                        }
                      />
                      {dropdownOpenId === order.id && (
                        <div className="status-dropdown">
                          {statusOptions.map((option) => (
                            <div
                              key={option.value}
                              onClick={() =>
                                handleStatusChange(order, option.value)
                              }
                              className="dropdown-item"
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <FaTrashAlt
                      className="icon delete"
                      onClick={() => deleteOrder(order)}
                    />
                  </td>
                </tr>

                {/* Order details row */}
                <tr>
                  <td colSpan={6}>
                    <div className="order-details">
                      <h4>Détails de la commande</h4>
                      <p>
                        <strong>ID de la commande:</strong> {order.id}
                      </p>

                      {/* ✅ Client info */}
                      <h5>Informations client</h5>
                      <p>
                        <strong>Nom complet:</strong>{" "}
                        {order.full_name || order.client_name}
                      </p>
                      <p>
                        <strong>Téléphone:</strong> {order.phone}
                      </p>
                      {order.wilaya !== "none" && (
                        <>
                          <p>
                            <strong>Wilaya:</strong> {order.wilaya}
                          </p>
                          <p>
                            <strong>Commune:</strong> {order.commune}
                          </p>
                          <p>
                            <strong>Adresse:</strong> {order.adresse}
                          </p>
                        </>
                      )}
                      <p>
                        <strong>Type de livraison:</strong> {order.type}
                      </p>

                      {/* ✅ Items */}
                      <h5>Articles</h5>
                      {order.items?.map((item, itemIdx) => (
                        <div key={`${order.id}-item-${itemIdx}`}>
                          <p>Produit: {item.produit.name}</p>
                          <p>Quantité: {item.quantity}</p>
                          <p>
                            Prix unitaire:{" "}
                            {Number(item.prix_unit).toLocaleString()} DA
                          </p>
                        </div>
                      ))}

                      <p>
                        <strong>Total:</strong>{" "}
                        {Number(order.total).toLocaleString()} DA
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {statusOptions.find((s) => s.value === order.status)
                          ?.label || order.status}
                      </p>
                    </div>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

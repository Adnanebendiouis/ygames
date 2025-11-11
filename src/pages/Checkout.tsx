// src/pages/Checkout.tsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Checkout.css";
import { API_BASE_URL } from "../constants/baseUrl";
import { fetchWithCSRF } from "../utils/csrf";
import { MdArrowBack } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartContext } from "../context/CartContext";

const wilayas = [
  { id: 1, name: "Adrar", fee: 800 },
  { id: 2, name: "Chlef", fee: 600 },
  { id: 3, name: "Laghouat", fee: 700 },
  { id: 4, name: "Oum El Bouaghi", fee: 600 },
  { id: 5, name: "Batna", fee: 600 },
  { id: 6, name: "Béjaïa", fee: 600 },
  { id: 7, name: "Biskra", fee: 700 },
  { id: 8, name: "Béchar", fee: 700 },
  { id: 9, name: "Blida", fee: 600 },
  { id: 10, name: "Bouira", fee: 600 },
  { id: 11, name: "Tamanrasset", fee: 1350 },
  { id: 12, name: "Tébessa", fee: 700 },
  { id: 13, name: "Tlemcen", fee: 400 },
  { id: 14, name: "Tiaret", fee: 600 },
  { id: 15, name: "Tizi Ouzou", fee: 600 },
  { id: 16, name: "Alger", fee: 500 },
  { id: 17, name: "Djelfa", fee: 700 },
  { id: 18, name: "Jijel", fee: 600 },
  { id: 19, name: "Sétif", fee: 600 },
  { id: 20, name: "Saïda", fee: 600 },
  { id: 21, name: "Skikda", fee: 600 },
  { id: 22, name: "Sidi Bel Abbès", fee: 500 },
  { id: 23, name: "Annaba", fee: 600 },
  { id: 24, name: "Guelma", fee: 600 },
  { id: 25, name: "Constantine", fee: 600 },
  { id: 26, name: "Médéa", fee: 600 },
  { id: 27, name: "Mostaganem", fee: 600 },
  { id: 28, name: "M'Sila", fee: 600 },
  { id: 29, name: "Mascara", fee: 600 },
  { id: 30, name: "Ouargla", fee: 700 },
  { id: 31, name: "Oran", fee: 600 },
  { id: 32, name: "El Bayadh", fee: 800 },
  { id: 33, name: "Illizi", fee: 1350 },
  { id: 34, name: "Bordj Bou Arreridj", fee: 600 },
  { id: 35, name: "Boumerdès", fee: 600 },
  { id: 36, name: "El Tarf", fee: 600 },
  { id: 37, name: "Tindouf", fee: 1350 },
  { id: 38, name: "Tissemsilt", fee: 600 },
  { id: 39, name: "El Oued", fee: 700 },
  { id: 40, name: "Khenchela", fee: 600 },
  { id: 41, name: "Souk Ahras", fee: 600 },
  { id: 42, name: "Tipaza", fee: 600 },
  { id: 43, name: "Mila", fee: 600 },
  { id: 44, name: "Aïn Defla", fee: 600 },
  { id: 45, name: "Naâma", fee: 600 },
  { id: 46, name: "Aïn Témouchent", fee: 500 },
  { id: 47, name: "Ghardaïa", fee: 700 },
  { id: 48, name: "Relizane", fee: 600 },
  { id: 49, name: "Timimoun", fee: 800 },
  { id: 50, name: "Bordj Badji Mokhtar", fee: 800 },
  { id: 51, name: "Ouled Djellal", fee: 700 },
  { id: 52, name: "Béni Abbès", fee: 700 },
  { id: 53, name: "In Salah", fee: 1350 },
  { id: 54, name: "In Guezzam", fee: 1350 },
  { id: 55, name: "Touggourt", fee: 700 },
  { id: 56, name: "Djanet", fee: 1350 },
  { id: 57, name: "El M'Ghair", fee: 700 },
  { id: 58, name: "El Menia", fee: 700 },
];

const Checkout = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [adresse, setAdresse] = useState("");
  const [typeLivraison, setTypeLivraison] = useState<"livraison" | "pick up">("pick up");
  const [loading, setLoading] = useState(false);

  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Fetch logged-in user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchWithCSRF(`${API_BASE_URL}/api/current_user/`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          let full_name = data.first_name + " " + data.last_name;
          console.log("Fetched user data:", data);
          console.log(data.full_name);
          setFullName(full_name || "");
          // Optional: prefill phone if your backend starts returning it later
          // setPhone(data.phone || "");
        }
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };
    fetchUser();
  }, []);

  const calculateTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const total = calculateTotalPrice();
  const selectedWilaya = wilayas.find((w) => w.id.toString() === wilaya);
  const deliveryFee = typeLivraison === "livraison" && selectedWilaya ? selectedWilaya.fee : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("❌ Votre panier est vide. Vous ne pouvez pas passer une commande.");
      return;
    }

    setLoading(true);

    const isDelivery = typeLivraison === "livraison";

    const payload = {
      full_name: fullName,
      phone,
      wilaya: isDelivery ? wilaya : "none",
      commune: isDelivery ? commune : "none",
      adresse: isDelivery ? adresse : "none",
      total,
      status: "en cours",
      type: typeLivraison,
      items: cartItems.map((item) => ({
        produit_id: parseInt(item.id),
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetchWithCSRF(`${API_BASE_URL}/api/order/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("❌ Erreur : " + JSON.stringify(errorData));
        setLoading(false);
        return;
      }

      clearCart();
      toast.success("✅ Commande passée avec succès !");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      toast.error("❌ Erreur réseau lors de l'envoi de la commande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main2">
      <ToastContainer position="top-right" autoClose={3000} />

      <button className="back-button1" onClick={() => navigate("/cart")}>
        <MdArrowBack />
      </button>

      <div className="checkout-container">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Finaliser la commande</h2>

          {/* Full Name */}
          <input
            type="text"
            placeholder="Nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{3,50}$"
            title="Le nom doit contenir uniquement des lettres (3 à 50 caractères)"
            minLength={3}
            maxLength={50}
            required
            
          />

          {/* Phone */}
          <input
            type="tel"
            placeholder="Téléphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            pattern="^0[5-7][0-9]{8}$"
            title="Le numéro doit commencer par 05, 06 ou 07 et contenir 10 chiffres"
            minLength={10}
            maxLength={10}
            required
          />

          {/* Delivery or Pick-up */}
          <div className="delivery-type">
            <button
              type="button"
              className={`delivery-btn ${typeLivraison === "pick up" ? "active" : ""}`}
              onClick={() => setTypeLivraison("pick up")}
            >
              Récupération du magasin
            </button>
            <button
              type="button"
              className={`delivery-btn ${typeLivraison === "livraison" ? "active" : ""}`}
              onClick={() => setTypeLivraison("livraison")}
            >
              Livraison
            </button>
          </div>

          {typeLivraison === "livraison" && (
            <>
              <select value={wilaya} onChange={(e) => setWilaya(e.target.value)} required>
                <option value="">-- Sélectionnez une wilaya --</option>
                {wilayas.sort((a, b) => a.id - b.id).map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.id} - {w.name} ({w.fee} DA)
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Commune"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,50}$"
                title="La commune doit contenir uniquement des lettres (2 à 50 caractères)"
                minLength={2}
                maxLength={50}
                required
              />

              <input
                type="text"
                placeholder="Adresse"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                pattern="^[A-Za-z0-9À-ÖØ-öø-ÿ\s,'-]{5,100}$"
                title="L’adresse doit contenir 5 à 100 caractères valides"
                minLength={5}
                maxLength={100}
                required
              />
            </>
          )}

          <button className="btn5" type="submit" disabled={loading}>
            {loading ? "Commande en cours..." : "Commander"}
          </button>
        </form>
      </div>

      <div className="checkout-resume">
        <h3>Résumé :</h3>
        <div className="delivery-price">
          <p>Prix:</p>
          <p>{total} DA</p>
        </div>
        <div className="delivery-price">
          <p>Frais de livraison:</p>
          <p>{deliveryFee} DA</p>
        </div>
        <div className="total-price">
          <h3>Total à payer:</h3>
          <h3 style={{ color: "#C30A1D" }}>{total + deliveryFee} DA</h3>
        </div>

        <div className="order-summary">
          <h3>Vos articles :</h3>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} — {item.quantity} × {item.price} DA ={" "}
                <strong>{item.price * item.quantity} DA</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

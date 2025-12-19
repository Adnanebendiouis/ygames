import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Snowfall from "react-snowfall";
import { API_BASE_URL } from "../constants/baseUrl";
import type { Product } from "../types/types";
import "../styles/PromoPage.css";

const PromoPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  // FETCH PROMO PRODUCT (TEST ENDPOINT)
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPromo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/promo/`);
        const data = await res.json();

        /**
         * If your endpoint returns:
         *  - ONE product -> data
         *  - ARRAY of products -> data[0]
         */
        const promoProduct = Array.isArray(data) ? data[0] : data;

        setProduct(promoProduct);
      } catch {
        setError(true);
      }
    };

    fetchPromo();
  }, []);

  // COUNTDOWN (24h fallback if no expires field)
useEffect(() => {
  if (!product) return;

  // End of the current day (midnight)
  const now = new Date();
  const endTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0
  ).getTime();

  const interval = setInterval(() => {
    const diff = endTime - new Date().getTime();

    if (diff <= 0) {
      setTimeLeft("Offre terminée");
      clearInterval(interval);
      return;
    }

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    setTimeLeft(`${h}h ${m}m ${s}s`);
  }, 1000);

  return () => clearInterval(interval);
}, [product]);


  if (error) {
    return <div className="promo-error">Une erreur est survenue.</div>;
  }

  if (!product) {
    return <div className="promo-loading">Chargement de l’offre...</div>;
  }

  return (
    <div className="winter-promo">
      <Helmet>
        <title>Offre du Jour – Ygames</title>
        <meta
          name="description"
          content="Chaque jour, un jeu en promotion exclusive pendant 24h seulement sur Ygames."
        />
        <link rel="canonical" href="https://www.ygames.shop/promo" />
      </Helmet>

      {/* Snowfall */}
      <Snowfall
        snowflakeCount={120}
        speed={[0.3, 1.2]}
        wind={[-0.2, 0.2]}
        radius={[0.5, 2.5]}
      />

      <div className="promo-content">
        <p className="promo-label">OFFRE DU JOUR</p>

        <div className="promo-card">
          <img
            src={product.image}
            alt={product.name}
            className="promo-image"
          />

          <div className="promo-info">
            <h1>{product.name}</h1>

            <p className="old-price">
              {product.price} DA
            </p>

            <p className="promo-price">
              {product.prix_promo
                ? `${product.prix_promo} DA`
                : "PROMO EXCLUSIVE"}
            </p>

            <p className="countdown">
              Se termine dans {timeLeft}
            </p>

            <button className="claim-btn">
              Obtenir maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoPage;

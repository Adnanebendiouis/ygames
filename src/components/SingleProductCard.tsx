import React, { useState } from "react";
import type { CartItem, Product } from "../types/types";
import '../styles/ProductsCard.css';
import { API_BASE_URL } from "../constants/baseUrl";
import { useNavigate } from 'react-router-dom';
import { Check } from "@mui/icons-material";

interface Props {
  product: Product;
}

const SingleProductCard: React.FC<Props> = ({ product }) => {
  const navigate = useNavigate();
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const addToCart = (product: Product) => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id == product.id);

    const finalPrice = product.promo == 1 && product.prix_promo ? product.prix_promo : product.price;
    console.log("Final Price:", finalPrice);
    console.log("Product Promo Status:", product.promo);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert("Quantité maximale atteinte pour ce produit.");
        return;
      } else {
        existingItem.quantity += 1;
      }
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: finalPrice,
        quantity: 1,
        stock: product.stock
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setLastAddedId(product.id);
    setTimeout(() => setLastAddedId(null), 2000);
  };

  const buyNow = (product: Product) => {
    addToCart(product);
    navigate('/checkout');
  };

  const price = parseFloat(String(product.price));
  const prixPromo = product.prix_promo ? parseFloat(String(product.prix_promo)) : null;
  console.log("Final Price:", prixPromo);
  console.log("Product Promo Status:", product.promo);

  return (
    <div>
      <div
        key={product.id}
        className="Product-card1"
        onClick={() => navigate(`/product/${product.id}`, { state: { id: product.id } })}
        style={{ position: "relative" }}
      >
        {/* Promo badge */}
        {product.promo == 1 && prixPromo && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              backgroundColor: "#ff0000",
              color: "#ffffff",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "1.4rem",
              zIndex: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
            }}
          >
            %
          </div>
        )}

        <div className="Product-image-container">
          <img
            src={`${API_BASE_URL}${product.image}`}
            alt={product.name}
            className="Product-image"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/default-product.jpg'; }}
          />
        </div>

        <div className="product-info">
          <div className="product-name">{product.name}</div>
          {product.stock <= 0 ? (
            <div className="product-status out-of-stock">
              Rupture de stock - <span>{product.etat}</span>
            </div>
          ) : (
            <div className="product-status in-stock">
              Disponible - <span>{product.etat}</span>
            </div>
          )}

          {/* Price display */}
          {product.promo == 1 && prixPromo ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ textDecoration: "line-through", color: "#999", fontSize: "0.9rem" }}>
                {price.toFixed(2)} DA
              </div>
              <div style={{ color: "#ff0000", fontWeight: "bold", fontSize: "1.6rem" }}>
                {prixPromo.toFixed(2)} DA
              </div>
            </div>
          ) : (
            <div className="product-price">{price.toFixed(2)} DA</div>
          )}

          {/* Add to Cart Button */}
          <div className="product-buttons">
          <button
            className={`btn-outline ${lastAddedId == product.id ? 'added' : ''}`}
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            disabled={product.stock <= 0}
          >
            {lastAddedId == product.id ? (
              <>
                <Check className="icon" />
                <span className="btn-text-desktop">Ajouté</span>
                <span className="btn-text-mobile">Ajouté</span>
              </>
            ) : (
              <>
                <span className="btn-text-desktop">Ajouter au panier</span>
                <span className="btn-text-mobile">Ajouter au panier</span>
              </>
            )}
          </button>

          {/* Buy Now Button */}
          <button
            className="btn-filled"
            onClick={(e) => { e.stopPropagation(); buyNow(product); }}
            disabled={product.stock <= 0}
          >
            {/* <span className="btn-text-desktop">Acheter</span> */}
            <span className="btn-text-mobilea">Acheter</span>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SingleProductCard;

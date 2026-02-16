// src/components/ProductsCard.tsx
import "../styles/ProductsCard.css";
import { useRef, useState, useEffect, useCallback, useContext } from "react";
import { ChevronLeft, ChevronRight, Check } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { API_BASE_URL } from "../constants/baseUrl";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  etat: string;
  category: string;
  promo: number;
  prix_promo?: number;
}

interface Props {
  products: Product[];
}

const ProductsCard = ({ products }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(280);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const calculatedWidth = Math.min(
          280,
          Math.max(250, containerWidth / 4)
        );
        setCardWidth(calculatedWidth);
      }
    };
    const onResize = () => requestAnimationFrame(handleResize);
    handleResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollToCard = useCallback(
    (index: number) => {
      if (containerRef.current) {
        const scrollAmount = cardWidth * index;
        containerRef.current.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    },
    [cardWidth]
  );

  const handleNext = useCallback(() => {
    const newIndex = Math.min(currentIndex + 1, products.length - 1);
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
  }, [currentIndex, products.length, scrollToCard]);

  const handlePrev = useCallback(() => {
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
  }, [currentIndex, scrollToCard]);

  const handleAddToCart = useCallback(
    (product: Product) => {
      // Use promo price if available, otherwise use regular price
      const finalPrice = product.promo == 1 && product.prix_promo 
        ? product.prix_promo 
        : product.price;

      addToCart({
        id: product.id,
        name: product.name,
        image: product.image,
        price: finalPrice,
        quantity: 1,
        stock: product.stock,
        category: product.category
      });

      setLastAddedId(product.id);
      setTimeout(() => setLastAddedId(null), 2000);
    },
    [addToCart]
  );

  const buyNow = useCallback(
    (product: Product) => {
      handleAddToCart(product);
      navigate("/cart");
    },
    [handleAddToCart, navigate]
  );

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2 className="categories-title">Tous les produits</h2>
        <div className="navigation-buttons">
          <button className="nav-button" onClick={handlePrev}>
            <ChevronLeft />
          </button>
          <button className="nav-button" onClick={handleNext}>
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="categories-scroll-container" ref={containerRef}>
        {products
          .filter((product) => product.stock > 0)
          .map((product) => {
            return (
              <div
                key={product.id}
                className="Product-card"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  navigate(`/product/${product.id}`);
                }}
                style={{ position: "relative" }}
              >
                {product.promo == 1 && (
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
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = `${API_BASE_URL}/images/default-product.jpg`;
                    }}
                  />
                </div>

                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-status in-stock">
                    Disponible - <span>{product.etat}</span>
                  </div>
                  
                  {product.promo == 1 && product.prix_promo ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <div 
                        style={{ 
                          textDecoration: "line-through",
                          color: "#999",
                          fontSize: "0.9rem"
                        }}
                      >
                        {product.price} DA
                      </div>
                      <div 
                        className="product-price" 
                        style={{ 
                          color: "#ff0000",
                          fontWeight: "bold"
                        }}
                      >
                        {product.prix_promo} DA
                      </div>
                    </div>
                  ) : (
                    <div className="product-price">{product.price} DA</div>
                  )}

                  <div className="product-buttons">
                    <button
                      className={`btn-outline ${
                        lastAddedId == product.id ? "added" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      {lastAddedId == product.id ? (
                        <>
                          <Check className="icon" /> Ajouté
                        </>
                      ) : (
                        <>Ajouter au panier</>
                      )}
                    </button>
                    <button
                      className="btn-filled"
                      onClick={(e) => {
                        e.stopPropagation();
                        buyNow(product);
                      }}
                    >
                      Acheter
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ProductsCard;
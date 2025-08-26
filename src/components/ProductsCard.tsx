// src/components/ProductsCard.tsx
import "../styles/ProductsCard.css";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Check } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  etat: string;
  category: string;
}

interface Props {
  products: Product[];
}

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
}

const ProductsCard = ({ products }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(280);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [, setCart] = useState<CartItem[]>(
    () => JSON.parse(localStorage.getItem("cart") || "[]")
  );
  const navigate = useNavigate();

  // 🔹 Resize handler optimized with rAF
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

  // 🔹 Scroll function memoized
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

  // 🔹 Optimized addToCart (no multiple JSON.parse)
  const addToCart = useCallback(
    (product: Product) => {
      setCart((prevCart) => {
        const newCart = [...prevCart];
        const existingItem = newCart.find((item) => item.id === product.id);

        if (existingItem) {
          if (existingItem.quantity >= product.stock) {
            alert("Quantité maximale atteinte pour ce produit.");
            return prevCart;
          }
          existingItem.quantity += 1;
        } else {
          newCart.push({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: 1,
            stock: product.stock,
          });
        }
        localStorage.setItem("cart", JSON.stringify(newCart));
        return newCart;
      });

      setLastAddedId(product.id);
      setTimeout(() => setLastAddedId(null), 2000);
    },
    []
  );

  const buyNow = useCallback(
    (product: Product) => {
      addToCart(product);
      navigate("/cart");
    },
    [addToCart, navigate]
  );

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2 className="categories-title">All products</h2>
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
          .map((product) => (
            <div
              key={product.id}
              className="Product-card"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="Product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="Product-image"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = "/images/default-product.jpg";
                  }}
                />
              </div>

              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-status in-stock">
                  Disponible - <span>{product.etat}</span>
                </div>
                <div className="product-price">{product.price} DA</div>

                <div className="product-buttons">
                  <button
                    className={`btn-outline ${
                      lastAddedId === product.id ? "added" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    {lastAddedId === product.id ? (
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
          ))}
      </div>
    </div>
  );
};

export default ProductsCard;

// src/components/RecProductsCard.tsx
import '../styles/ProductsCard.css';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants/baseUrl';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  etat: string;
  category: string;
  promo?: number;
  prix_promo?: number;
}

interface Props {
  products: Product[];
}

const RecProductsCard = ({ products }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(280);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  // Resize cards on window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const calculatedWidth = Math.min(280, Math.max(250, containerWidth / 4));
        setCardWidth(calculatedWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToCard = (index: number) => {
    if (containerRef.current) {
      const scrollAmount = cardWidth * index;
      containerRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleNext = () => {
    const newIndex = Math.min(currentIndex + 1, products.length - 1);
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
  };

  const handlePrev = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
  };

  const handleAddToCart = (product: Product) => {
    const finalPrice =
      product.promo === 1 && product.prix_promo ? product.prix_promo : product.price;

    addToCart({
      id: product.id,
      name: product.name,
      image: `${API_BASE_URL}${product.image}`,
      price: finalPrice,
      quantity: 1,
      stock: product.stock,
      category: product.category,
    });

    setLastAddedId(product.id);
    setTimeout(() => setLastAddedId(null), 2000);
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    navigate('/cart'); // or /checkout if you prefer
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2 className="categories-title">Produits recommandés</h2>
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
              {product.promo === 1 && product.prix_promo && (
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#ff0000',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.4rem',
                    zIndex: 10,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
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
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/default-product.jpg';
                  }}
                />
              </div>

              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className={`product-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? 'Disponible' : 'Rupture de stock'} - <span>{product.etat}</span>
                </div>

                <div className="product-price">
                  {product.promo === 1 && product.prix_promo ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ textDecoration: 'line-through', color: '#999' }}>
                        {product.price} DA
                      </span>
                      <span style={{ color: '#ff0000', fontWeight: 'bold' }}>
                        {product.prix_promo} DA
                      </span>
                    </div>
                  ) : (
                    <span>{product.price} DA</span>
                  )}
                </div>

                <div className="product-buttons">
                  <button
                    className={`btn-outline ${lastAddedId === product.id ? 'added' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={product.stock <= 0}
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
                      handleBuyNow(product);
                    }}
                    disabled={product.stock <= 0}
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

export default RecProductsCard;

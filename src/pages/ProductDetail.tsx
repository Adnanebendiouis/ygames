import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ProductDetail.css';
import { API_BASE_URL } from '../constants/baseUrl';
import SimProductsCard from '../components/SimProductsCard';
import { CartContext } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  note: string;
  stock: number;
  etat: string;
  date_ajout: string;
  categorie_nom: string;
}

export interface Product1 {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  image: string;
  category: string;
  isPromo: number;
  etat: string;
  note: string;
  date_ajout: string;
  categorie_nom: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [categoryP, setCategoryP] = useState<Product1[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/product-detail/${id}/`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);

        const resP = await fetch(`${API_BASE_URL}/api/filter/?category=${data.categorie_nom}`);
        const dataP = await resP.json();
        setCategoryP(dataP);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value: number) => {
    if (product && value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: String(product.id),
      name: product.name,
      image: product.image,
      price: parseFloat(product.price),
      quantity,
      stock: product.stock,
      category: product.categorie_nom,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const buyNow = () => {
    if (!product) return;

    addToCart({
      id: String(product.id),
      name: product.name,
      image: product.image,
      price: parseFloat(product.price),
      quantity,
      stock: product.stock,
      category: product.categorie_nom,
    });

    navigate('/cart');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  return (
    <div>
      <div className="product-detail-container1"></div>
      <div className="product-detail-container1">
        <div className="product-header">
          <h1>{product.name}</h1>
        </div>

        <div className="product-content1">
          <div className="product-image-container">
            <img
              src={product.image}
              alt={product.name}
              className="product-image1"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400';
              }}
            />
          </div>

          <div className="product-info">
            <div className="product-price">{parseFloat(product.price).toFixed(2)} DA</div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
              <p>{product.categorie_nom}</p>
            </div>

            <div className="product-condition">
              <span>Condition:</span> {product.etat}
            </div>

            {product.stock > 0 && (
              <div className="product-actions">
                <button
                  className={`add-to-cart ${added ? 'added-button' : ''}`}
                  onClick={handleAddToCart}
                >
                  {added ? '✔ Ajouté' : 'AJouter au panier'}
                </button>

                <button className="buy-now" onClick={buyNow}>
                  Acheter maintenant
                </button>

                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <SimProductsCard products={categoryP} />
    </div>
  );
};

export default ProductDetail;

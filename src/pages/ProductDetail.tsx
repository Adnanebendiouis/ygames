import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ProductDetail.css';
import { API_BASE_URL } from '../constants/baseUrl';
import SimProductsCard from '../components/ProductsCard';
import { CartContext } from '../context/CartContext';
import { Helmet } from 'react-helmet';

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

interface ProductCardType {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  etat: string;
  category: string;
}

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [categoryP, setCategoryP] = useState<ProductCardType[]>([]);

  const productId = location.state?.id;
  
  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  useEffect(() => {
    if (!productId) {
      setError('Product ID missing');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/product-detail/${productId}/`);
        if (!response.ok) throw new Error('Product not found');
        const data: Product = await response.json();
        setProduct(data);

        const resP = await fetch(`${API_BASE_URL}/api/filter/?category=${data.categorie_nom}`);
        const dataP: Product[] = await resP.json();

        const mappedProducts: ProductCardType[] = dataP.map((p) => ({
          id: String(p.id),
          name: p.name,
          image: p.image,
          price: parseFloat(p.price),
          stock: p.stock,
          etat: p.etat,
          category: p.categorie_nom,
        }));
        setCategoryP(mappedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (value: number) => {
    if (product && value > 0 && value <= product.stock) setQuantity(value);
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

  const productSlug = generateSlug(product.name);

  return (
    <div>
      <Helmet>
        <title>{product.name} - Ygames Tlemcen</title>
        <meta name="description" content={product.description} />
        <link rel="canonical" href={`https://www.ygames.shop/product/${productSlug}`} />
        <link rel="preload" as="image" href={product.image} />

        {/* Open Graph */}
        <meta property="og:title" content={`${product.name} - Ygames Tlemcen`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} - Ygames Tlemcen`} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={product.image} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: [product.image],
            description: product.description,
            sku: product.id,
            offers: {
              "@type": "Offer",
              url: `https://www.ygames.shop/product/${productSlug}`,
              priceCurrency: "DZD",
              price: parseFloat(product.price),
              itemCondition: "https://schema.org/NewCondition",
              availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          })}
        </script>
      </Helmet>

      <div className="product-detail-container1">
        <header className="product-header">
          <h1>{product.name}</h1>
        </header>

        <main className="product-content1">
<div className="product-image-container">
  <img
    src={product.image}
    alt={product.name}
    className="product-image1"
    loading="lazy" // lazy-load for better performance
    onError={(e) => {
      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400';
    }}
  />
</div>


          <section className="product-info">
            <h1>{product.name}</h1>
            <h2>Price</h2>
            <div className="product-price">{parseFloat(product.price).toFixed(2)} DA</div>

            <h2>Description</h2>
            <div className="product-description">
              <p>{product.description}</p>
              <p>{product.categorie_nom}</p>
            </div>

            <h2>Condition</h2>
            <div className="product-condition">{product.etat}</div>

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
          </section>
        </main>
      </div>

      <SimProductsCard products={categoryP} />
    </div>
  );
};

export default ProductDetail;

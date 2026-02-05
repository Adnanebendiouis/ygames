// src/pages/Search.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import type { Product } from "../types/types";
import { API_BASE_URL } from "../constants/baseUrl";
import SingleProductCard from "../components/SingleProductCard";
import "../styles/Category.css";
import { MdArrowBack } from "react-icons/md";

const PRODUCTS_PER_PAGE = 9;

const Search = () => {
  const { search } = useParams<{ search: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [, setPriceMax] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceInput, setPriceInput] = useState("");
  const [loading, setLoading] = useState(true); // ✅ ADDED

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // FETCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // ✅ ADDED
        const res = await fetch(`${API_BASE_URL}/api/search/?q=${search}`);
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false); // ✅ ADDED
      }
    };
    fetchData();
  }, [search]);

  // FILTER BUTTON
  const applyPriceFilter = () => {
    if (priceInput) {
      const max = Number(priceInput);
      const filtered = products.filter((p) => {
        const actualPrice =
          p.promo === 1 && p.prix_promo ? p.prix_promo : p.price;
        return actualPrice <= max;
      });
      setFilteredProducts(filtered);
      setPriceMax(max);
      setCurrentPage(1);
    }
  };

  // RESET FILTER
  const resetFilter = () => {
    setPriceInput("");
    setPriceMax(null);
    setFilteredProducts(products);
  };

  // PAGINATION
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  if (error) {
    return <div className="error-message">Une erreur est survenue.</div>;
  }

  return (
    <div className="category-container">
      <Helmet>
        <title>Recherche "{search}" - Ygames Boutique à Tlemcen</title>
        <meta
          name="description"
          content={`Résultats de recherche pour "${search}" sur Ygames, votre boutique de jeux vidéo à Tlemcen.`}
        />
        <link
          rel="canonical"
          href={`https://www.ygames.shop/search/${encodeURIComponent(
            search || ""
          )}`}
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Accueil",
                item: "https://www.ygames.shop",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: `Recherche: ${search}`,
                item: `https://www.ygames.shop/search/${encodeURIComponent(
                  search || ""
                )}`,
              },
            ],
          })}
        </script>
      </Helmet>

      <div className="searchbar-space"></div>
      <div className="category-page">
        <aside className="filter-section">
          <span className="back-btn" onClick={() => navigate(-1)}>
            <MdArrowBack />
          </span>
          <p style={{ textAlign: "center" }}>Filtrer par prix</p>
          <br />
          <input
            className="input-box1"
            type="number"
            placeholder="Prix max"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
          />
          <button className="btn555" onClick={applyPriceFilter}>
            Filtrer
          </button>
          <button className="btn555" onClick={resetFilter}>
            Réinitialiser
          </button>
        </aside>

        <main className="products-section">
          <div className="header-bar">
            <div className="breadcrumb">
              <p>Accueil &gt; Recherche &gt; {search}</p>
            </div>
          </div>

          {/* ✅ LOADER ADDED */}
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px",
                fontSize: "1.1rem",
                color: "#666",
              }}
            >
              <div className="loader" />
              Chargement des produits...
            </div>
          ) : displayedProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                fontSize: "1.2rem",
                color: "#666",
              }}
            >
              Aucun produit trouvé pour "{search}"
            </div>
          ) : (
            <>
              <div className="products-grid">
                {displayedProducts.map((product) => (
                  <SingleProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={i + 1 === currentPage ? "active" : ""}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;
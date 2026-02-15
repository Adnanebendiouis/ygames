// src/pages/Category.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import type { Product } from "../types/types";
import { API_BASE_URL } from "../constants/baseUrl";
import SingleProductCard from "../components/SingleProductCard";
import "../styles/Category.css";
import { MdArrowBack } from "react-icons/md";


const PRODUCTS_PER_PAGE = 9;

const Category = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  // const [, setPriceMax] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceInput, setPriceInput] = useState("");
  const [conditionFilter, setConditionFilter] =
    useState<"all" | "neuf" | "occasion">("all");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // ✅ ADDED
  

  // SCROLL TO TOP ON CATEGORY CHANGE
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // ✅ ADDED
        let url = "";

        if (category === "Promotions") {
          url = `${API_BASE_URL}/api/promo/?page=${currentPage}`;
        } else {
          url = `${API_BASE_URL}/api/filter/?category=${category}&page=${currentPage}`;
        }
         if (conditionFilter !== "all") {
    url += `&etat=${conditionFilter}`;
  }

        const res = await fetch(url);
        const data = await res.json();

setProducts(data.results);
setFilteredProducts(applyFilters(data.results));

        setTotalPages(Math.ceil(data.count / PRODUCTS_PER_PAGE));
      } catch {
        setError(true);
      } finally {
        setLoading(false); // ✅ ADDED
      }
    };
    fetchData();
  }, [category, currentPage, conditionFilter]);

  // PRICE FILTER
const applyPriceFilter = () => {
  setCurrentPage(1);
  setFilteredProducts(applyFilters(products));
};

  const applyFilters = (baseProducts: Product[]) => {
  let filtered = [...baseProducts];

  // PRICE FILTER
  if (priceInput) {
    const max = Number(priceInput);
    filtered = filtered.filter((p) => {
      const effectivePrice =
        p.promo === 1 && p.prix_promo ? p.prix_promo : p.price;
      return effectivePrice <= max;
    });
  }

  // CONDITION FILTER
  if (conditionFilter !== "all") {
    filtered = filtered.filter(
      (p) => p.etat?.toLowerCase() === conditionFilter
    );
  }

  return filtered;
};


  // CONDITION FILTER
const applyConditionFilter = (
  condition: "all" | "neuf" | "occasion"
) => {
  setConditionFilter(condition);
  setCurrentPage(1);
  setFilteredProducts(applyFilters(products));
};


  // RESET FILTER
const resetFilter = () => {
  setPriceInput("");
  setConditionFilter("all");
  setFilteredProducts(products);
  setCurrentPage(1);
};


  const displayedProducts = filteredProducts;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return <div className="error-message">Une erreur est survenue.</div>;
  }

  const categorySlug = category
    ?.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return (
    <div className="category-container">
      <Helmet>
        <title>{category} - Ygames Boutique de Jeux Vidéo à Tlemcen</title>
        <meta
          name="description"
          content={`Découvrez tous les jeux vidéo de la catégorie ${category} sur Ygames, votre boutique de jeux à Tlemcen.`}
        />
        <link
          rel="canonical"
          href={`https://www.ygames.shop/category/${categorySlug}`}
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
                name: "Catégorie",
                item: "https://www.ygames.shop/category",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: category,
                item: `https://www.ygames.shop/category/${categorySlug}`,
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

          <br />
          <br />

          <p style={{ textAlign: "center" }}>État du produit</p>
          <div>
            <button
              className={`btn555 ${
                conditionFilter === "all" ? "active" : ""
              }`}
              onClick={() => applyConditionFilter("all")}
            >
              Tous
            </button>
            <button
              className={`btn555 ${
                conditionFilter === "neuf" ? "active" : ""
              }`}
              onClick={() => applyConditionFilter("neuf")}
            >
              Neuf
            </button>
            <button
              className={`btn555 ${
                conditionFilter === "occasion" ? "active" : ""
              }`}
              onClick={() => applyConditionFilter("occasion")}
            >
              Occasion
            </button>
          </div>

          <br />
          <button className="btn555" onClick={resetFilter}>
            Réinitialiser
          </button>
        </aside>

        <main className="products-section">
          <div className="header-bar">
            <div className="breadcrumb">
              <p>Accueil &gt; Catégorie &gt; {category}</p>
            </div>
          </div>

          {/* ✅ LOADER + NOT FOUND */}
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
              Aucun produit trouvé dans cette catégorie
            </div>
          ) : (
            <>
              <div className="products-grid">
                {displayedProducts.map((product) => (
                  <SingleProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((prev) =>
                      Math.max(prev - 1, 1)
                    );
                    scrollToTop();
                  }}
                >
                  Prev
                </button>

                {(() => {
                  const pages: (number | string)[] = [];
                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++)
                      pages.push(i);
                  } else {
                    pages.push(1);
                    if (currentPage > 4) pages.push("...");
                    for (
                      let i = Math.max(2, currentPage - 2);
                      i <=
                      Math.min(
                        totalPages - 1,
                        currentPage + 2
                      );
                      i++
                    )
                      pages.push(i);
                    if (currentPage < totalPages - 3)
                      pages.push("...");
                    pages.push(totalPages);
                  }
                  return pages.map((page, idx) =>
                    page === "..." ? (
                      <span key={idx} className="dots">
                        ...
                      </span>
                    ) : (
                      <button
                        key={idx}
                        className={
                          page === currentPage ? "active" : ""
                        }
                        onClick={() => {
                          setCurrentPage(Number(page));
                          scrollToTop();
                        }}
                      >
                        {page}
                      </button>
                    )
                  );
                })()}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    );
                    scrollToTop();
                  }}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Category;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Product } from "../types/types";
import { API_BASE_URL } from "../constants/baseUrl";
import SingleProductCard from "../components/SingleProductCard";
import "../styles/Category.css";
import { MdArrowBack } from "react-icons/md";

const PRODUCTS_PER_PAGE = 9;

const Category = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [, setPriceMax] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceInput, setPriceInput] = useState("");
  const [conditionFilter, setConditionFilter] = useState<"all" | "neuf" | "occasion">("all");

  // FETCH
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/filter/?category=${category}`);
        const data = await res.json();

        setProducts(data);
        setFilteredProducts(data);
      } catch {
        setError(true);
      }
    };
    fetchData();
  }, [category]);

  // FILTER BUTTON
  const applyPriceFilter = () => {
    if (priceInput) {
      const max = Number(priceInput);
      const filtered = products.filter((p) => p.price <= max);
      setFilteredProducts(filtered);
      setPriceMax(max);
      setCurrentPage(1);
    }
  };

  // CONDITION FILTER
  const applyConditionFilter = (condition: "all" | "neuf" | "occasion") => {
    setConditionFilter(condition);

    let filtered = [...products];

    if (priceInput) {
      const max = Number(priceInput);
      filtered = filtered.filter((p) => p.price <= max);
    }

    if (condition !== "all") {
      filtered = filtered.filter((p) => p.etat?.toLowerCase() === condition);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  // RESET FILTER
  const resetFilter = () => {
    setPriceInput("");
    setPriceMax(null);
    setConditionFilter("all");
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
          <button className="btn555" onClick={applyPriceFilter}>Filtrer</button>
          <br /><br />

          <p style={{ textAlign: "center" }}>État du produit</p>
          <div>
            <button
              className={`btn555 ${conditionFilter === "all" ? "active" : ""}`}
              onClick={() => applyConditionFilter("all")}
            >
              Tous
            </button>
            <button
              className={`btn555 ${conditionFilter === "neuf" ? "active" : ""}`}
              onClick={() => applyConditionFilter("neuf")}
            >
              Neuf
            </button>
            <button
              className={`btn555 ${conditionFilter === "occasion" ? "active" : ""}`}
              onClick={() => applyConditionFilter("occasion")}
            >
              Occasion
            </button>
          </div>

          <br />
          <button className="btn555" onClick={resetFilter}>Réinitialiser</button>
        </aside>

        <main className="products-section">
          <div className="header-bar">
            <div className="breadcrumb">
              <p>Accueil &gt; Catégorie &gt; {category}</p>
            </div>
          </div>

          <div className="products-grid">
            {displayedProducts.map((product) => (
              <SingleProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev
            </button>

            {(() => {
              const pages: (number | string)[] = [];

              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (currentPage > 4) pages.push("...");

                for (
                  let i = Math.max(2, currentPage - 2);
                  i <= Math.min(totalPages - 1, currentPage + 2);
                  i++
                ) {
                  pages.push(i);
                }

                if (currentPage < totalPages - 3) pages.push("...");
                pages.push(totalPages);
              }

              return pages.map((page, idx) =>
                page === "..." ? (
                  <span key={idx} className="dots">...</span>
                ) : (
                  <button
                    key={idx}
                    className={page === currentPage ? "active" : ""}
                    onClick={() => setCurrentPage(Number(page))}
                  >
                    {page}
                  </button>
                )
              );
            })()}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Category;

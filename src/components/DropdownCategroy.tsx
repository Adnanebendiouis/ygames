import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CategoryDropdown.css";


interface SubCategory {
  name: string;
  path: string;
}

interface Category {
  label: string;
  sub?: SubCategory[];
}

const categories: Category[] = [
  {
    label: "PlayStation",
    sub: [
      { name: "Consoles PlayStation", path: "PlayStation/Consoles PlayStation" },
      { name: "Jeux PlayStation 5", path: "PlayStation/jeux PlayStation/jeux PlayStation 5" },
      { name: "Jeux PlayStation 4", path: "PlayStation/jeux PlayStation/jeux PlayStation 4" },
      { name: "Jeux PlayStation 3", path: "PlayStation/jeux PlayStation/jeux PlayStation 3" },
      { name: "Jeux PlayStation 2", path: "PlayStation/jeux PlayStation/jeux PlayStation 2" },
      { name: "Accessoires PlayStation", path: "PlayStation/Accessoire PlayStation" },
      { name: "Manettes PlayStation", path: "PlayStation/Manettes PlayStation" },
    ],
  },
  {
    label: "Nintendo",
    sub: [
      { name: "Jeux Nintendo Switch 1", path: "Nintendo/Jeux Nintendo Switch/Jeux Nintendo Switch 1" },
      { name: "Jeux Nintendo Switch 2", path: "Nintendo/Jeux Nintendo Switch/Jeux Nintendo Switch 2" },
      { name: "Jeux WII", path: "Nintendo/Jeux Nintendo Switch/jeux WII" },
      { name: "Jeux Nintendo DS", path: "Nintendo/Jeux Nintendo Switch/jeux Nintendo DS" },
      { name: "Consoles Nintendo Switch", path: "Nintendo/Consoles Nintendo Switch" },
      { name: "Accessoire Nintendo Switch", path: "Nintendo/Accessoire Nintendo Switch" },
      { name: "Manettes Nintendo", path: "Nintendo/Manettes Nintendo" },
    ],
  },
  {
    label: "Xbox",
    sub: [
      { name: "Consoles Xbox", path: "Xbox/Consoles Xbox" },
      { name: "Jeux Xbox", path: "Xbox/jeux Xbox" },
      { name: "Jeux Xbox Series X", path: "Xbox/jeux Xbox/jeux Xbox Series X" },
      { name: "Jeux Xbox One", path: "Xbox/jeux Xbox/jeux Xbox One" },
      { name: "Jeux Xbox 360", path: "Xbox/jeux Xbox/jeux Xbox 360" },
      { name: "Accessoire Xbox", path: "Xbox/Accessoire Xbox" },
      { name: "Manettes Xbox", path: "Xbox/Manettes Xbox" },
    ],
  },
  {
    label: "Digital",
    sub: [
      { name: "Abonnements", path: "Digital/Abonnements" },
      { name: "Xbox Game Pass", path: "Digital/Abonnements/Xbox Game Pass" },
      { name: "PlayStation Plus", path: "Digital/Abonnements/PlayStation Plus" },
      { name: "Carte PSN", path: "Digital/Carte PSN" },
      { name: "Streaming", path: "Digital/Streaming" },
      { name: "Netflix", path: "Digital/Streaming/Netflix" },
      { name: "Spotify", path: "Digital/Streaming/Spotify" },
      { name: "Steam+", path: "Digital/Carte steam" },
      { name: "iTunes", path: "Digital/Carte iTunes" },
    ],
  },
  {
    label: "Accessoire",
    sub: [
      { name: "Figurine", path: "Figurine" },
      { name: "Goodies & Cartes à jouer", path: "Goodies & Cartes à jouer" },
      { name: "Stockage externe", path: "Accessoire/Stockage externe" },
      { name: "Accessories Nintendo", path: "Accessoire/Accessories Nintendo " },
      { name: "Casque", path: "Accessoire/Casque" },
    ],
  },
  {
    label: "Collector",
    sub: [{ name: "Collector", path: "Collector" }],
  },
];

const CategoryDropdown: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClick = (path: string) => {
    navigate(`/Category/${encodeURIComponent(path)}`);
    closeMobileMenu();
    setActiveCategory(null);
    setOpenMobileCategory(null);
  };

  const closeMobileMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsClosing(false);
      setOpenMobileCategory(null);
      // Reset height
      if (bottomSheetRef.current) {
        bottomSheetRef.current.style.height = '';
      }
    }, 300);
  };

  // Function to adjust height based on content
  const adjustSheetHeight = () => {
    if (bottomSheetRef.current && contentRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        if (bottomSheetRef.current && contentRef.current) {
          const contentHeight = contentRef.current.scrollHeight;
          const handleHeight = 24; // handle + margin
          const padding = 40; // top and bottom padding
          const maxHeight = window.innerHeight * 0.9;
          const newHeight = Math.min(contentHeight + handleHeight + padding, maxHeight);
          bottomSheetRef.current.style.height = `${newHeight}px`;
        }
      });
    }
  };

  const handleToggleCategory = (label: string) => {
    setOpenMobileCategory((prev) => (prev === label ? null : label));
  };

  // Adjust height when category opens/closes or menu opens
  useEffect(() => {
    if (mobileMenuOpen) {
      // Initial adjustment
      adjustSheetHeight();
      
      // Adjust after animation completes (300ms transition)
      const timer = setTimeout(adjustSheetHeight, 350);
      
      return () => clearTimeout(timer);
    }
  }, [openMobileCategory, mobileMenuOpen]);
  useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const nav = document.querySelector(".desktop-menu");
    if (nav && !nav.contains(e.target as Node)) {
      setActiveCategory(null);
    }
  };
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);


  // Adjust on window resize
  useEffect(() => {
    if (mobileMenuOpen) {
      window.addEventListener("resize", adjustSheetHeight);
      return () => window.removeEventListener("resize", adjustSheetHeight);
    }
  }, [mobileMenuOpen]);

  return (
    <div className="category-navbar">
      {/* Desktop Menu */}
      <div className="desktop-menu">
        {categories.map((main) => (
          <div
            key={main.label}
            className={`parent-category ${activeCategory === main.label ? "active" : ""}`}
            onClick={() =>
              setActiveCategory(activeCategory === main.label ? null : main.label)
            }
          >
            <div className="category-title">
              <span>{main.label}</span>
              <span className={`arrow ${activeCategory === main.label ? "open" : ""}`}>
                ▽
              </span>
            </div>
            <div className={`submenu ${activeCategory === main.label ? "open" : ""} ${main.sub?.length === 1 ? "single-item" : ""}`}>
              <div className="mega-menu">
                {main.sub?.map((subItem) => (
                  <div
                    key={subItem.path}
                    className="submenu-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(subItem.path);
                    }}
                  >
                    {subItem.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Menu */}
      <div className="mobile-menu">
        <button className="burger-btn" onClick={() => setMobileMenuOpen(true)}>
          ☰
        </button>

        {mobileMenuOpen && (
          <>
            <div className="mobile-overlay" onClick={closeMobileMenu} />

            <div
              ref={bottomSheetRef}
              className={`mobile-bottom-sheet ${isClosing ? "closed" : "open"}`}
            >
              <div className="sheet-handle" />
              <div ref={contentRef} className="sheet-content">
                {categories.map((cat) => {
                  const isOpen = openMobileCategory === cat.label;
                  return (
                    <div key={cat.label} className="mobile-category-block">
                      <div
                        className="sheet-item"
                        onClick={() => handleToggleCategory(cat.label)}
                      >
                        <span>{cat.label}</span>
                        {cat.sub && (
                          <span className={`sheet-arrow ${isOpen ? "open" : ""}`}>
                            ▾
                          </span>
                        )}
                      </div>

                      {cat.sub && isOpen && (
                        <div className="mobile-submenu open">
                          <div>
                            {cat.sub.map((sub) => (
                              <div
                                key={sub.path}
                                className="mobile-submenu-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClick(sub.path);
                                }}
                              >
                                {sub.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryDropdown;
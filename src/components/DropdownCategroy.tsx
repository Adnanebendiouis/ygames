import React, { useState } from "react";
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
    // Consoles
    { name: "Consoles PlayStation", path: "PlayStation/Consoles PlayStation" },
    { name: "PlayStation 5", path: "PlayStation/Consoles PlayStation/PlayStation 5" },
    { name: "PlayStation 4", path: "PlayStation/Consoles PlayStation/PlayStation 4" },

    // Games
    { name: "Jeux PlayStation", path: "PlayStation/jeux PlayStation" },
    { name: "Jeux PlayStation 5", path: "PlayStation/jeux PlayStation/jeux PlayStation 5" },
    { name: "Jeux PlayStation 4", path: "PlayStation/jeux PlayStation/jeux PlayStation 4" },
    { name: "Jeux PlayStation 3", path: "PlayStation/jeux PlayStation/jeux PlayStation 3" },
    { name: "Jeux PlayStation 2", path: "PlayStation/jeux PlayStation/jeux PlayStation 2" },

    // Accessories
    { name: "Accessoires PlayStation", path: "PlayStation/Accessoire PlayStation" },
    { name: "Accessoires PlayStation 5", path: "PlayStation/Accessoire PlayStation/Accessoire PlayStation 5" },
    { name: "Accessoires PlayStation 4", path: "PlayStation/Accessoire PlayStation/Accessoire PlayStation 4" },
    { name: "Accessoires PlayStation 3", path: "PlayStation/Accessoire PlayStation/Accessoire PlayStation 3" },

    // Controllers
    { name: "Manettes PlayStation", path: "PlayStation/Manettes PlayStation" },
    { name: "Manettes PlayStation 5", path: "PlayStation/Manettes PlayStation/Manettes PlayStation 5" },
    { name: "Manettes PlayStation 4", path: "PlayStation/Manettes PlayStation/Manettes PlayStation 4" },

    // Headsets
    { name: "Casques PlayStation", path: "PlayStation/Casque PlayStation" },
    { name: "Casques PlayStation 5", path: "PlayStation/Casque PlayStation/Casque PlayStation 5" },
  ],
},

  {
    label: "Nintendo",
    sub: [
      { name: "Jeux Nintendo Switch", path: "Nintendo/Jeux Nintendo Switch" },
      { name: "Jeux Nintendo Switch 1", path: "Nintendo/Jeux Nintendo Switch/Jeux Nintendo Switch 1" },
      { name: "Jeux Nintendo Switch 2", path: "Nintendo/Jeux Nintendo Switch/Jeux Nintendo Switch 2" },
      { name: "Jeux WII", path: "Nintendo/Jeux Nintendo Switch/jeux WII" },
      { name: "Jeux Nintendo DS", path: "Nintendo/Jeux Nintendo Switch/jeux Nintendo DS" },
      { name: "Consoles Nintendo Switch", path: "Nintendo/Consoles Nintendo Switch" },
      { name: "Nintendo Switch 1", path: "Nintendo/Consoles Nintendo Switch/Nintendo Switch 1" },
      { name: "Nintendo Switch 2", path: "Nintendo/Consoles Nintendo Switch/Nintendo Switch 2" },
      { name: "Accessoire Nintendo Switch", path: "Nintendo/Accessoire Nintendo Switch" },
      { name: "Accessoire Nintendo Switch 1", path: "Nintendo/Accessoire Nintendo Switch/Accessorie Nintendo Switch 1" },
      { name: "Accessoire Nintendo Switch 2", path: "Nintendo/Accessoire Nintendo Switch/Accessorie Nintendo Switch 2" },
      { name: "Casque Nintendo Switch", path: "Nintendo/Casque Nintendo Switch" },
      { name: "Manettes Nintendo", path: "Nintendo/Manettes Nintendo" },
      { name: "Manettes Nintendo Switch", path: "Nintendo/Manettes Nintendo/Manettes Nintendo switch" },
    ],
  },
  {
    label: "Xbox",
    sub: [
      { name: "Consoles Xbox", path: "Xbox/Consoles Xbox" },
      { name: "Xbox Series X", path: "Xbox/Consoles Xbox/Xbox Series X" },
      { name: "Xbox Series S", path: "Xbox/Consoles Xbox/Xbox Series S" },
      { name: "Xbox One", path: "Xbox/Consoles Xbox/Xbox One" },
      { name: "Jeux Xbox", path: "Xbox/jeux Xbox" },
      { name: "Jeux Xbox Series X", path: "Xbox/jeux Xbox/jeux Xbox Series X" },
      { name: "Jeux Xbox One", path: "Xbox/jeux Xbox/jeux Xbox One" },
      { name: "Jeux Xbox 360", path: "Xbox/jeux Xbox/jeux Xbox 360" },
      { name: "Accessoire Xbox", path: "Xbox/Accessoire Xbox" },
      { name: "Accessoire Xbox Series X&S", path: "Xbox/Accessoire Xbox/Accessoire Xbox Series X&S" },
      { name: "Accessoire Xbox One", path: "Xbox/Accessoire Xbox/Accessoire Xbox One" },
      { name: "Accessoires Xbox 360", path: "Xbox/Accessoires Xbox 360" },
      { name: "Manettes Xbox", path: "Xbox/Manettes Xbox" },
      { name: "Manettes Xbox One", path: "Xbox/Manettes Xbox/Manettes Xbox One" },
      { name: "Manettes Xbox Series X&S", path: "Xbox/Manettes Xbox/Manettes Xbox Series X&S" },
      { name: "Casque Xbox", path: "Xbox/Casque Xbox" },
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
    ],
  },
  {
    label: "Accessoire",
    sub: [
      { name: "Figurine", path: "Accessoire/Figurine" },
      { name: "Goodies & Cartes à jouer", path: "Accessoire/Goodies & Cartes à jouer" },
      { name: "Stockage externe", path: "Accessoire/Stockage externe" },
      { name: "Accessories Nintendo", path: "Accessoire/Accessories Nintendo " },
      { name: "Accessories Nintendo switch 1", path: "Accessoire/Accessories Nintendo /Accessories Nintendo switch 1" },
      { name: "Casque", path: "Accessoire/Casque" },
      { name: "Manettes", path: "Accessoire/Manettes" },
    ],
  },
  {
    label: "Collector",
    sub: [
      { name: "Collector PlayStation 5", path: "Collector/Collector PlayStation 5" },
      { name: "Collector PlayStation 4", path: "Collector/Collector PlayStation 4" },
    ],
  },
];

const CategoryDropdown: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleClick = (path: string) => {
    navigate(`/Category/${encodeURIComponent(path)}`);
    setMobileOpen(false);
    setActiveCategory(null);
  };

  return (
    <div className="category-navbar">
      {/* Desktop Navbar */}
      <div className="desktop-menu">
        {categories.map((main) => (
          <div
            key={main.label}
            className={`parent-category ${activeCategory === main.label ? "active" : ""}`}
            onClick={() =>
              setActiveCategory(activeCategory === main.label ? null : main.label)
            }
          >
            <span>{main.label}</span>
            <div className={`submenu ${activeCategory === main.label ? "open" : ""}`}>
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
{/* Mobile Menu */}
<div className="mobile-menu">
  <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
    ☰ Categories
  </button>

  {mobileOpen && (
    <div className="mobile-dropdown">
      {categories.map((main) => (
        <div key={main.label} className="mobile-parent">
          <div
            className="mobile-parent-title"
            onClick={() => handleClick(main.label)} // clicking parent navigates if no subs
          >
            {main.label}
          </div>

          {/* Show ALL subcategories directly when menu is open */}
          <div className="mobile-submenu">
            {main.sub?.map((subItem) => (
              <div
                key={subItem.path}
                className="mobile-subitem"
                onClick={() => handleClick(subItem.path)}
              >
                {subItem.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

    </div>
  );
};

export default CategoryDropdown;

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
      { name: "Consoles PlayStation", path: "PlayStation/Consoles PlayStation" },
      { name: "PlayStation 5", path: "PlayStation/Consoles PlayStation/PlayStation 5" },
      { name: "PlayStation 4", path: "PlayStation/Consoles PlayStation/PlayStation 4" },
      { name: "jeux PlayStation", path: "PlayStation/jeux PlayStation" },
      { name: "jeux PlayStation 5", path: "PlayStation/jeux PlayStation/jeux PlayStation 5" },
      { name: "jeux PlayStation 4", path: "PlayStation/jeux PlayStation/jeux PlayStation 4" },
      { name: "jeux PlayStation 3", path: "PlayStation/jeux PlayStation/jeux PlayStation 3" },
      { name: "Accessoire PlayStation", path: "PlayStation/Accessoire PlayStation" },
      { name: "Accessoire PlayStation 5", path: "PlayStation/Accessoire PlayStation/Accessoire PlayStation 5" },
      { name: "Accessoire PlayStation 4", path: "PlayStation/Accessoire PlayStation/Accessoire PlayStation 4" },
      { name: "Manettes PlayStation", path: "PlayStation/Manettes PlayStation" },
      { name: "Manettes PlayStation 5", path: "PlayStation/Manettes PlayStation/Manettes PlayStation 5" },
      { name: "Manettes PlayStation 4", path: "PlayStation/Manettes PlayStation/Manettes PlayStation 4" },
      { name: "Casque PlayStation", path: "PlayStation/Casque PlayStation" },
      { name: "Casque PlayStation 5", path: "PlayStation/Casque PlayStation/Casque PlayStation 5" },
    ],
  },
{
  label: "Nintendo Switch",
  sub: [
    { name: "Jeux Nintendo Switch", path: "Nintendo Switch/Jeux Nintendo Switch" },
    { name: "Jeux Nintendo Switch 1", path: "Nintendo Switch/Jeux Nintendo Switch/Jeux Nintendo Switch 1" },
    { name: "Jeux Nintendo Switch 2", path: "Nintendo Switch/Jeux Nintendo Switch/Jeux Nintendo Switch 2" },
    { name: "Consoles Nintendo Switch", path: "Nintendo Switch/Consoles Nintendo Switch" },
    { name: "Nintendo Switch 1", path: "Nintendo Switch/Consoles Nintendo Switch/Nintendo Switch 1" },
    { name: "Nintendo Switch 2", path: "Nintendo Switch/Consoles Nintendo Switch/Nintendo Switch 2" },
    { name: "Accessoire Nintendo Switch", path: "Nintendo Switch/Accessoire Nintendo Switch" },
    { name: "Accessoire Nintendo Switch 1", path: "Nintendo Switch/Accessoire Nintendo Switch/Accessorie Nintendo Switch 1" },
    { name: "Accessoire Nintendo Switch 2", path: "switch/accessoires-2" },
    { name: "Casque Nintendo Switch", path: "switch/casques" },
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
    { name: "Jeux Xbox One", path: "Xbox/jeux Xbox/Jeux Xbox One" },
    { name: "Jeux Xbox 360", path: "Xbox/jeux Xbox/Jeux Xbox 360" },
    { name: "Accessoire Xbox", path: "Xbox/Accessoire Xbox" },
    { name: "Accessoire Xbox Series X&S", path: "Xbox/Accessoire Xbox/Accessoire Xbox Series X&S" },
    { name: "Accessoire Xbox One", path: "Xbox/Accessoire Xbox/Accessoire Xbox One" },
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
  ],
}

];

const CategoryDropdown: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClick = (path: string) => {
    navigate(`/Category/${encodeURIComponent(path)}`);
    setOpen(false);
  };

  return (
    <div className="dropdown">
      <button
        className="dropbtn"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        Category
      </button>

      {open && (
        <div
          className="dropdown-content"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {categories.map((main) => (
            <div className="dropdown-submenu" key={main.label}>
              <div className="submenu-title">{main.label}</div>
              <div className="submenu-items">
                {main.sub?.map((subItem) => (
                  <div
                    key={subItem.path} // Use path as unique key
                    className="dropdown-item"
                    onClick={() => handleClick(subItem.path)}
                  >
                    {subItem.name} {/* Show the readable name */}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
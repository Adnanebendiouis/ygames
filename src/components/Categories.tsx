import React from 'react';
import '../styles/Categories.css';
import psImg from '../images/ps.jpg';
import xboxImg from '../images/xbox.png';
import nintendoImg from '../images/nintendo.jpg';
import giftCardImg from '../images/Untitled (343 x 160 px)(1).svg';
import jeuImg from '../images/jeu.webp';
import accessoriesImg from '../images/accessories.jpg';
import godiesImg from '../images/godies.jpg';
import { Link } from 'react-router-dom';

interface CategoryItem {
  id: number;
  name: string;
  image: string;
  link: string;
}

const Categories: React.FC = () => {
  const categories: CategoryItem[] = [
    { id: 1, name: 'PlayStation', image: psImg, link: "PlayStation" },
    { id: 2, name: 'Xbox', image: xboxImg, link: "Xbox" },
    { id: 3, name: 'Nintendo Switch', image: nintendoImg, link: "Nintendo" },
    { id: 4, name: 'Figurine', image: godiesImg, link: "Figurine" },
    { id: 5, name: 'Collector', image: jeuImg, link: "Collector" },
    { id: 6, name: 'Accessoires', image: accessoriesImg, link: "Accessoires" },
    { id: 7, name: 'Abonnement', image: giftCardImg, link:"Digital" }
  ];

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2 className="categories-title">Catégorie</h2>
      </div>
      <div className="categories-grid1">
        {/* Première ligne avec 4 cartes */}
        <div className="categories-row1">
          {categories.slice(0, 4).map((category) => (
            category.link ? (
              <Link to={`/Category/${category.link}`} key={category.id} className="category-link1">
                <div className="category-card1">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="category-image1"
                  />
                  <div className="category-name1">{category.name}</div>
                </div>
              </Link>
            ) : (
              <div key={category.id} className="category-card1 category-link1">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="category-image1"
                />
                <div className="category-name1">{category.name}</div>
              </div>
            )
          ))}
        </div>
      
        {/* Deuxième ligne avec 3 cartes */}
        <div className="categories-row1 categories-row-left1">
          {categories.slice(4).map((category) => (
            category.link ? (
              <Link to={`/Category/${category.link}`} key={category.id} className="category-link1">
                <div className="category-card1">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="category-image1"
                  />
                  <div className="category-name1">{category.name}</div>
                </div>
              </Link>
            ) : (
              <div key={category.id} className="category-card1 category-link1">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="category-image1"
                />
                <div className="category-name1">{category.name}</div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  image: string;
  category: string;
  promo: number;
  prix_promo?: number; // Add this
  etat: string;
  note: string;
  date_ajout: string;
  categorie: number | string;
}

export type ProductCategory = 'Console' | 'Jeu' | 'Carte Prépayée' | 'Accessoire' | 'Goodies';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  oldPrice?: number;
}
export interface User {
  id: number;
  username: string;
  email?: string;
}
export interface User {
  id: number;
  username: string;
  email?: string;
  isAdmin?: boolean;  // Add this line (optional, depending if your backend always sends it)
}

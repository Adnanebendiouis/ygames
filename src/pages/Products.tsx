import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "../constants/baseUrl";
import "../styles/products.css";
import { refreshCSRFToken } from "../utils/csrf";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  etat: string;
  note: number;
  date_ajout: string;
  image?: string;
  categorie?: any;
  category_path?: string;
  promo?: boolean;
  prix_promo?: number;
}

interface CategoryPath {
  path: string;
  name?: string;
}
const normalizePath = (path: string) =>
  path.replace(/\s*\/\s*/g, "/").trim();


export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<CategoryPath[]>([]);
  const [error, setError] = useState(false);

  // === FILTER STATES ===
  const [filterEtat, setFilterEtat] = useState("all");
  const [filterPromo, setFilterPromo] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const stockRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const etatRef = useRef<HTMLSelectElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const prixPromoRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [promoType, setPromoType] = useState<string>("normal");
  let [selectedCategory, setSelectedCategory] = useState("");

  const PRODUCT_API = `${API_BASE_URL}/api/products/`;
  const CATEGORY_PATH_API = `${API_BASE_URL}/api/path/`;

  const applyFilters = (list: Product[]) => {
    return list.filter((p) => {
      // État
      if (filterEtat !== "all" && p.etat.toLowerCase() !== filterEtat) return false;

      // Promo
      if (filterPromo !== "all") {
        const isPromo = p.promo === true;
        if (filterPromo === "oui" && !isPromo) return false;
        if (filterPromo === "non" && isPromo) return false;
      }

      // Category filter by category_path
if (filterCategory !== "all") {
  const normalizedProductPath = normalizePath(p.category_path || "");
  const normalizedFilter = normalizePath(filterCategory);

  if (normalizedProductPath !== normalizedFilter) return false;
}


      // Search
      if (searchTerm.length > 0 && !p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        return false;

      return true;
    });
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(PRODUCT_API, { credentials: "include" });
      const data = await res.json();
      const result = Array.isArray(data) ? data : data.results || [];
      setProducts(result);
      setFilteredProducts(result);
    } catch (err) {
      console.error("Error loading products:", err);
      setError(true);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch(CATEGORY_PATH_API);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setShowModal(false);
    setPreviewImage(null);
    setPromoType("normal");
    setSelectedCategory("");
    if (imageRef.current) imageRef.current.value = "";
  };

  const populateForm = (product: Product) => {
    setEditingProduct(product);
    setPreviewImage(product.image || null);
    setPromoType(product.promo ? "promo" : "normal");
    setShowModal(true);

setSelectedCategory(normalizePath(product.category_path || ""));


    setTimeout(() => {
      if (nameRef.current) nameRef.current.value = product.name;
      if (priceRef.current) priceRef.current.value = String(product.price);
      if (stockRef.current) stockRef.current!!.value = String(product.stock);
      if (descRef.current) descRef.current!!.value = product.description;
      if (etatRef.current) etatRef.current!!.value = product.etat.toLowerCase();
      if (noteRef.current) noteRef.current!!.value = String(product.note);
      if (prixPromoRef.current) prixPromoRef.current.value = product.prix_promo ? String(product.prix_promo) : "";
    }, 50);
  };

  const handleDelete = async (id: number) => {
    const csrfToken = await refreshCSRFToken();
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(PRODUCT_API + id + "/", {
      method: "DELETE",
      credentials: "include",
      headers: { "X-CSRFToken": csrfToken || "" },
    });

    if (res.ok) {
      loadProducts();
    } else {
      alert("Failed to delete product");
    }
  };

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", nameRef.current?.value || "");
    formData.append("price", priceRef.current?.value || "");
    formData.append("stock", stockRef.current?.value || "");
    formData.append("description", descRef.current?.value || "");
    formData.append("etat", etatRef.current?.value || "");
    formData.append("note", noteRef.current?.value || "");
    formData.append("categorie", selectedCategory || "");
    formData.append("promo", promoType === "promo" ? "true" : "false");

    if (promoType === "promo" && prixPromoRef.current?.value) {
      formData.append("prix_promo", prixPromoRef.current.value);
    }

    const file = imageRef.current?.files?.[0];
    if (file) formData.append("image", file);

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct ? PRODUCT_API + editingProduct.id + "/" : PRODUCT_API;

    const csrfToken = await refreshCSRFToken();

    const res = await fetch(url, {
      method,
      body: formData,
      credentials: "include",
      headers: { "X-CSRFToken": csrfToken || "" },
    });

    if (res.ok) {
      resetForm();
      loadProducts();
    } else {
      const err = await res.json();
      alert("Failed to save: " + JSON.stringify(err));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterEtat("all");
    setFilterPromo("all");
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    setFilteredProducts(applyFilters(products));
  }, [searchTerm, filterEtat, filterPromo, filterCategory, products]);

  return (
    <div className="product-list-container">
      <h2>Liste des Produits</h2>

      {/* === FILTER BAR === */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "15px", alignItems: "center", flexWrap: "wrap" }}>
        <input type="text" placeholder="Rechercher un produit..." className="modal-input" value={searchTerm} onChange={handleSearch} style={{ maxWidth: "240px" }} />

        <select className="modal-input" style={{ maxWidth: "160px" }} value={filterEtat} onChange={(e) => setFilterEtat(e.target.value)}>
          <option value="all">État (Tous)</option>
          <option value="neuf">Neuf</option>
          <option value="occasion">Occasion</option>
        </select>

        <select className="modal-input" style={{ maxWidth: "160px" }} value={filterPromo} onChange={(e) => setFilterPromo(e.target.value)}>
          <option value="all">Promo (Tous)</option>
          <option value="oui">Oui</option>
          <option value="non">Non</option>
        </select>

        {/* === NEW CATEGORY FILTER BY category_path === */}
        <select className="modal-input" style={{ maxWidth: "220px" }} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">Catégorie (Toutes)</option>
          {categories.map((cat, idx) => (
<option key={idx} value={normalizePath(cat.path)}>
  {normalizePath(cat.path)}
</option>

          ))}
        </select>

        <button onClick={resetSearch} className="btn-cancel1">Réinitialiser</button>
        <button className="product-add-button" onClick={() => setShowModal(true)}>Ajouter un produit</button>
      </div>

      {/* === TABLE === */}
      {error ? (
        <div>Erreur lors du chargement des produits.</div>
      ) : (
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>État</th>
                <th>Note</th>
                <th>Promo</th>
                <th>Actions</th>
               
              </tr>
            </thead>

            <tbody>
  {filteredProducts.length === 0 ? (
    <tr>
      <td colSpan={10}>Aucun produit trouvé.</td>
    </tr>
  ) : (
    filteredProducts.map((p, index) => (
      <tr key={p.id}>
        
        {/* COUNTER COLUMN */}
        <td>{index + 1}</td>

        {/* IMAGE COLUMN */}
        <td>
          {p.image ? (
            <div style={{ position: "relative", display: "inline-block" }}>

              {p.promo && (
                <div style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  backgroundColor: "#ff0000",
                  color: "#ffffff",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "0.7rem",
                  zIndex: 1,
                }}>
                  %
                </div>
              )}

              <img
                src={p.image}
                width="60"
                height="40"
                alt="Product"
                className="table-img"
              />
            </div>
          ) : "Pas d'image"}
        </td>

        {/* NAME */}
        <td>{p.name}</td>

        {/* CATEGORY */}
        <td>{p.category_path || "Aucune catégorie"}</td>

        {/* PRICE / PROMO */}
        <td>
          {p.promo && p.prix_promo ? (
            <div>
              <span style={{
                textDecoration: "line-through",
                color: "#999",
                fontSize: "0.85rem",
                marginRight: "5px"
              }}>
                {p.price} DA
              </span>
              <span style={{ color: "#ff0000", fontWeight: "bold" }}>
                {p.prix_promo} DA
              </span>
            </div>
          ) : (
            <span>{p.price} DA</span>
          )}
        </td>

        {/* STOCK */}
        <td>{p.stock}</td>

        {/* ETAT */}
        <td>{p.etat}</td>

        {/* NOTE */}
        <td>{p.note}</td>

        {/* PROMO */}
        <td>{p.promo ? "Oui" : "Non"}</td>

        {/* ACTIONS */}
        <td>
          <button className="btn-save" onClick={() => populateForm(p)}>Modifier</button>
          <button className="btn-cancel" onClick={() => handleDelete(p.id)}>Supprimer</button>
        </td>

      </tr>
    ))
  )}
</tbody>

          </table>
        </div>
      )}

      {/* === MODAL === */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingProduct ? "Modifier le produit" : "Ajouter un produit"}</h3>
            <form onSubmit={handleAddOrUpdate}>
              
              <input ref={nameRef} type="text" className="modal-input" placeholder="Nom" required />
              <input ref={priceRef} type="number" className="modal-input" placeholder="Prix" required />
              <input ref={stockRef} type="number" className="modal-input" placeholder="Stock" required />
              <textarea ref={descRef} className="modal-input" placeholder="Description" required></textarea>

              <select ref={etatRef} className="modal-input" required>
                <option value="">État</option>
                <option value="neuf">Neuf</option>
                <option value="occasion">Occasion</option>
              </select>

              <input ref={noteRef} type="number" className="modal-input" placeholder="Note" step="0.1" max="10" required />

              {previewImage && (
                <div style={{ marginBottom: "10px" }}>
                  <p>Image actuelle :</p>
                  <img src={previewImage} alt="Aperçu du produit" style={{ maxWidth: "200px", borderRadius: "6px" }} />
                </div>
              )}

              <input
                ref={imageRef}
                type="file"
                className="modal-input"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) setPreviewImage(URL.createObjectURL(e.target.files[0]));
                }}
              />

              {/* CATEGORY DROPDOWN */}
              <select
                ref={categoryRef}
                className="modal-input"
                required
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {!selectedCategory && <option value="">Sélectionner une catégorie...</option>}
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat.path}>
                    {cat.path}
                  </option>
                ))}
              </select>

              {/* PROMO TYPE */}
              <select className="modal-input" value={promoType} onChange={(e) => setPromoType(e.target.value)} required>
                <option value="normal">Normal</option>
                <option value="promo">Promotion</option>
              </select>

              {promoType === "promo" && (
                <input ref={prixPromoRef} type="number" className="modal-input" placeholder="Prix promotionnel" step="0.01" required />
              )}

              <div className="modal-actions">
                <button type="submit" className="btn-save">Enregistrer</button>
                <button type="button" className="btn-cancel" onClick={resetForm}>Annuler</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

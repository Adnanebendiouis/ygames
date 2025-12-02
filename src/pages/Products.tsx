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

// ---------------- Module-level cache ----------------
let productCache: Product[] | null = null;

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
  const [filterDispo, setFilterDispo] = useState("all");

  // === CHECKBOX STATE ===
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());

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

  // === Scroll
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState(0);

  const PRODUCT_API = `${API_BASE_URL}/api/products/`;
  const CATEGORY_PATH_API = `${API_BASE_URL}/api/path/`;

  const applyFilters = (list: Product[]) => {
    return list.filter((p) => {
      if (filterEtat !== "all" && p.etat.toLowerCase() !== filterEtat)
        return false;

      if (filterDispo === "disponible" && p.stock <= 0) return false;
      if (filterDispo === "non" && p.stock > 0) return false;

      if (filterPromo !== "all") {
        const isPromo = p.promo === true;
        if (filterPromo === "oui" && !isPromo) return false;
        if (filterPromo === "non" && isPromo) return false;
      }

      if (filterCategory !== "all") {
        const normalizedProductPath = normalizePath(p.category_path || "");
        const normalizedFilter = normalizePath(filterCategory);
        if (normalizedProductPath !== normalizedFilter) return false;
      }

      if (searchTerm.length > 0 && !p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        return false;

      return true;
    });
  };

  const loadProducts = async () => {
    try {
      // Load from cache first
      if (productCache) {
        setProducts(productCache);
        setFilteredProducts(applyFilters(productCache));
      }

      // Always fetch fresh data
      const res = await fetch(PRODUCT_API, { credentials: "include" });
      const data = await res.json();
      const result: Product[] = Array.isArray(data) ? data : data.results || [];

      setProducts(result);
      setFilteredProducts(applyFilters(result));

      // Update cache
      productCache = result;
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

    if (res.ok) loadProducts(); 
    else alert("Failed to delete product");
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

    if (promoType === "promo" && prixPromoRef.current?.value)
      formData.append("prix_promo", prixPromoRef.current.value);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const resetSearch = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterEtat("all");
    setFilterPromo("all");
    setFilterDispo("all");
  };

  const toggleSelectProduct = (id: number) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const uncheckAll = () => setSelectedProducts(new Set());

  useEffect(() => { loadProducts(); loadCategories(); }, []);
  useEffect(() => { setFilteredProducts(applyFilters(products)); }, [searchTerm, filterEtat, filterPromo, filterCategory, filterDispo, products]);
  useEffect(() => { const firstRow = document.querySelector(".product-table tbody tr"); if (firstRow) setRowHeight(firstRow.clientHeight); }, [filteredProducts]);
  const scrollUpOne = () => { if (tableWrapperRef.current && rowHeight > 0) tableWrapperRef.current.scrollTop -= rowHeight; };
  const scrollDownOne = () => { if (tableWrapperRef.current && rowHeight > 0) tableWrapperRef.current.scrollTop += rowHeight; };

  return (
    <div className="product-list-container">
      <h2>Liste des Produits</h2>
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
        <select className="modal-input" style={{ maxWidth: "160px" }} value={filterDispo} onChange={(e) => setFilterDispo(e.target.value)}>
          <option value="all">Disponibilité (Tous)</option>
          <option value="disponible">Disponible</option>
          <option value="non">Non disponible</option>
        </select>
        <select className="modal-input" style={{ maxWidth: "220px" }} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">Catégorie (Toutes)</option>
          {categories.map((cat, idx) => (<option key={idx} value={normalizePath(cat.path)}>{normalizePath(cat.path)}</option>))}
        </select>
        <button onClick={resetSearch} className="btn-cancel1">Réinitialiser</button>
        <button className="product-add-button" onClick={() => setShowModal(true)}>Ajouter un produit</button>
        <button className="btn-cancel1" onClick={uncheckAll}>Désélectionner tout</button>
      </div>

      {error ? (<div>Erreur lors du chargement...</div>) : (
        <div className="product-table-wrapper" ref={tableWrapperRef}>
          <table className="product-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Sélect.</th>
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
              {filteredProducts.length === 0 ? (<tr><td colSpan={11}>Aucun produit trouvé.</td></tr>) :
                filteredProducts.map((p, index) => (
                  <tr key={p.id} onClick={() => toggleSelectProduct(p.id)} style={{ cursor: "pointer" }}>
                    <td>{index + 1}</td>
                    <td>
                      <input type="checkbox" checked={selectedProducts.has(p.id)} onChange={(e) => { e.stopPropagation(); toggleSelectProduct(p.id); }} />
                    </td>
                    <td>{p.image ? (
                      <div style={{ position: "relative" }}>
                        {p.promo && (<div style={{
                          position: "absolute", top: "2px", right: "2px", backgroundColor: "#ff0000", color: "white",
                          width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: "0.7rem", fontWeight: "bold"
                        }}>%</div>)}
                        <img src={p.image} width="60" height="40" className="table-img" />
                      </div>
                    ) : "Pas d'image"}</td>
                    <td>{p.name}</td>
                    <td>{p.category_path || "Aucune catégorie"}</td>
                    <td>{p.promo && p.prix_promo ? (<><span style={{ textDecoration: "line-through", color: "#999" }}>{p.price} DA</span>{" "}<span style={{ color: "red", fontWeight: "bold" }}>{p.prix_promo} DA</span></>) : `${p.price} DA`}</td>
                    <td>{p.stock}</td>
                    <td>{p.etat}</td>
                    <td>{p.note}</td>
                    <td>{p.promo ? "Oui" : "Non"}</td>
                    <td>
                      <button className="btn-save" onClick={(e) => { e.stopPropagation(); populateForm(p); }}>Modifier</button>
                      <button className="btn-cancel" onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}>Supprimer</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FLOATING SCROLL ARROWS */}
      <div style={{ position: "fixed", right: "20px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "10px", zIndex: 9999 }}>
        <button onClick={scrollUpOne} style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(0,0,0,0.5)", color: "white", fontSize: "20px", border: "none", cursor: "pointer" }}>↑</button>
        <button onClick={scrollDownOne} style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(0,0,0,0.5)", color: "white", fontSize: "20px", border: "none", cursor: "pointer" }}>↓</button>
      </div>

      {/* MODAL */}
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
              <input ref={noteRef} type="number" step="0.1" max="10" className="modal-input" placeholder="Note" required />
              {previewImage && (<div style={{ marginBottom: "10px" }}><p>Image actuelle :</p><img src={previewImage} style={{ maxWidth: "200px" }} /></div>)}
              <input ref={imageRef} type="file" className="modal-input" accept="image/*" onChange={(e) => { if (e.target.files?.length) setPreviewImage(URL.createObjectURL(e.target.files[0])); }} />
              <select ref={categoryRef} className="modal-input" required value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {!selectedCategory && (<option value="">Sélectionner une catégorie…</option>)}
                {categories.map((cat, i) => (<option key={i} value={cat.path}>{cat.path}</option>))}
              </select>
              <select className="modal-input" value={promoType} onChange={(e) => setPromoType(e.target.value)} required>
                <option value="normal">Normal</option>
                <option value="promo">Promotion</option>
              </select>
              {promoType === "promo" && (<input ref={prixPromoRef} type="number" step="0.01" className="modal-input" placeholder="Prix promotionnel" required />)}
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

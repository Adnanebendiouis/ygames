import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../constants/baseUrl";
import { fetchWithCSRF, refreshCSRFToken } from "../utils/csrf";
import "../styles/carousel-admin.css";

interface CarouselSlide {
  id: number;
  title: string;
  image?: string;
  cta_text?: string;
  cta_link?: string;
  badge?: string;
  order: number;
  is_active: boolean;
}

// ---------------- Cache ----------------
let carouselCache: CarouselSlide[] | null = null;

export default function CarouselAdmin() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const ctaTextRef = useRef<HTMLInputElement>(null);
  const ctaLinkRef = useRef<HTMLInputElement>(null);
  const badgeRef = useRef<HTMLInputElement>(null);
  const orderRef = useRef<HTMLInputElement>(null);
  const activeRef = useRef<HTMLInputElement>(null);

  const API_URL = `${API_BASE_URL}/api/admin/carousel/`;
  const getImageUrl = (path?: string) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  // ---------------- LOAD ----------------
  const loadSlides = async () => {
    try {
      if (carouselCache) setSlides(carouselCache);

      const res = await fetchWithCSRF(API_URL);
      const data = await res.json();
      setSlides(data);
      carouselCache = data;
    } catch (err) {
      console.error("Failed to load carousel", err);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  // ---------------- FORM ----------------
  const resetForm = () => {
    setEditingSlide(null);
    setShowModal(false);
    setPreviewImage(null);
    if (imageRef.current) imageRef.current.value = "";
  };

  const populateForm = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setPreviewImage(slide.image || null);
    setShowModal(true);

    setTimeout(() => {
      if (titleRef.current) titleRef.current.value = slide.title;
      if (ctaTextRef.current) ctaTextRef.current.value = slide.cta_text || "";
      if (ctaLinkRef.current) ctaLinkRef.current.value = slide.cta_link || "";
      if (badgeRef.current) badgeRef.current.value = slide.badge || "";
      if (orderRef.current) orderRef.current.value = String(slide.order);
      if (activeRef.current) activeRef.current.checked = slide.is_active;
    }, 50);
  };

  // ---------------- SAVE ----------------
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", titleRef.current?.value || "");
    formData.append("cta_text", ctaTextRef.current?.value || "");
    formData.append("cta_link", ctaLinkRef.current?.value || "");
    formData.append("badge", badgeRef.current?.value || "");
    formData.append("order", orderRef.current?.value || "0");
    formData.append("is_active", activeRef.current?.checked ? "true" : "false");

    const file = imageRef.current?.files?.[0];
    if (file) formData.append("image", file);

    const method = editingSlide ? "PATCH" : "POST";
    const url = editingSlide ? API_URL + editingSlide.id + "/" : API_URL;

    const csrf = await refreshCSRFToken();

    const res = await fetch(url, {
      method,
      body: formData,
      credentials: "include",
      headers: { "X-CSRFToken": csrf || "" },
    });

    if (res.ok) {
      // Reload slides and reset form
      resetForm();
      carouselCache = null;
      loadSlides();
    } else {
      alert("Failed to save slide");
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette slide ?")) return;

    const csrf = await refreshCSRFToken();

    const res = await fetch(API_URL + id + "/", {
      method: "DELETE",
      credentials: "include",
      headers: { "X-CSRFToken": csrf || "" },
    });

    if (res.ok) {
      carouselCache = null;
      loadSlides();
    }
  };

  return (
    <div className="carousel-admin-container">
      <h2>Gestion du Carousel</h2>

      <button className="btn-save" onClick={() => setShowModal(true)}>
        Ajouter une slide
      </button>

      <table className="carousel-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Titre</th>
            <th>CTA</th>
            <th>Badge</th>
            <th>Ordre</th>
            <th>Actif</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slides.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                Aucune slide
              </td>
            </tr>
          ) : (
            slides.map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>
                  {s.image ? (
                    <img src={getImageUrl(s.image)} width="80" />
                  ) : (
                    "—"
                  )}
                </td>
                <td>{s.title}</td>
                <td>{s.cta_text}</td>
                <td>{s.badge}</td>
                <td>{s.order}</td>
                <td>{s.is_active ? "Oui" : "Non"}</td>
                <td>
                  <button
                    className="btn-save"
                    onClick={() => populateForm(s)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => handleDelete(s.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              {editingSlide
                ? `Modifier slide #${editingSlide.id}`
                : "Ajouter slide"}
            </h3>

            <form onSubmit={handleSave}>
              <input
                ref={titleRef}
                className="modal-input"
                placeholder="Titre"
                required
              />
              <input
                ref={ctaTextRef}
                className="modal-input"
                placeholder="Texte bouton"
              />
              <input
                ref={ctaLinkRef}
                className="modal-input"
                placeholder="Lien bouton"
              />
              <input
                ref={badgeRef}
                className="modal-input"
                placeholder="Badge (NEW)"
              />
              <input
                ref={orderRef}
                type="number"
                className="modal-input"
                placeholder="Ordre"
              />

              {previewImage && (
                <img src={previewImage} style={{ maxWidth: "100%" }} />
              )}

              <input
                ref={imageRef}
                type="file"
                className="modal-input"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.length &&
                  setPreviewImage(URL.createObjectURL(e.target.files[0]))
                }
              />

              <label
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <input ref={activeRef} type="checkbox" />
                Actif
              </label>

              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Enregistrer
                </button>
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

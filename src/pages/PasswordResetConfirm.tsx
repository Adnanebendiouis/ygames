import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../constants/baseUrl";
import logo from "../images/ygames-logo.png";
import "../styles/Login.css";

const PasswordResetConfirm = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/password-reset/confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, token, new_password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setError(data.error || "Une erreur est survenue.");
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="wrapper">
        <Link to="/">
          <img className="logo-img1" src={logo} alt="Logo" />
        </Link>

        <p className="sentence">Nouveau mot de passe</p>

        {message && (
          <div style={{ background: "#d4edda", color: "#155724", padding: "10px", borderRadius: "5px", marginBottom: "15px", textAlign: "center", fontSize: "13px" }}>
            {message} Redirection...
          </div>
        )}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn" type="submit" disabled={loading || !!message}>
            {loading ? <span className="loader"></span> : "Réinitialiser"}
          </button>
        </form>

        <div className="remember-forget">
          <Link to="/login" style={{ fontWeight: "500", fontSize: "14px" }}>
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;

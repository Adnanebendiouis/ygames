import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithCSRF } from "../utils/csrf";
import { AuthContext } from "../context/auth-context";
import { API_BASE_URL } from "../constants/baseUrl";
import "../styles/SignUp.css";
import logo from "../images/ygames-logo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const passwordRequirements = [
    { regex: /.{8,}/, message: "Au moins 8 caractères" },
    { regex: /[A-Z]/, message: "Une lettre majuscule" },
    { regex: /[a-z]/, message: "Une lettre minuscule" },
    { regex: /[0-9]/, message: "Un chiffre" },
    { regex: /[^A-Za-z0-9]/, message: "Un caractère spécial" },
  ];

  const checkPasswordStrength = (pwd: string) =>
    passwordRequirements.filter((req) => req.regex.test(pwd)).length;

  const getStrengthLabel = (score: number) => {
    if (score <= 2) return "Faible";
    if (score === 3 || score === 4) return "Moyen";
    return "Fort";
  };

  const strengthScore = checkPasswordStrength(password);
  const strengthPercent = (strengthScore / passwordRequirements.length) * 100;
  const strengthLabel = getStrengthLabel(strengthScore);

  const getStrengthColor = () => {
    if (strengthScore <= 2) return "#e74c3c";
    if (strengthScore === 3 || strengthScore === 4) return "#f1c40f";
    return "#2ecc71";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Password validation
    const failedRequirements = passwordRequirements.filter(
      (req) => !req.regex.test(password)
    );
    if (failedRequirements.length > 0) {
      toast.error(
        "Votre mot de passe doit contenir : " +
          failedRequirements.map((r) => r.message).join(", ")
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      const response = await fetchWithCSRF(`${API_BASE_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          email,
          password,
          first_name,
          last_name,
          confirm_password: confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Extract first error message from backend
        let message = "Une erreur est survenue.";
        if (errorData.username) message = `Nom d'utilisateur: ${errorData.username[0]}`;
        else if (errorData.email) message = `Email: ${errorData.email[0]}`;
        else if (errorData.password) message = `Mot de passe: ${errorData.password[0]}`;

        toast.error(message);
        setLoading(false);
        return;
      }

      // Auto-login after registration
      const loginResponse = await fetchWithCSRF(`${API_BASE_URL}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim().toLowerCase(), password }),
      });

      if (!loginResponse.ok) {
        toast.warn("Inscription réussie, mais connexion automatique échouée.");
        navigate("/login");
        return;
      }

      const userData = await loginResponse.json();
      setUser(userData);
      toast.success("✅ Inscription et connexion réussies !");
      navigate("/");
    } catch (error: any) {
      toast.error("Erreur réseau : " + (error.message || "Réessayez plus tard"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main1">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="wrapper1">
        <form onSubmit={handleRegister}>
          <Link to="/">
            <img className="logo-img1" src={logo} alt="Logo" />
          </Link>

          <div className="c0">
            <div className="c3" onClick={() => navigate("/login")}>
              <p>Se connecter</p>
            </div>
            <div className="c1" onClick={() => navigate("/register")}>
              <p>S'inscrire</p>
            </div>
          </div>

          <p className="sentence">Content de te revoir, Gamer !</p>

          <div className="input-box1">
            <input
              type="text"
              placeholder="Prénom"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="input-box1">
            <input
              type="text"
              placeholder="Nom"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="input-box1">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-box1">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-box1">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {password && (
              <div style={{ marginTop: "8px" }}>
                <div
                  style={{
                    height: "8px",
                    borderRadius: "4px",
                    backgroundColor: "#ddd",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${strengthPercent}%`,
                      borderRadius: "4px",
                      backgroundColor: getStrengthColor(),
                      transition: "width 0.3s ease",
                    }}
                  ></div>
                </div>
                <small style={{ color: getStrengthColor() }}>
                  Force : {strengthLabel}
                </small>
              </div>
            )}

            <ul style={{ fontSize: "12px", marginTop: "6px", paddingLeft: "15px" }}>
              {passwordRequirements.map((req, i) => (
                <li
                  key={i}
                  style={{
                    color: req.regex.test(password) ? "green" : "red",
                    listStyle: "disc",
                  }}
                >
                  {req.message}
                </li>
              ))}
            </ul>
          </div>

          <div className="input-box1">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="accept">
            <label>
              <input type="checkbox" required /> J’accepte les conditions générales
            </label>
          </div>

          <button
            className="btn1"
            type="submit"
            disabled={loading || strengthScore < passwordRequirements.length}
          >
            {loading ? <span className="loader"></span> : "S’inscrire"}
          </button>

          <div className="login-link">
            <p>
              Vous avez déjà un compte ?{" "}
              <Link to="/login">
                <span>Se connecter</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

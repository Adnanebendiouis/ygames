import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithCSRF } from "../utils/csrf";
import { AuthContext } from "../context/auth-context";
import { API_BASE_URL } from "../constants/baseUrl";
import "../styles/Login.css";
import logo from "../images/ygames-logo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading animation
  const [errorMessage, setErrorMessage] = useState(""); // Error message
  const navigate = useNavigate();

  const { setUser, setIsAdmin } = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetchWithCSRF(`${API_BASE_URL}/api/login/`, {
        method: "POST",
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const token = data.token;
        const userData = data.user;
        localStorage.setItem("authToken", token);
        setUser(userData);
        setIsAdmin(userData.isAdmin || false);

        // Admin check
        const adminStatus =
          username.trim().toLowerCase() === "admin" ||
          username.trim().toLowerCase() === "younes";
        setUser({
          username: data.username,
          id: data.id,
        });
        setIsAdmin(adminStatus);

        console.log("User set in context:", username);

        // Small delay for loading animation
        setTimeout(() => {
          const previousPage =
            sessionStorage.getItem("previousPage") || "/";
          navigate(previousPage);
        }, 1000);
      } else {
        setErrorMessage("Nom d'utilisateur ou mot de passe incorrect.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <Link to="/">
            <img className="logo-img1" src={logo} alt="Logo" />
          </Link>

          <div className="c0">
            <div className="c1" onClick={() => navigate("/login")}>
              <p>Se connecter</p>
            </div>
            <div className="c2" onClick={() => navigate("/register")}>
              <p>S'inscrire</p>
            </div>
          </div>

          <div>
            <p className="sentence">Content de te revoir, Gamer !</p>
          </div>

          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}

          <div className="input-box">
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? <span className="loader"></span> : "Se connecter"}
          </button>

          <div className="remember-forget">
            <Link
              to="/passwordreset"
              style={{ fontWeight: "500", fontSize: "14px" }}
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <div className="register-link">
            <p>
              Nouveau sur YGAMES ?{" "}
              <Link to="/register">
                <span>Créez un compte</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

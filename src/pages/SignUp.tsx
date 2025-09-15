import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithCSRF } from "../utils/csrf";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { API_BASE_URL } from "../constants/baseUrl";
import "../styles/SignUp.css";
import logo from "../images/ygames-logo.png";

const Register = () => {
  const [first_name, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Password requirements
  const passwordRequirements = [
    { regex: /.{8,}/, message: "Au moins 8 caractères" },
    { regex: /[A-Z]/, message: "Une lettre majuscule" },
    { regex: /[a-z]/, message: "Une lettre minuscule" },
    { regex: /[0-9]/, message: "Un chiffre" },
    { regex: /[^A-Za-z0-9]/, message: "Un caractère spécial" },
  ];

  const checkPasswordStrength = (pwd: string) => {
    return passwordRequirements.filter((req) => req.regex.test(pwd)).length;
  };

  const getStrengthLabel = (score: number) => {
    if (score <= 2) return "Faible";
    if (score === 3 || score === 4) return "Moyen";
    return "Fort";
  };

  const strengthScore = checkPasswordStrength(password);
  const strengthPercent = (strengthScore / passwordRequirements.length) * 100;
  const strengthLabel = getStrengthLabel(strengthScore);

  const getStrengthColor = () => {
    if (strengthScore <= 2) return "#e74c3c"; // red
    if (strengthScore === 3 || strengthScore === 4) return "#f1c40f"; // yellow
    return "#2ecc71"; // green
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🚫 Block if requirements not met
    const failedRequirements = passwordRequirements.filter(
      (req) => !req.regex.test(password)
    );
    if (failedRequirements.length > 0) {
      alert(
        "Votre mot de passe doit contenir : " +
          failedRequirements.map((r) => r.message).join(", ")
      );
      return;
    }
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const response = await fetchWithCSRF(`${API_BASE_URL}/api/register/`, {
        method: "POST",
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          email,
          password,
          first_name,
          last_name: first_name,
          confirm_password: confirmPassword,
        }),
      });

      if (response.ok) {
        const loginResponse = await fetchWithCSRF(`${API_BASE_URL}/api/login/`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ username, password }),
        });

        if (loginResponse.ok) {
          const userData = await loginResponse.json();
          setUser(userData);
          console.log("Inscription + connexion réussie");
          navigate("/");
        } else {
          console.error("Inscription réussie mais login automatique échoué");
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="main1">
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
          <div>
            <p className="sentence">Content de te revoir, Gamer !</p>
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
              type="text"
              placeholder="Name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
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

          {/* Password with bar + checklist */}
          <div className="input-box1">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Strength Bar */}
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

            {/* Checklist */}
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
              <input type="checkbox" required /> J’accepte les conditions
              générales
            </label>
          </div>

          <button className="btn1" type="submit" disabled={strengthScore < passwordRequirements.length}>
            S’inscrire
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

import { useState } from "react";
import { API_BASE_URL } from "../constants/baseUrl";

export function PasswordResetRequest() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/password_reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Un email de réinitialisation a été envoyé.");
      } else {
        setMessage("Erreur : impossible d’envoyer l’email.");
      }
    } catch (error) {
      setMessage("Erreur réseau.");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Mot de passe oublié</h2>
      {message && <p>{message}</p>}
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <button type="submit">Envoyer</button>
    </form>
  );
}

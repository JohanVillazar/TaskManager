import { useState } from "react";
import "../styles/ForgotPassword.css"; 

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });





      const result = await response.json();
      if (response.ok) {
        setMessage("Se ha enviado un enlace a tu correo.");
        setError("");
      } else {
        setError(result.message || "Error al enviar el correo.");
      }

    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-form-wrapper">
        <form onSubmit={handleSubmit} className="forgot-form">
          <h2>Recuperar Contraseña</h2>
          <label>Ingresa tu Email registrado, te enviaremos un enlace:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Enviar enlace</button>
          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg">{error}</p>}
        </form>
      </div>
    </div>
  );
  
}

export default ForgotPassword;

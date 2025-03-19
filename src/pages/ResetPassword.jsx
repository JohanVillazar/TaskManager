// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/resetPassword.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("https://tasksapi-0jsn.onrender.com/api/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });


      const result = await response.json();
      console.log("Backend response:", result);

      if (response.ok) {
        setMessage("Contraseña actualizada correctamente.");
        setError("");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(result.message || "Error al actualizar la contraseña.");
      }
    } catch (err) {
      console.error("Error REAL en la solicitud:", err);
      setError("Error en la solicitud.");
    }
  };



  return (
    <div className="reset-password-container">
      <h2>Restablecer Contraseña</h2>

      <form onSubmit={handleSubmit} className="reset-password-form">
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Guardar nueva contraseña</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ResetPassword;

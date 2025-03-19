import  { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "../styles/Login.css";



const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://tasksapi-0jsn.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email,   password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();
      

      const {token, ...userData} = data;
      login(userData, token ); 

      if (userData.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }


    } catch (err) {
      setError(err.message);
    }
  };

  return (
    
    <div className="login-container">
     
      
      <div className="login-form">
        <div className="Titles">
        <h1 className="login-title">Orbit Task Manager </h1>
        <p className="login-subtitle">Inicia sesión o crea una cuenta nueva.</p>
        </div>
     

        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Ingresar</button>
          <p className="forgot-password">
            ¿Olvidaste tu contraseña?{" "}
            <Link to="/forgot-password/">Restablecer</Link>
          </p>
          <p className="register-text">
            ¿No tienes cuenta? <a href="/register">Regístrate</a>
          </p>
        </form>
      </div>

      <div className="login-logo">
        <img src="/logo.png" alt="Task Manager Logo" />
      </div>
    </div>
  );
};

export default Login;

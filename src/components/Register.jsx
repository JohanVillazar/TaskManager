import { useState } from "react";

import "../styles/Register.css"; // Puedes crear un archivo similar al de Login para los estilos
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // nuevo estado para el rol
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Aquí deberías hacer el POST al backend incluyendo el rol
      const response = await fetch("https://tasksmanagerback.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error en el registro");
        console.log("Error en el registro:", data.error);
        return;
      }

      // Aquí podrías redirigir al login o mostrar mensaje de éxito
      
        toast.success("¡Registro exitoso!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err) {
      console.error(err);
      setError("Error al registrar usuario");
    }

  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
         
          <select value={role} onChange={(e) => setRole(e.target.value)} required
             
             className="custom-select">

          <option value="" disabled>¿Qué rol deseas tener?</option>

            <option value="user">Usuario Basico</option>
            <option value="admin">Administrador</option>
          </select>

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />



          {error && <p className="error">{error}</p>}

          <button type="submit">Registrarse</button>
        </form>
        <p style={{ marginTop: "10px" }}>
          ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
        </p>
      </div>
    </div>
  );
};

export default Register;

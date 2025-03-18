import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import{useAuth} from "../context/AuthContext"
import "../styles/Sidebar.css";
import { useTaskModal } from "../context/TaskModalContext";


const Sidebar = ({ onCreateTaskClick }) => {
  const { openModal } = useTaskModal();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Elimina el token y redirige al login
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="sidebar fixed">
      <div className="sidebar-content">
        <div className="user-info">
          <h3>{"Hola"}</h3>
          <p style={{ fontSize: "18px", color: "#e74c3c" }}>
            {user?.name}
          </p>
        </div>

        <ul className="sidebar-links">
          <li><Link to="/dashboard">🏠DashBoard</Link></li>

          <li onClick={openModal} style={{ cursor: "pointer" }}>📝 Nueva tarea</li>
          <li><Link to="/my-tasks">📋 Todas mis tareas</Link></li>
          <li><Link to="/profile">👤 Mi perfil</Link></li>
        </ul>

        <div className="logout-button-container">
          <button className="logout-button" onClick={handleLogout}>
            🔒 Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

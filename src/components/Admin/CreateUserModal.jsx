import React, { useState } from "react";
import Modal from "react-modal";
import "./CreateUserModal.css"; // Asegúrate de crear este archivo CSS
import { toast } from "react-toastify";


const CreateUserModal = ({ isOpen, onRequestClose, onUserCreated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("Token no encontrado.");

    const newUser = { name, email, phone, password, role };

    try {
      const response = await fetch("https://tasksapi-0jsn.onrender.com/user/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error("Error al crear usuario");

      const createdUser = await response.json();
      toast.success("✅ Usuario creado correctamente");
      onUserCreated?.(createdUser); // Si querés actualizar listas en el Dashboard
      onRequestClose();

      // Limpiar campos
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("user");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      toast.error("❌ Error al crear usuario");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Crear Usuario"
      className="modal"
      overlayClassName="overlay"
      
    >
      <h2>Crear Nuevo Usuario</h2>
      <form onSubmit={handleSubmit} className="create-user-form">
        <label>Nombre:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Teléfono:</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />

        <label>Contraseña:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <label>Rol:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>

        <div className="btn-actions">
          <button type="submit">Crear Usuario</button>
          <button type="button" onClick={onRequestClose}>Cancelar</button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateUserModal;
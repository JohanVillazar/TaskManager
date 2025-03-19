// components/UserProfile.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/UserProfile.css";
import { FaUser, FaEnvelope, FaPhone, FaUserTag, FaCalendarAlt, FaCamera } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const { user } = useAuth();
 

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

  const formattedDate = new Date(user?.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    if (photo) formData.append("photo", photo);



    if (password) formData.append("password", password);
    if (photo) formData.append("photo", photo);

    if (currentPassword || newPassword || confirmPassword) {
    if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("Completa todos los campos de contraseña");
        return;
      }
  
      if (newPassword !== confirmPassword) {
        toast.error("Las nuevas contraseñas no coinciden");
        return;
      }
  
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
    }



    try {
      const response = await fetch("https://tasksapi-0jsn.onrender.com/user/update-profile", {
        method: "PUT",
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Error al actualizar perfil");

    
      toast.success("Perfil actualizado correctamente vuelve a iniciar sesión ✅");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };


  
  return (
    <div className="user-profile-container">
      <h2>👤 Perfil de Usuario</h2>


  {user && user.photo && (
    
  <div className="user-profile-photo">
    
    <img
      src={`https://tasksapi-0jsn.onrender.com/uploads/${user.photo}`}
      alt="Foto de perfil"
      className="profile-image"
    />
  </div>
)}


      <div className="user-profile-info">
        <p><FaUser className="icon" /><strong> Nombre:</strong> {user.name}</p>
        <p><FaEnvelope className="icon" /><strong> Email:</strong> {user.email}</p>
        <p><FaPhone className="icon" /><strong> Teléfono:</strong> {user.phone || "No definido"}</p>
        <p><FaUserTag className="icon" /><strong> Rol:</strong> {user.role || "No definido"}</p>
        <p><FaCalendarAlt className="icon" /><strong> Fecha de Registro:</strong> {formattedDate}</p>
      </div>

      <div className="user-profile-edit">
        <h3>✏️ Editar Perfil</h3>
        <form onSubmit={handleUpdateProfile}>
        
          <label>
            Nuevo Nombre:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label>
            Teléfono:
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>


          <h3>🔐 Cambiar Contraseña</h3>
          <input
            type="password"
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />


    

          <label className="photo-upload-label">
            <FaCamera className="icon" /> Subir Foto de Perfil:
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>

          <button type="submit" className="save-button">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;




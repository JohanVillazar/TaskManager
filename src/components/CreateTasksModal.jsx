import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";
import "./CreateTasksModal.css";


Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    padding: '2rem',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: 'none',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    zIndex: 9999,
  },
}

const CreateTaskModal = ({ isOpen, onRequestClose, onTaskCreated, onClose, isAdminView = false }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Media");
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [usersList, setUsersList] = useState([]);
  const { user } = useAuth();
  const { addTask } = useTasks();

  // Cargar usuarios si es vista admin
  useEffect(() => {
    if (isAdminView) {
      const fetchUsers = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("https://tasksapi-0jsn.onrender.com/api/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setUsersList(data);
        } catch (error) {
          console.error("Error al cargar usuarios:", error);
        }
      };

      fetchUsers();
    }
  }, [isAdminView]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token no encontrado. Debes iniciar sesión.");
      return;
    }

    const newTask = {
      title,
      description,
      priority,
      user_id: isAdminView ? assignedUserId : user.id,
      note,
      dueDate,
    };

    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error("Error al crear tarea");

      const createdTask = await response.json();
      addTask(createdTask);
      onTaskCreated?.(); // Si lo envías como prop, lo ejecuta
      onRequestClose();

      // Resetear campos
      setTitle("");
      setDescription("");
      setPriority("Media");
      setNote("");
      setDueDate("");
      setAssignedUserId("");
      onClose?.();
    } catch (error) {
      console.error("Error al enviar tarea:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Crear nueva tarea"
      style={customStyles}
    >
      <h2>Crear Nueva Tarea</h2>
<form onSubmit={handleSubmit} className="task-modal-form">
  <div>
    <label>Título:</label>
    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
  </div>

  <div>
    <label>Descripción:</label>
    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
  </div>

  <div>
    <label>Prioridad:</label>
    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
      <option value="Alta">Alta</option>
      <option value="Media">Media</option>
      <option value="Baja">Baja</option>
    </select>
  </div>

  <div>
    <label>Notas / Avance:</label>
    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
  </div>

  <div>
    <label>Fecha de vencimiento:</label>
    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
  </div>

  {isAdminView && (
    <div>
      <label>Asignar a Usuario:</label>
      <select value={assignedUserId} onChange={(e) => setAssignedUserId(e.target.value)} required>
        <option value="">-- Seleccionar Usuario --</option>
        {usersList.map((u) => (
          <option key={u.id} value={u.id}>
            {u.email}
          </option>
        ))}
      </select>
    </div>
  )}

  <div className="task-modal-buttons">
    <button type="submit">Crear</button>
    <button type="button" onClick={onRequestClose}>Cancelar</button>
  </div>
</form>

    </Modal>
  );
};

export default CreateTaskModal;



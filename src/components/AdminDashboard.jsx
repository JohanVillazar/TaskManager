// src/components/admin/AdminDashboard.jsx
import React, { useEffect } from "react";
import { useState } from "react";
import { FaTasks, FaCheckCircle, FaUser, FaUserShield } from "react-icons/fa";
import AdminCharts from './Admin/AdminCharts';
import "../styles/AdminDashboard.css";
import CreateTasksModal from "./CreateTasksModal"
import { toast } from "react-toastify";
import CreateUserModal from "./Admin/CreateUserModal";
import TaskList from "./Admin/TaskList";
import { useAuth } from "../context/AuthContext";


const AdminDashboard = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const { logout } = useAuth();

  const openTaskModal = () => setIsTaskModalOpen(true);
  const closeTaskModal = () => setIsTaskModalOpen(false);
  const openUserModal = () => setIsUserModalOpen(true);
  const closeUserModal = () => setIsUserModalOpen(false);

 
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const tasksRes = await fetch("https://tasksmanagerback.onrender.com/admin/summary/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersRes = await fetch("https://tasksmanagerback.onrender.com/admin/summary/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const taskData = await tasksRes.json();
      const userData = await usersRes.json();

      setTaskStats(taskData);
      setUserStats(userData);
    } catch (error) {
      console.error("Error al cargar estadísticas del dashboard:", error);
    }
  };

  
  const fetchTasks = async () => {
    try {
      const response = await fetch("https://tasksmanagerback.onrender.com/admin/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    }
  };

    const handleRefresh = () => {
    fetchStats();
    fetchTasks();
  };

  const handleTaskCreated = () => {
    toast.success("✅ Tarea asignada correctamente", {
      position: "top-right",
      autoClose: 3000,
    });
    closeTaskModal();
    fetchTasks();
  };

  const handleUserCreated = (newUser) => {
    console.log("Usuario creado por admin:", newUser);
   
  };

  const handleDelete = async (taskId) => {
    if (confirm("¿Estás seguro de eliminar esta tarea?")) {
      try {
        await fetch(`https://tasksmanagerback.onrender.com/tasks/${taskId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (error) {
        console.error("Error al eliminar tarea:", error);
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    fetchStats();
    fetchTasks();
  }, []);
 


return (
  <div className="admin-dashboard">
    <h2 className="dashboard-title">Panel de Administración</h2>

    <div className="dashboard-actions-section">
      <h3 className="dashboard-subtitle">Acciones Rápidas</h3>

      <div className="actions-buttons">
        <button onClick={openUserModal} className="action-btn">+ Crear Nuevo Usuario</button>
        <button className="action-btn" onClick={openTaskModal}>
          + Crear y Asignar Nueva Tarea
        </button>

        <button onClick={handleRefresh} className="action-btn"> Refrescar Dashboard</button>

        <button onClick={handleLogout} className="action-btn"> Cerrar sesión</button>

      </div>
    </div>

    {/* SECCIÓN 1: Tarjetas Resumen */}
    <div className="dashboard-summary-section">
      {/* Grupo de tarjetas: Tareas */}
      <div className="summary-group">
        <h3 className="dashboard-subtitle">Tareas</h3>
        <div className="cards-container">
          <div className="dashboard-card total">
            <FaTasks className="card-icon" />
            <h3>Total de Tareas</h3>
            <p>{taskStats?.totalTasks || 0}</p>
          </div>
          <div className="dashboard-card pending">
            <FaCheckCircle className="card-icon" />
            <h3>Tareas Pendientes</h3>
            <p>{taskStats?.statusSummary?.find(s => s.status === "pendiente")?.count || 0}</p>
          </div>
          <div className="dashboard-card inprogress">
            <FaCheckCircle className="card-icon" />
            <h3>Tareas En Progreso</h3>
            <p>{taskStats?.statusSummary?.find(s => s.status === "en progreso")?.count || 0}</p>
          </div>
          <div className="dashboard-card completed">
            <FaCheckCircle className="card-icon" />
            <h3>Tareas Completadas</h3>
            <p>{taskStats?.statusSummary?.find(s => s.status === "completada")?.count || 0}</p>
          </div>
        </div>
      </div>

      {/* Grupo de tarjetas: Usuarios */}
      <div className="summary-group">
        <h3 className="dashboard-subtitle">Usuarios</h3>
        <div className="cards-container">
          <div className="dashboard-card users">
            <FaUser className="card-icon" />
            <h3>Total de Usuarios</h3>
            <p>{userStats?.totalUsers || 0}</p>
          </div>
          <div className="dashboard-card admins">
            <FaUserShield className="card-icon" />
            <h3>Administradores</h3>
            <p>{userStats?.roleSummary?.admin || 0}</p>
          </div>
        </div>
      </div>
    </div>

   
    <div className="dashboard-charts-section">
      <h3 className="dashboard-subtitle">Visualización de datos</h3>
      <div className="charts-row">
        <AdminCharts
          tasksSummary={taskStats?.statusSummary}
          usersSummary={userStats?.roleSummary}
        />
      </div>
    </div>
    <div>
    <h2>Listado de Tareas</h2>
<table className="task-table">
  <thead>
    <tr>
      <th>Título</th>
      <th>Descripción</th>
      <th>Prioridad</th>
      <th>Estado</th>
      <th>Creación</th>
      <th>Vencimiento</th>
      <th>Dias para Vencimiento</th>
      <th>Asignado a</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {tasks.map(task => (
      <tr key={task.id}>
        <td>{task.title}</td>
        <td>{task.description}</td>
        <td>
          <span
            className={`priority-badge ${
              task.priority === "Alta"
                ? "priority-alta"
                : task.priority === "Media"
                  ? "priority-media"
                  : "priority-baja"
              }`}
          >
            {task.priority}
          </span>

        </td>

        <td>
          <span className={`status-badge ${task.status?.toLowerCase().replace(/\s+/g, '')}`}>
            {task.status}
          </span>
        </td>
        <td>{new Date(task.createdAt).toLocaleDateString()}</td>
        <td>{new Date(task.dueDate).toLocaleDateString()}</td>
        <td>
          {Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} días
        </td>
        <td>{task.User?.email}</td>
        <td>
          <button className="btn-delete" onClick={() => handleDelete(task.id)}>
            Eliminar
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>


    

    <CreateTasksModal
  isOpen={isTaskModalOpen}
  onRequestClose={closeTaskModal}
  onTaskCreated={handleTaskCreated}
  isAdminView={true}
  
/>
<CreateUserModal
        isOpen={isUserModalOpen}
        onRequestClose={closeUserModal}
        onUserCreated={handleUserCreated}
      />
    
  

  </div>
  
);

};

export default AdminDashboard;
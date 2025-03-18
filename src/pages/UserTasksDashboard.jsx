import React, { useEffect, useState } from 'react';
import '../styles/UserTasksDashboard.css';

const UserTasksDashboard = () => {
const [filterStatus, setFilterStatus] = useState("");
const [filterPriority, setFilterPriority] = useState("");

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/tasks/my-tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error('Error al cargar tareas del usuario:', error);
      }
    };

    fetchUserTasks();
  }, []);

    const filteredTasks = tasks.filter(task => {
    const matchStatus = filterStatus === "" || task.status.toLowerCase() === filterStatus;
    const matchPriority = filterPriority === "" || task.priority === filterPriority;
    return matchStatus && matchPriority;
  });


  return (
    <div className="user-dashboard">
      <h2>📋 Mis Tareas</h2>
  
      <div className="filters">
        <label>
          Estado:
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En progreso</option>
            <option value="completada">Completada</option>
          </select>
        </label>
  
        <label>
          Prioridad:
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </label>
       
      </div>
  
      {/* ⬇️ ACÁ VA el bloque del map */}
      <div className="task-list">
        {filteredTasks.map(task => (
          <div key={task.id} className="task-cards">
            <strong>{task.title}</strong>
            <div className="task-meta">
              <span className={`badge badge-${task.status.replace(/\s+/g, '-').toLowerCase()}`}>
                {task.status}
              </span>
              <span className={`badge badge-${task.priority}`}>
                {task.priority}
              </span>
              <span className={`badge badge-${task.description}`}>
                {task.description}
              </span>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
  ;
};

export default UserTasksDashboard;

// AdminTaskList.jsx
import React, { useEffect, useState, useContext } from 'react';
import './TaskList.css';
import { AuthContext } from '../../context/AuthContext';

const AdminTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const { auth } = useContext(AuthContext); // para el token

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log('Intentando obtener tareas...');
        const response = await fetch('http://localhost:3000/admin/tasks', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        const data = await response.json();
        console.log('Tareas obtenidas:', data); // <-- Aquí deberías ver algo
        setTasks(data);
      } catch (error) {
        console.error('Error al obtener tareas:', error);
      }
    };

    fetchTasks();
  }, [auth.token]);

  const handleDelete = async (taskId) => {
    const confirm = window.confirm('¿Seguro que deseas eliminar esta tarea?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
      } else {
        console.error('Error al eliminar tarea');
      }
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
    }
  };

  return (
    <div className="admin-task-list-container">
      <h2>Listado de Tareas</h2>
      <table className="admin-task-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>

            <th>Prioridad</th>
            <th>Estado</th>
            <th>Asignado a</th>
            <th>Fecha de Creación</th>
            <th>Fecha de Vencimiento</th>
            <th>Días para Vencimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.status}</td>
              <td>{task.priority}</td>
              <td>{task.status}</td>
              <td>{task.user?.email || 'Sin asignar'}</td>
              <td>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : ''}</td>
              <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha'}</td>
              <td>
                {Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} días
              </td>
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
  );
};

export default AdminTaskList;

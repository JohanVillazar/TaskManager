import React from "react";
import "../styles/TasksByUserTable.css"; // (opcional para estilos)

const TasksByUserTable = ({ usersWithTasks }) => {
  return (
    <div className="tasks-by-user-table">
      <h3>Listado de Tareas por Usuario</h3>
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Cantidad de Tareas</th>
            <th>Estados de Tareas</th>
          </tr>
        </thead>
        <tbody>
          {usersWithTasks.map((user) => (
            <tr key={user.userId}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.tasks.length}</td>
              <td>
                {user.tasks.length === 0 ? (
                  "Sin tareas"
                ) : (
                  user.tasks.map((task, index) => (
                    <div key={index}>
                      {task.title} - <strong>{task.status}</strong>
                    </div>
                  ))
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksByUserTable;

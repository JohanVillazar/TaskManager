// src/context/TaskContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const res = await fetch("https://tasksapi-0jsn.onrender.com/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error cargando tareas:", err);
    }
  };

  const addTask = (createdTask) => {
    setTasks(prevTasks => Array.isArray(prevTasks) ? [...prevTasks, createdTask] : [createdTask]);
  };
  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, setTasks, loadTasks, addTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);

import { useEffect, useState } from "react";
import KanbanBoard from "../components/KanbanBoard";
import CreateTaskModal from "../components/CreateTasksModal";
import { useAuth } from "../context/AuthContext";
import { useTaskModal } from "../context/TaskModalContext";
import "./home.css";

function Home() {
  const { isModalOpen, closeModal } = useTaskModal();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { user, token } = useAuth();

  // ✅ Cargar tareas al montar
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3000/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      }
    };

    if (user) fetchTasks();
  }, [user, token]);

 

  // ✅ Función para agregar una nueva tarea al estado local
  const addTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div className="home-container">
    <h1>Orbit Task Manager</h1>
    <p>Puedes mover tus tareas entre columnas de estado.</p>
    <KanbanBoard />
    <CreateTaskModal isOpen={isModalOpen} onRequestClose={closeModal} />
  </div>
  );
}

export default Home;

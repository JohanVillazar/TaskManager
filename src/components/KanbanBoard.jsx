import { useState, useEffect } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import EditTaskModal from "./EditTaskModal";
import { useTasks } from "../context/TaskContext";
import "../styles/KanbanBoard.css";




const statuses = ["pendiente", "en progreso", "completada"];

function KanbanBoard() {
  const {tasks, setTasks,}  = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (!response.ok) {
          throw new Error("Error al obtener las tareas");
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]); // Si no es array, fallback seguro
          console.warn("La respuesta del backend no fue un array:", data);
        }

        
      } catch (error) {
        console.error("Error cargando tareas:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const draggedTask = tasks.find((task) => task.id === active.id);
    if (draggedTask?.status === "completada") {
      return; 
    }
  
    const newStatus = over.id;

    if (draggedTask.status === newStatus) return;
  
    // Actualizar estado en el frontend
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === active.id ? { ...task, status: newStatus } : task
      )
    );
  
    // Actualizar estado en la base de datos
    try {
      const token = localStorage.getItem("token");
  
      await fetch(`http://localhost:3000/tasks/${active.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Error al actualizar el estado en el backend:", error);
    }
  };
  



  const handleEditTask = (task) => {
    console.log("Abriendo tarea",task);
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleSaveTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    handleCloseModal();
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <>
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="kanban-container">
          {statuses.map((status) => (
            <SortableContext
              key={status}
              items={Array.isArray(tasks) ? tasks : []}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                status={status}
                tasks={Array.isArray(tasks) ? tasks.filter((task) => task.status === status) : []}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </SortableContext>
          ))}
        </div>
      </DndContext>
  
      {/* Modal de edición */}
      <EditTaskModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        task={taskToEdit}
        onSave={handleSaveTask}
      />
    </>
  );
}

export default KanbanBoard;

import { useDraggable } from "@dnd-kit/core";
import "../styles/taskcard.css";
import { FaEdit,FaRegFileAlt,FaFlag, FaStream, FaStickyNote, FaUser, FaCalendarAlt,   FaHourglassHalf, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import { useAuth } from "../context/AuthContext";


function TaskCard({ task, onEdit, onDelete }) {

  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });

  let formattedCreatedAt = "Sin fecha";
  if (task?.createdAt && !isNaN(new Date(task.createdAt))) {
    formattedCreatedAt = new Date(task.createdAt).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "Sin fecha de vencimiento";
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : {};
  const { user } = useAuth();


  const handleDelete = (taskId) => {

    if (user?.role !== "admin") {
      Swal.fire({
        icon: "warning",
        title: " ! No tienes Poder aquí ¡",
        text: "Solo los administradores pueden eliminar tareas.",
        confirmButtonText: "Aceptar",
      });
      return;
    }
    
    Swal.fire({
      title: 'Ups, alguien quiere eliminar esta tarea',
      text: '¿Estás seguro?.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
         
          const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            
          });
          console.log("Respuesta del backend al eliminar tarea:", response);

  
          if (!response.ok) {
            throw new Error("Error al eliminar la tarea");
            
          }
  
          
          toast.success("Tarea eliminada con éxito ✅");
          onDelete(taskId); 
  
        } catch (error) {
          console.error("Error al eliminar la tarea:", error);
          toast.error("Ocurrió un error al eliminar la tarea ❌");
        }
      }
    });
  };
  


  
  

  return (
    <div className="task-card" ref={setNodeRef} style={style}>
      <div {...listeners} {...attributes}>
        <h4>{task.title}</h4>
        <p><FaRegFileAlt className="icon" /> <strong>Descripción:</strong> {task.description}</p>
        <p><FaFlag className="icon" /> <strong>Prioridad:</strong> {task.priority}</p>
        <p><FaStream className="icon" /> <strong>Estado:</strong> {task.status}</p>
            {task.note && (
  <>
            <p><strong>Notas/Avance:</strong></p>
            {task.note.split('-').map((line, index) => (
              <p key={index} className="note-line">{line.trim()}</p>
              
            ))}
          </>
        )}
    
    <p><FaCalendarAlt className="icon" /> <strong>Fecha de Creación:</strong> {formattedCreatedAt}</p>
    <p><FaHourglassHalf className="icon" /> <strong>Fecha Vencimiento:</strong> {formattedDueDate}</p>
      </div>
      
      <button
  className={`edit-button ${task.status === "completada" ? "disabled" : ""}`}
  onClick={() => task.status !== "completada" && onEdit(task)}
  disabled={task.status === "completada"}
>
  <FaEdit style={{ marginRight: "6px" }} />
  Editar
</button>

{task.status === "completada" && (
  <button className="delete-button" onClick={() => handleDelete(task.id)}>
    <FaTrash /> Eliminar
  </button>
)}

    </div>
  );
}

export default TaskCard;



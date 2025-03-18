import { useState, useEffect } from "react";
import Modal from "react-modal";



Modal.setAppElement("#root");

const customStyles = {
  content: {
    width: "400px",
    maxHeight: "80vh",
    margin: "auto",
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    inset: "50% auto auto 50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  }
};

function EditTaskModal({ isOpen, onRequestClose, task, onSave }) {
  const [note, setNota] = useState("");

  useEffect(() => {
    if (task) {
      setNota(task.note || "");
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:3000/tasks/${task.id}/note`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ note }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la tarea");
      }

      const updatedTask = await response.json();
      console.log("Nota actualizada", updatedTask);

      onSave(updatedTask.task); // actualiza en el frontend
      onRequestClose(); // cierra el modal
    } catch (error) {
      console.error("Error actualizando tarea:", error);
    }
  };

  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Editar tarea"
      style={customStyles}
    >
      <h2 style={{ marginBottom: "16px", fontSize: "20px", textAlign: "center" }}>
        Editar Tarea
      </h2>

      <div style={{ marginBottom: "10px" }}>
        <strong>Título:</strong> <div>{task.title}</div>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Descripción:</strong> <div>{task.description}</div>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Prioridad:</strong> <div>{task.priority}</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label><strong>Notas/Avance:</strong></label>
          <textarea
            value={note}
            onChange={(e) => setNota(e.target.value)}
            rows={4}
            placeholder="Ej: nota 1 - nota 2 - nota 3"
            style={{
              width: "100%",
              resize: "none",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "4px"
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <button type="submit" style={{ padding: "6px 12px" }}>Guardar</button>
          <button type="button" onClick={onRequestClose} style={{ padding: "6px 12px" }}>Cerrar</button>
        </div>
      </form>
    </Modal>
  );
}

export default EditTaskModal;




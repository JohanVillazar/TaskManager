import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import "../styles/KanbanColumn.css";

function KanbanColumn({ status, tasks, onEditTask, onDeleteTask }) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
<div className="column" ref={setNodeRef}>
      <h2 className={`status-title ${status}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </h2>
      
      <div className="column-tasks-scroll">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export default KanbanColumn;

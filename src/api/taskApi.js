const API_URL = "https://tasksapi-0jsn.onrender.com/tasks?all=true";

export const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) throw new Error("Error al obtener las tareas");
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };



  export const createTask = async (taskData) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };
// src/context/TaskModalContext.jsx
import { createContext, useContext, useState } from "react";

const TaskModalContext = createContext();

export const TaskModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <TaskModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </TaskModalContext.Provider>
  );
};

export const useTaskModal = () => useContext(TaskModalContext);

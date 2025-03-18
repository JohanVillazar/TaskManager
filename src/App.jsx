import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import Home from "./pages/Home";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Register from "./components/Register";
import CreateTaskModal from "./components/CreateTasksModal";
import { TaskModalProvider } from "./context/TaskModalContext";
import { TaskProvider } from "./context/TaskContext";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./components/UserProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./components/AdminDashboard";
import AdminRoute from "../src/Routes/AdminRoute"
import Modal from "react-modal";
import UserTasksDashboard from "./pages/UserTasksDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
Modal.setAppElement("#root");

function Layout() {
  const location = useLocation();

  const hideSidebar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password/" ||
    location.pathname.startsWith("/reset-password/") ||
    location.pathname === "/admin-dashboard" || 
    location.pathname === "/";

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  return (
    <div className="app-container">
      {!hideSidebar && <Sidebar onCreateTaskClick={openCreateModal} />}

      <main className={`content ${hideSidebar ? "expanded" : ""}`}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
           <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/my-tasks"
            element={
              <ProtectedRoute>
                <UserTasksDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <CreateTaskModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />
    </div>
  );
}

function App() {
  const { user } = useContext(AuthContext);
  return (
    <TaskProvider>
      <TaskModalProvider>
        <Router>
          
          <ToastContainer position="top-right" autoClose={3000} />
          <Layout />
        </Router>
      </TaskModalProvider>
    </TaskProvider>
  );
}


export default App;


// components/admin/AdminCharts.jsx
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import "./AdminCharts.css";


ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminCharts = ({ tasksSummary = [], usersSummary = {} }) => {
  // Gráfico de barras: tareas por estado
  const taskBarData = {
    labels: tasksSummary?.map((item) => item.status),
    datasets: [
      {
        label: 'Cantidad de Tareas',
        data: tasksSummary?.map((item) => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Gráfico de pastel: usuarios por rol
  const userPieData = {
    labels: Object.keys(usersSummary || {}),
    datasets: [
      {
        label: 'Usuarios por Rol',
        data: Object.values(usersSummary || {}),
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return (
    <div className="admin-charts">
      <div className="chart-container">
        <h4>Distribución de tareas por estado</h4>
        <Bar data={taskBarData} />
      </div>

      <div className="chart-container">
        <h4>Distribución de usuarios por rol</h4>
        <Pie data={userPieData} />
      </div>
    </div>
  );
};

export default AdminCharts;

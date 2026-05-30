import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { authApi, user } = useAuth();
  const [stats, setStats] = useState({ total_users: 0, total_prescriptions: 0, total_medicines: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await authApi.get("/dashboard");
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard data.");
      }
    }
    loadStats();
  }, [authApi]);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome back, {user?.name}. Your role is <strong>{user?.role}</strong>.</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row gy-3">
        <div className="col-md-4">
          <div className="card shadow-sm border-primary">
            <div className="card-body">
              <h5 className="card-title">Users</h5>
              <p className="display-6">{stats.total_users}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-success">
            <div className="card-body">
              <h5 className="card-title">Prescriptions</h5>
              <p className="display-6">{stats.total_prescriptions}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-warning">
            <div className="card-body">
              <h5 className="card-title">Medicines</h5>
              <p className="display-6">{stats.total_medicines}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="py-4">
      <h1>Prescription Management System</h1>
      <p className="lead">
        Manage prescriptions, medicines, and user access with role-based authentication.
      </p>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Roles</h5>
              <ul>
                <li>Doctor</li>
                <li>Patient</li>
                <li>Pharmacist</li>
                <li>Admin</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Getting Started</h5>
              {user ? (
                <p>
                  Visit <Link to="/dashboard">Dashboard</Link> to review statistics and manage records.
                </p>
              ) : (
                <>
                  <p>
                    To access the application, please <Link to="/login">login</Link> or <Link to="/register">register</Link>.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

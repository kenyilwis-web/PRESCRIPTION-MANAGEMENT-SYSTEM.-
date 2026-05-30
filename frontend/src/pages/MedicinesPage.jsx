import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function MedicinesPage() {
  const { authApi, user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", stock: 0, price: 0.0 });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMedicines();
  }, [authApi]);

  const loadMedicines = async () => {
    try {
      const response = await authApi.get("/medicines");
      setMedicines(response.data.medicines);
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to load medicines.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await authApi.post("/medicines", form);
      setMessage("Medicine added successfully.");
      setForm({ name: "", description: "", stock: 0, price: 0.0 });
      loadMedicines();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not add medicine.");
    }
  };

  const deleteMedicine = async (id) => {
    try {
      await authApi.delete(`/medicines/${id}`);
      setMessage("Medicine deleted.");
      loadMedicines();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to delete medicine.");
    }
  };

  return (
    <div>
      <h2>Medicine Inventory</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {user?.role === "pharmacist" && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Add New Medicine</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-success">
                Add Medicine
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="row gy-3">
        {medicines.map((medicine) => (
          <div className="col-md-4" key={medicine.id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{medicine.name}</h5>
                <p>{medicine.description}</p>
                <p>
                  <strong>Stock:</strong> {medicine.stock}
                </p>
                <p>
                  <strong>Price:</strong> ${medicine.price.toFixed(2)}
                </p>
                {user?.role === "pharmacist" && (
                  <button className="btn btn-outline-danger btn-sm" onClick={() => deleteMedicine(medicine.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

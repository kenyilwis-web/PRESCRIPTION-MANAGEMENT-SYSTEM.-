import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function PrescriptionsPage() {
  const { authApi, user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState({ patient_name: "", instructions: "", medicine_ids: [] });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, [authApi]);

  const fetchData = async () => {
    try {
      const [prescriptionsRes, medicinesRes] = await Promise.all([
        authApi.get("/prescriptions"),
        authApi.get("/medicines"),
      ]);
      setPrescriptions(prescriptionsRes.data.prescriptions);
      setMedicines(medicinesRes.data.medicines);
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to load prescriptions.");
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      await authApi.post("/prescriptions", formData);
      setMessage("Prescription created successfully.");
      setFormData({ patient_name: "", instructions: "", medicine_ids: [] });
      fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not create prescription.");
    }
  };

  const handleDispense = async (id) => {
    try {
      await authApi.post(`/prescriptions/${id}/dispense`);
      setMessage("Prescription dispensed.");
      fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to dispense prescription.");
    }
  };

  const toggleMedicine = (id) => {
    setFormData((prev) => {
      const set = new Set(prev.medicine_ids);
      if (set.has(id)) {
        set.delete(id);
      } else {
        set.add(id);
      }
      return { ...prev, medicine_ids: Array.from(set) };
    });
  };

  return (
    <div>
      <h2>Prescriptions</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {user?.role === "doctor" && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Create Prescription</h5>
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label">Patient Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Instructions</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Medicines</label>
                <div className="row">
                  {medicines.map((medicine) => (
                    <div className="col-md-4" key={medicine.id}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={medicine.id}
                          checked={formData.medicine_ids.includes(medicine.id)}
                          onChange={() => toggleMedicine(medicine.id)}
                          id={`medicine-${medicine.id}`}
                        />
                        <label className="form-check-label" htmlFor={`medicine-${medicine.id}`}>
                          {medicine.name}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-success">
                Add Prescription
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="row gy-3">
        {prescriptions.map((prescription) => (
          <div className="col-md-6" key={prescription.id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{prescription.patient_name}</h5>
                <p className="card-text">Doctor: {prescription.doctor?.name}</p>
                <p>{prescription.instructions}</p>
                <p className="mb-1">
                  <strong>Medicines:</strong>{" "}
                  {prescription.medicines.map((medicine) => medicine.name).join(", ")}
                </p>
                {user?.role === "pharmacist" && (
                  <button className="btn btn-outline-primary btn-sm" onClick={() => handleDispense(prescription.id)}>
                    Dispense
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

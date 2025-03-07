import { useState, useEffect } from "react";
import DoctorsList from "./DoctorsList";
import DoctorForm from "./DoctorForm";
import { apiClient } from "../../api";

function Doctors({ onSelectDoctor }) {
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await apiClient.get("/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleSave = async (updatedDoctor) => {
    try {
      if (updatedDoctor._id) {
        // Update existing doctor
        await apiClient.put(`/doctors/${updatedDoctor._id}`, updatedDoctor);
      } else {
        // Add new doctor
        await apiClient.post("/doctors", updatedDoctor);
      }
      await fetchDoctors();
      setEditingDoctor(null);
    } catch (error) {
      console.error("Error saving doctor:", error);
    }
  };

  const handleDelete = async (doctorId) => {
    const confirmed = window.confirm("Are you sure you want to delete this doctor?");
    if (!confirmed) return;

    try {
      await apiClient.delete(`/doctors/${doctorId}`);
      await fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const handleSelectDoctor = (doctor) => {
    onSelectDoctor(doctor.videoUrl);
  };

  return (
    <div>
      {editingDoctor ? (
        <DoctorForm 
          doctor={editingDoctor} 
          onSave={handleSave}
          onCancel={() => setEditingDoctor(null)}
        />
      ) : (
        <DoctorsList 
          doctors={doctors} 
          onEdit={setEditingDoctor} 
          onAdd={() => setEditingDoctor({})} // Open empty form for new doctor
          onDelete={handleDelete}
          onSelectDoctor={handleSelectDoctor}
        />
      )}
    </div>
  );
}

export default Doctors;
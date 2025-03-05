import { useState, useEffect } from "react";
import DoctorsList from "./Components/Doctors/DoctorsList";
import DoctorForm from "./Components/Doctors/DoctorForm";
import { apiClient } from "./api";

function App() {
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
    if (updatedDoctor._id) {
      // Update existing doctor
      await apiClient.put(`/doctors/${updatedDoctor._id}`, updatedDoctor);
    } else {
      // Add new doctor
      await apiClient.post("/doctors", updatedDoctor);
    }
    await fetchDoctors();
    setEditingDoctor(null);
  };

  return (
    <div className="h-screen flex items-start p-6">
      <div className="w-3/5 bg-blue-100 p-6">
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
          />
        )}
      </div>

      <div className="w-2/5 bg-green-100 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-green-700">Right Column (40%)</h1>
      </div>
    </div>
  );
}

export default App;

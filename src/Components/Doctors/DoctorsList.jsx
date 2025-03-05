import { useEffect, useState } from "react";
import { apiClient } from "../../api";

function DoctorsList({ onEdit, onAdd }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    apiClient.get("/doctors")
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []);

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Doctors List</h1>
    
    {/* Add Button */}
    <button 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded" 
        onClick={() => onAdd()}
      >
        Add Doctor
      </button>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Designation</th>
            <th className="border p-2">Degree</th>
            <th className="border p-2">Mobile</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr 
                key={doctor._id || doctor.email} // Ensure unique key
                className={`border cursor-pointer 
                ${selectedDoctor?._id === doctor._id ? "bg-blue-500" : "hover:bg-gray-100"}`}
                onClick={() => setSelectedDoctor(doctor)}
            >
              <td className="border p-2">{doctor.name}</td>
              <td className="border p-2">{doctor.designation}</td>
              <td className="border p-2">{doctor.degree}</td>
              <td className="border p-2">{doctor.mobile}</td>
              <td className="border p-2">{doctor.email}</td>
              <td className="border p-2">
                <button className="px-3 py-1 bg-yellow-500 text-white rounded mr-2" onClick={() => onEdit(doctor)}>Edit</button>
                <button className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorsList;

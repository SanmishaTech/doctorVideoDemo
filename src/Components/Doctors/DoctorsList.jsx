import { useState } from "react";
import { FaVideo } from 'react-icons/fa'; // Import a video icon from react-icons
import "./DoctorsList.css"; // Import the CSS file for styling

function DoctorsList({ doctors, onEdit, onAdd, onDelete, onSelectDoctor }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleRowClick = (doctor) => {
    setSelectedDoctor(doctor);
    onSelectDoctor(doctor);
  };

  return (
    <div className="doctors-list-container">
      <h1 className="text-2xl font-bold mb-4">Doctors List</h1>
    
      {/* Add Button */}
      <button 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded" 
        onClick={() => onAdd()}
      >
        Add Doctor
      </button>

      <div className="table-responsive">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Designation</th>
              <th className="border p-2">Degree</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Video</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr 
                key={doctor._id || doctor.email} // Ensure unique key
                className={`border cursor-pointer 
                ${selectedDoctor?._id === doctor._id ? "bg-blue-500" : "hover:bg-gray-100"}`}
                onClick={() => handleRowClick(doctor)}
              >
                <td className="border p-2">
                  <a 
                    href={`/record/${doctor.videoId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-500 underline"
                  >
                    {doctor.name}
                  </a>
                </td>
                <td className="border p-2">{doctor.designation}</td>
                <td className="border p-2">{doctor.degree}</td>
                <td className="border p-2">{doctor.mobile}</td>
                <td className="border p-2">{doctor.email}</td>
                <td className="border p-2 text-center">
                  {doctor.videoUrl && <FaVideo className="text-black-500" />}
                </td>              
                <td className="border p-2">
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded mr-2" onClick={(e) => { e.stopPropagation(); onEdit(doctor); }}>Edit</button>
                  <button 
                    className="px-3 py-1 bg-red-500 text-white rounded" 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering row click
                      onDelete(doctor._id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DoctorsList;

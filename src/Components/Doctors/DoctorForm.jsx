import { useState, useEffect } from "react";
import Joi from "joi";

function DoctorForm({ doctor, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    degree: "",
    mobile: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Joi Schema Validation
  const schema = Joi.object({
    _id: Joi.string().allow("").optional(),
    name: Joi.string().min(3).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),
    designation: Joi.string().allow("").optional(),
    degree: Joi.string().allow("").optional(),
    mobile: Joi.string().allow("").optional(),
    videoId: Joi.string().allow("").optional()
  });

  // ✅ Set form values if editing
  useEffect(() => {
    if (doctor && doctor._id) {
      setFormData(doctor);
    }
  }, [doctor]);

  // ✅ Validation function
  const validate = () => {
    const formDataToValidate = { ...formData };
    delete formDataToValidate.__v;  // ✅ Remove MongoDB `__v`    
    const { error } = schema.validate(formDataToValidate, { abortEarly: false });
    if (!error) {
      setErrors({});
      return true;
    }

    const newErrors = {};
    error.details.forEach((err) => {
      newErrors[err.path[0]] = err.message;
    });
    setErrors(newErrors);
    console.log("Validation Errors:", newErrors);
    return false;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear errors on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Stop submission if validation fails

    if (isSubmitting) return;
    setIsSubmitting(true);
    console.log("Submitting Data:", formData);

    try {
      await onSave(formData); // Call parent to save data
    } catch (error) {
      console.error("Error saving doctor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">{doctor?._id ? "Edit Doctor" : "Add Doctor"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Name" 
            className="w-full p-2 border rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Email" 
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Other Fields */}
        <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" className="w-full p-2 border rounded"/>
        <input type="text" name="degree" value={formData.degree} onChange={handleChange} placeholder="Degree" className="w-full p-2 border rounded"/>
        <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" className="w-full p-2 border rounded"/>
        
        {/* Buttons */}
        <div className="flex gap-4">
          <button 
            type="submit" 
            className={`px-4 py-2 text-white rounded ${isSubmitting ? "bg-gray-400" : "bg-blue-500"}`} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default DoctorForm;

import React, { useState } from "react";
import axios from "../api/axiosConfig"; // withCredentials: true already set in this instance

function AddPackageForm({ refreshPackages }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/packages", formData);
      setMessage("Package added successfully!");
      setFormData({ name: "", description: "", price: 0, imageUrl: "" });
      if (refreshPackages) refreshPackages();
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.response?.data || "Failed to add package.");
    }
  };

  return (
    <div>
      <h2>Add Travel Package</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Package Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="number"
          name="price"
          placeholder="Price"
          min="0"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Add Package</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddPackageForm;

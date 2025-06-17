import React, { useState } from "react";
import axios from "../api/axiosConfig"; // Make sure this instance has withCredentials

function AddPackage({ refreshPackages }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({
      ...fd,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/packages", formData, {
        withCredentials: true, // Ensures cookies/session are sent
        headers: {
          "Content-Type": "application/json",
        },
      });
      setFormData({ name: "", description: "", price: 0 });
      refreshPackages(); // optional: refresh package list
    } catch (err) {
      console.error("Failed to add package:", err.response?.data || err.message);
      alert(err.response?.data || "Error adding package");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Package Name"
        required
      />
      <br />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <br />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        min="0"
        step="0.01"
        placeholder="Price"
        required
      />
      <br />
      <button type="submit">Add Package</button>
    </form>
  );
}

export default AddPackage;

import React, { useState } from "react";
import AddressInput from "./AddressInput";

const ListingForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    file: null,
    title: "",
    description: "",
    quantity: 0,
    category: "",
    location: "",
    previewUrl: null,
    isUrgent: false,
    dietryRestric: "",
    price: 0,
    unit: "",
    expiresAt: "",
  });

  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (formData.previewUrl) {
        URL.revokeObjectURL(formData.previewUrl);
      }
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, file, previewUrl }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, location: coordinates });
  };

  const dietaryRestrictions = ["None", "Vegan", "Vegetarian", "Halal"];
  const categories = ["Fruit", "Vegetables", "Dairy", "Deli", "Dry Grocery", "Bakery"];
  const units = ["lb", "kg", "each"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-brightness-50">
      <div className="relative w-full max-w-lg bg-[#090303] rounded-lg shadow ">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-gray-100">Create Listing</h3>
          <button
            onClick={onClose}
            className="text-slate-100 hover:text-gray-100 rounded-lg p-1.5"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* File Upload Row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-slate-100 file:mr-4 file:py-1.5 file:px-3 file:rounded file:text-sm file:bg-green-50 file:text-green-800"
              />
            </div>
            {formData.previewUrl && (
              <img
                src={formData.previewUrl}
                alt="Preview"
                className="h-16 w-16 object-cover rounded"
              />
            )}
          </div>

          {/* Title and Category Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="w-full p-2 text-sm text-slate-100 placeholder-slate-400 bg-transparent border border-slate-700 rounded focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 text-sm text-slate-100 bg-transparent border border-slate-700 rounded focus:border-slate-500 focus:outline-none"
              >
                <option value="" className="text-slate-400">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="text-slate-800">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            rows="2"
            className="w-full p-2 text-sm text-slate-100 placeholder-slate-400 bg-transparent border border-slate-700 rounded focus:border-slate-500 focus:outline-none"
          />

          {/* Price, Quantity, Unit Row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="w-full p-2 text-sm text-slate-100 placeholder-slate-400 bg-transparent border border-slate-700 rounded focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Quantity"
                className="w-full p-2 text-sm text-slate-100 placeholder-slate-400 bg-transparent border border-slate-700 rounded focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full p-2 text-sm text-slate-100 bg-transparent border border-slate-700 rounded focus:border-slate-500 focus:outline-none"
              >
                <option value="" className="text-slate-400">Unit</option>
                {units.map((unit) => (
                  <option key={unit} value={unit} className="text-slate-800">
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dietary Restrictions and Expiry Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Dietary Restrictions
              </label>
              <select
                name="dietryRestric"
                value={formData.dietryRestric}
                onChange={handleInputChange}
                className="w-full p-2 text-sm text-slate-100 bg-transparent border border-slate-700 rounded focus:border-slate-500 focus:outline-none"
              >
                <option value="" className="text-slate-400">Dietary Restrictions</option>
                {dietaryRestrictions.map((restriction) => (
                  <option key={restriction} value={restriction} className="text-slate-800">
                    {restriction}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Post Expires At
              </label>
              <input
                type="datetime-local"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleInputChange}
                className="w-full p-2 text-sm text-slate-100 placeholder-slate-400 bg-transparent border border-slate-700 rounded focus:border-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <AddressInput
              address={address}
              setAddress={setAddress}
              coordinates={coordinates}
              setCoordinates={setCoordinates}
            />
          </div>

          {/* Urgent */}
          <div className="flex items-center mt-2 px-1">
            <input
              type="checkbox"
              name="isUrgent"
              checked={formData.isUrgent}
              onChange={handleInputChange}
              className="w-4 h-4 text-[#265646] rounded"
            />
            <label className="ml-2 text-sm text-slate-200">Urgent</label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-[#265646] text-white px-10 py-2 rounded hover:bg-green-800 transition-colors text-sm font-medium"
            >
              Post
            </button>
            <button
              className="px-5 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingForm;
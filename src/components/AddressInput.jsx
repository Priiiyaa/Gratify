import { GoogleMap, Marker } from "@react-google-maps/api";
import { useState } from "react";

const AddressInput = ({ address, setAddress, coordinates, setCoordinates }) => {
  const fetchCoordinates = async (e) => {
    e.preventDefault();
    const apiKey = "Your_Google_Maps_API_KEY";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        setCoordinates({ lat, lng });
      } else {
        alert("Invalid address! Try again.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      alert("Failed to fetch location. Try again.");
    }
  };

  const containerStyle = {
    width: "100%",
    height: "200px", // Increased height for better visibility
  };

  return (
    <div className="space-y-3">
      {/* Address Input and Button */}
      <div className="flex gap-3">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
          className="w-full p-2 text-sm text-slate-100 placeholder-slate-400 bg-transparent border border-slate-700 rounded focus:border-slate-500 focus:outline-none"
        />
        <button
          onClick={fetchCoordinates}
          className="p-2 text-slate-100 hover:bg-slate-700 transition-colors text-sm font-medium rounded-full border border-slate-700 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </div>

      {/* Map Display */}
      {coordinates && (
        <div className="col-span-2">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: coordinates.lat, lng: coordinates.lng }}
            zoom={16}
            options={{
              styles: [
                {
                  featureType: "all",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#ffffff" }], // White text for better visibility
                },
                {
                  featureType: "all",
                  elementType: "labels.text.stroke",
                  stylers: [{ color: "#000000" }], // Black stroke for contrast
                },
              ],
            }}
          >
            <Marker position={{ lat: coordinates.lat, lng: coordinates.lng }} />
          </GoogleMap>
        </div>
      )}
    </div>
  );
};

export default AddressInput;
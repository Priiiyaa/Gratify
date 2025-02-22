import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../config.js";
import toast from "react-hot-toast";
import ListingCard from "../components/ListCard";
import ListDetailView from "../components/ListDetailView";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    profileImage: "",
    address: {
      location: {
        lat: null,
        lng: null,
      },
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    category: "User",
  });
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [userListings, setUserListings] = useState([]); // State to store user's listings

  useEffect(() => {
    document.title = "Profile - Gratify";

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchUserData(user);
        await fetchUserListings(user); // Fetch user's listings
        getUserLocation();
      } else {
        toast.error("User not logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (user) => {
    try {
      const idToken = await user.getIdToken();
      const response = await axios.get(`http://localhost:3000/api/users/${user.uid}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (!response.data) {
        throw new Error("No user data received");
      }

      setForm({
        name: response.data.name || "",
        email: response.data.email || "",
        profileImage: response.data.profileImage || "",
        phoneNumber: response.data.phoneNumber || "",
        address: {
          location: {
            lat: response.data.address?.location?.lat || null,
            lng: response.data.address?.location?.lng || null,
          },
          street: response.data.address?.street || "",
          city: response.data.address?.city || "",
          state: response.data.address?.state || "",
          zipCode: response.data.address?.zipCode || "",
        },
        category: response.data.category || "User",
      });

      setDataFetched(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setForm((prevForm) => ({
            ...prevForm,
            address: {
              ...prevForm.address,
              location: {
                lat: latitude,
                lng: longitude,
              },
            },
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const fetchUserListings = async (user) => {
    try {
      const response = await axios.get("http://localhost:3000/api/foods", {
      });

      if (!response.data) {
        throw new Error("No listings data received");
      }

      // Filter listings to show only those posted by the current user
      const filteredListings = response.data.filter(
        (listing) => listing.user.uid === user.uid
      );

      setUserListings(filteredListings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to fetch listings");
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setForm((prevForm) => ({
        ...prevForm,
        address: {
          ...prevForm.address,
          [field]: value,
        },
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not logged in");
      }

      const idToken = await user.getIdToken();
      const response = await axios.put(
        `http://localhost:3000/api/users/${user.uid}`,
        form,
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      if (response.data) {
        setForm(response.data);
        toast.success("Profile updated!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleListingClick = (listing) => {
    setSelectedListing(listing);
  };

  const handleCloseBigView = () => {
    setSelectedListing(null);
  };

  if (!dataFetched) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const renderProfileContent = () => (
    <form className="max-w-2xl mx-auto mt-8 mb-5" onSubmit={handleSubmit}>
      <div className="flex justify-center mb-8">
        <div className="relative">
          <img 
            className="w-40 h-40 rounded-full object-cover border-4 border-gray-200" 
            src={form?.profileImage || "/default-avatar.png"} 
            alt="Profile picture"
          />
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
          Name
        </label>
        <input
          onChange={handleChange}
          type="text"
          id="name"
          name="name"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#c] focus:border-[#265646] block w-full p-2.5 disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="Enter your name"
          value={form.name}
          required
          disabled
        />
      </div>

      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
          Email
        </label>
        <input
          onChange={handleChange}
          type="email"
          id="email"
          name="email"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#265646] focus:border-[#265646] block w-full p-2.5 disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="Enter your email"
          value={form.email}
          required
          disabled
        />
      </div>

      <div className="mb-5">
        <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900">
          Phone Number
        </label>
        <input
          onChange={handleChange}
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#265646] focus:border-[#265646] block w-full p-2.5"
          placeholder="Enter your phone number"
          value={form.phoneNumber}
        />
      </div>

      <div className="mb-5">
        <label htmlFor="street" className="block mb-2 text-sm font-medium text-gray-900">
          Street
        </label>
        <input
          onChange={handleChange}
          type="text"
          id="street"
          name="address.street"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#265646] focus:border-[#265646] block w-full p-2.5"
          placeholder="Enter your street"
          value={form.address.street}
        />
      </div>

      <div className="mb-5">
        <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900">
          City
        </label>
        <input
          onChange={handleChange}
          type="text"
          id="city"
          name="address.city"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#265646] focus:border-[#265646] block w-full p-2.5"
          placeholder="Enter your city"
          value={form.address.city}
        />
      </div>

      <div className="mb-5">
        <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900">
          State
        </label>
        <input
          onChange={handleChange}
          type="text"
          id="state"
          name="address.state"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#265646] focus:border-[#265646] block w-full p-2.5"
          placeholder="Enter your state"
          value={form.address.state}
        />
      </div>

      <div className="mb-5">
        <label htmlFor="zipCode" className="block mb-2 text-sm font-medium text-gray-900">
          Zip Code
        </label>
        <input
          onChange={handleChange}
          type="text"
          id="zipCode"
          name="address.zipCode"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#265646] focus:border-[#265646] block w-full p-2.5"
          placeholder="Enter your zip code"
          value={form.address.zipCode}
        />
      </div>

      <div className="mb-5">
        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">
          Category
        </label>
        <select
          onChange={handleChange}
          id="category"
          name="category"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#265646] focus:border-[#265646] block w-full p-2.5"
          value={form.category}
          required
        >
          <option value="User">User</option>
          <option value="Business">Business</option>
          <option value="Charity">Charity</option>
        </select>
      </div>


      <button
        type="submit"
        className="text-white bg-[#265646] hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
        disabled={loading}
      >
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          </div>
        ) : (
          "Save"
        )}
      </button>
    </form>
  );

  const renderHistoryContent = () => (
    <div className="max-w-full mx-auto mt-8 mb-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center">
      {userListings.length === 0 && <p className="text-center col-span-3 mt-10 text-xl text-gray-500">No Listings Yet</p>}
        {userListings.map((item, index) => (

            <ListingCard
            key={index}
            data={item}
            isLoggedIn={true}
            onClick={() => handleListingClick(item)}
            />
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-5 px-6 pt-20">
      <h1 className="text-3xl font-bold text-center my-8">My Profile</h1>
      
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <ul className="flex justify-center -mb-px w-full">
          <li className="me-2 w-full">
            <button
              onClick={() => setActiveTab("profile")}
              className={`inline-block cursor-pointer w-full p-4 border-b-2 rounded-t-lg ${
                activeTab === "profile"
                  ? "text-[#265646] border-[#265646]"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              Profile
            </button>
          </li>
          <li className="me-2 w-full">
            <button
              onClick={() => setActiveTab("history")}
              className={`inline-block w-full cursor-pointer p-4 border-b-2 rounded-t-lg ${
                activeTab === "history"
                  ? "text-[#265646] border-[#265646]"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              History
            </button>
          </li>
        </ul>
      </div>

      {activeTab === "profile" ? renderProfileContent() : renderHistoryContent()}

      {selectedListing && (
        <ListDetailView
          listing={selectedListing}
          onClose={handleCloseBigView}
          isLoggedIn={true}
        />
      )}
    </div>
  );
};

export default Profile;
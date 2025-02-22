import React, { useEffect, useState } from "react";
import ListingCard from "../components/ListCard";
import { auth, storage } from "../config.js";
import ListingForm from "../components/ListingForm"; // Import the ListingForm component
import ListDetailView from "../components/ListDetailView";
import axios from "axios";
import toast from "react-hot-toast";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const dietaryRestrictions = ["None", "Vegan", "Vegetarian", "Halal"];
const categories = ["Fruit", "Vegetables", "Dairy", "Deli", "Dry Grocery", "Bakery"];

const Listing = () => {
  const [latitude, setLatitude] = useState("");
  const [data, setData] = useState([]);
  const [longitude, setLongitude] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModal, setActiveModal] = useState(false); // State to control the ListingForm modal
  const [selectedListing, setSelectedListing] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [mongoUserId, setMongoUserId] = useState(null);
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

  // State for Sort and Filter
  const [sortBy, setSortBy] = useState("price");
  const [filterByDietaryRestriction, setFilterByDietaryRestriction] = useState("None");
  const [filterByCategory, setFilterByCategory] = useState("All");
  const [filterByPrice, setFilterByPrice] = useState("All");

  useEffect(() => {
    document.title = "Profile - Gratify";

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchUserData(user);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
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

      // Store the MongoDB user ID
      setMongoUserId(response.data._id);
      setDataFetched(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const user = auth.currentUser;
      if (!user || !mongoUserId) {
        throw new Error("User not properly authenticated");
      }
  
      const idToken = await user.getIdToken();
      let imageURL = null;
  
      // Upload image to Firebase if a file exists
      if (formData.file) {
        try {
          const timestamp = Date.now();
          const fileName = `${timestamp}_${formData.file.name}`;
          const storageRef = ref(storage, `food-images/${fileName}`);
          
          const uploadResult = await uploadBytes(storageRef, formData.file);
          imageURL = await getDownloadURL(uploadResult.ref);
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
      }
  
      // Use MongoDB user ID instead of Firebase UID
      const foodData = {
        user: mongoUserId, // Use MongoDB _id instead of Firebase UID
        title: formData.title,
        description: formData.description,
        quantity: formData.quantity.toString(),
        category: formData.category,
        location: formData.location, // Use the location from formData
        imageURL: imageURL,
        isUrgent: Boolean(formData.isUrgent),
        dietryRestric: formData.dietryRestric,
        price: formData.price.toString(),
        unit: formData.unit,
        expiresAt: new Date(formData.expiresAt).toISOString(),
        comments: []
      };
  
      const response = await axios.post("http://localhost:3000/api/foods", foodData, {
        headers: { 
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
  
      toast.success("Food item posted successfully!");
  
      setActiveModal(false);
      resetForm();
      fetchListings();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(error.message || "Failed to create food item");
    }
  };

  const resetForm = () => {
    if (formData.previewUrl) {
      URL.revokeObjectURL(formData.previewUrl);
    }
    setFormData({
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
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) {
      return Number.MAX_VALUE; 
    }

    const R = 3959; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Number.isFinite(distance) ? distance : Number.MAX_VALUE;
  };


  const handleListingClick = (listing) => {
    setSelectedListing(listing); // Set the selected listing
  };

  const handleCloseBigView = () => {
    setSelectedListing(null); // Close the bigger view
  };

  const fetchListings = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/foods", {
      });

      setData(response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to fetch listings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Listings - Gratify";
    getUserLocation();
    fetchListings(); 
  }, []);

  

  

  // Apply sorting and filtering to the data
  const sortedAndFilteredData = React.useMemo(() => {
    const currentTime = new Date().getTime();

    const dataWithDistance = data
      // Filter out expired posts unless they're already being displayed
      .filter(item => {
        const expirationTime = new Date(item.expiresAt).getTime();
        return expirationTime > currentTime;
      })
      .map(item => {
        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          parseFloat(item.location?.lat),
          parseFloat(item.location?.lng)
        );


        const expirationTime = new Date(item.expiresAt).getTime();
        const isExpired = expirationTime <= currentTime;

        return {
          ...item,
          distance: distance === Number.MAX_VALUE ? null : Number(distance.toFixed(1)),
          numericPrice: item.price === "0" ? 0 : parseFloat(item.price) || 0,
          isExpired
        };
      });


    const filteredData = dataWithDistance.filter(item => {
      const matchesDietaryRestriction = filterByDietaryRestriction === "None" || 
                                      item.dietryRestric === filterByDietaryRestriction;
      
      const matchesCategory = filterByCategory === "All" || 
                            item.category === filterByCategory;
      
      const matchesPrice = filterByPrice === "All" || 
                          (filterByPrice === "Free" ? item.numericPrice === 0 : item.numericPrice > 0);

      return matchesDietaryRestriction && matchesCategory && matchesPrice;
    });


    return filteredData.sort((a, b) => {
      if (sortBy === "price") {
        return a.numericPrice - b.numericPrice;
      } else if (sortBy === "distance") {
        // Sort by distance, handling undefined/null values
        const distA = a.distance;
        const distB = b.distance;
        
        if (distA === distB) return 0;
        if (distA === Number.MAX_VALUE) return 1;
        if (distB === Number.MAX_VALUE) return -1;
        return distA - distB;
      }
      return 0;
    });
  }, [data, latitude, longitude, sortBy, filterByDietaryRestriction, filterByCategory, filterByPrice]);

  const sortOptions = [
    { value: "distance", label: "Distance" },
    { value: "price", label: "Price" }
  ];

  return (
    <>
      <div className="justify-center mt-16">
        {/* Sort and Filter Dropdowns */}
        <div className="px-4 py-4 flex gap-4 mb-4 fixed w-full bg-[#e4e4e4] z-50">
        <Dropdown 
            label="Sort By"
            options={sortOptions.map(opt => opt.label)}
            value={sortOptions.find(opt => opt.value === sortBy)?.label || "Distance"}
            onChange={(label) => {
              const option = sortOptions.find(opt => opt.label === label);
              setSortBy(option?.value || "distance");
            }}
          />
      
      <Dropdown 
        label="Dietary Restriction"
        options={dietaryRestrictions}
        value={filterByDietaryRestriction}
        onChange={setFilterByDietaryRestriction}
      />

      <Dropdown 
        label="Category"
        options={["All", ...categories]}
        value={filterByCategory}
        onChange={setFilterByCategory}
      />

      <Dropdown 
        label="Price"
        options={["All", "Free", "Paid"]}
        value={filterByPrice}
        onChange={setFilterByPrice}
      />
    </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 place-items-center py-20">
        {sortedAndFilteredData.map((item, index) => (
            <ListingCard
              key={index}
              data={{
                ...item,
                isUrgent: item.isExpired ? false : item.isUrgent,
                isExpired: item.isExpired
              }}
              isLoggedIn={isLoggedIn}
              distance={item.distance}
              onClick={() => handleListingClick(item)}
            />
          ))}
        </div>
      </div>

      {/* Plus Button */}
      {isLoggedIn && (
        <div className="fixed bottom-0 right-0 p-5">
          <button
            className="bg-[#265646] p-5 rounded-full text-white"
            onClick={() => setActiveModal(true)} // Open the ListingForm modal
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-plus"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
        </div>
      )}

      {/* ListingForm Modal */}
      {activeModal && (
        <ListingForm
          onSubmit={handleSubmit} // Pass the submit handler
          onClose={() => setActiveModal(false)} // Close the modal
        />
      )}

      {/* ListDetailView for Selected Listing */}
      {selectedListing && (
        <ListDetailView
          listing={selectedListing}
          onClose={handleCloseBigView}
          isLoggedIn={isLoggedIn}
        />
      )}
    </>
  );
};

const Dropdown = ({ label, options, value, onChange }) => {
    const [open, setOpen] = useState(false);
  
    return (
      <div className="relative inline-block w-64">
        <button
          onClick={() => setOpen(!open)}
          className="text-white bg-[#265646] hover:bg-[#1e4537] focus:ring-1 focus:outline-none focus:ring-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center w-full justify-between"
        >
          {label} <svg className="w-2.5 h-2.5 ml-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/></svg>
        </button>
  
        {open && (
          <div className="absolute z-10 mt-1 divide-y divide-gray-100 rounded-lg shadow-sm w-full bg-gray-950">
            <ul className="py-2 text-sm text-gray-200">
              {options.map((option, index) => (
                <li key={index}>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white "
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

export default Listing;
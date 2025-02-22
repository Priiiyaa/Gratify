import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { auth, googleProvider, signInWithPopup, signOut } from "../config.js";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [user, setUser] = useState(null); // State to store user data
  const navigate = useNavigate(); // Hook for navigation

  // Check if the user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setIsLoggedIn(true);
      setUser(user);

      const idToken = await user.getIdToken();

      // Check if user exists in the database
      const response = await axios.post(
        "http://localhost:3000/api/users",
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          phoneNumber: "",
          address: {
            street: "",
            city: "Unknown",
            state: "Unknown",
            zipCode: "Unknown",
            location: null,
          },
          role: "",
          category: "",
          profileImage: user.photoURL,
          rating: 0,
        },
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      // Redirect to profile page after login
      navigate("/profile");
      toast.success("Logged in successfully!")
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Error signing out:", error.message);
    }
  };

  return (
    <nav className="bg-[#090303] border-gray-200 text-white fixed top-0 w-full z-50">
      <div className="max-w-full pl-14 flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="/images/logoWhite.svg"
            className="h-10"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            Gratify
          </span>
        </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-[#090303] items-center">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/listing"
                className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0"
              >
                Listings
              </Link>
            </li>
            <li>
              <Link
                to="/leaderboard"
                className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0"
              >
                Leaderboard
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0"
                  >
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 md:p-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-log-out"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={handleLogin}
                  className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-green-800 md:border-0 md:hover:text-gray-200 md:px-7 bg-[#265646]"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
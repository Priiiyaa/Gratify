import React, { useEffect, useState } from "react";
import axios from "axios";
import {auth} from "../config.js"
import toast from "react-hot-toast";

const ListingDetailView = ({ listing, onClose, isLoggedIn }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(listing.comments || []); 
  const [mongoUserId, setMongoUserId] = useState(null);

  useEffect(() => {
    document.title = "Profile - Gratify";

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchUserData(user);
      } else {
        console.log("User not logged In")
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

  const handleLocationClick = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    if (listing?.location && listing?.location.lat && listing?.location.lng) {
      const url = `https://www.google.com/maps?q=${listing?.location.lat},${listing?.location.lng}`;
      window.open(url, "_blank");
    } else {
      alert("Location not available.");
    }
  };

  // Function to copy phone number to clipboard
  const handlePhoneClick = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    if (listing?.user?.phoneNumber) {
      navigator.clipboard.writeText(listing?.user?.phoneNumber).then(() => {
        alert("Phone number copied to clipboard!");
      });
    } else {
      alert("Phone number not available.");
    }
  };

  // Function to redirect to email app
  const handleEmailClick = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    if (listing?.user?.email) {
      const mailtoUrl = `mailto:${listing?.user?.email}`;
      window.location.href = mailtoUrl;
    } else {
      alert("Email not available.");
    }
  };


  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Don't add empty comments

    try {

      if (!isLoggedIn) {
        alert("You must be logged in to add a comment.");
        return;
      }

      // Prepare the comment data
      const commentData = {
        user: mongoUserId, // Use the user's UID
        text: newComment,
      };

      // Make a POST request to add the comment
      const response = await axios.post(
        `http://localhost:3000/api/foods/${listing._id}/comments`,
        commentData
      );

      // Update the local state with the new comment
      setComments([...comments, response.data.comments[response.data.comments.length - 1]]);
      setNewComment(""); // Clear the input field
      toast.success("Comment Posted!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.");
    }
  };

  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-brightness-50">
      <div className="relative w-full max-w-3xl bg-[#090303] border border-gray-700 rounded-lg shadow-sm p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
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
            className="lucide lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        {/* Bigger view content */}
        <div className="space-y-4">
          <img
            className="rounded-t-lg w-full h-64 object-cover"
            src={listing.imageURL}
            alt={listing.title}
          />
          <div className="p-5">
            <div className="flex items-center space-x-3 mb-4">
              <img
                className="w-10 h-10 rounded-full"
                src={listing.user.profileImage}
                alt="User"
              />
              <div>
                <p className="text-sm font-medium text-white">{listing.user.name}</p>
                <p className="text-xs text-gray-400">
                  Expires at {new Date(listing.expiresAt).toLocaleString()}
                </p>
              </div>
            </div>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
              {listing.title}
            </h5>
            <p className="mb-3 font-normal text-gray-400">
              {listing.description}
            </p>
            <div className="flex items-center justify-between my-8 text-md text-white">
              <span className="px-3 py-1 bg-gray-600 rounded-lg">
                Qty: {listing.quantity} {listing.unit}
              </span>
              <span className="px-3 py-1 bg-gray-600 rounded-lg text-lg">
                Price: {listing.price === "0" ? <b>Free</b> : `$${listing.price}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              {isLoggedIn && (
                <div>
                  <button className="inline-flex items-center px-3 py-2 font-medium text-center text-white bg-[#265646] rounded-md hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-800">
                    Reserve
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-4">
                {isLoggedIn && (
                  <>
                    <button className="p-2 text-gray-400 hover:text-[#265646]" onClick={handlePhoneClick}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-phone"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-[#265646]" onClick={handleEmailClick}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-mail"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </button>
                  </>
                )}
                <button className="p-2 text-gray-400 hover:text-[#265646]" onClick={handleLocationClick}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-map-pin"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </button>
                {/* Comments Dropdown */}
                <div className="relative">
                  <button
                    id="dropdownCommentsButton"
                    onClick={() => setShowComments(!showComments)}
                    className="p-2 text-gray-400 hover:text-[#265646] focus:outline-none"
                  >
                    <span className="absolute -top-1 -right-1 bg-green-900 text-green-300 text-xs font-medium px-2 py-1 rounded-full">
                      {comments.length}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-message-square-more"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      <path d="M8 10h.01" />
                      <path d="M12 10h.01" />
                      <path d="M16 10h.01" />
                    </svg>
                  </button>
                  {/* Dropdown menu */}
                  {showComments && (
                    <div
                      id="dropdownComments"
                      className="absolute right-0 bottom-15 z-50 w-[30em] mt-2 bg-white divide-y divide-gray-300 rounded-lg shadow-sm dark:bg-slate-800 drop-shadow-2xl"
                    >
                      <div className="block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-slate-800 dark:text-gray-100">
                        Comments
                      </div>
                      <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-48 overflow-y-auto">
                        {comments.map((comment, index) => (
                          <div
                            key={index}
                            className="flex px-4 py-3 hover:bg-gray-100 bg-slate-800"
                          >
                            <div className="shrink-0">
                              <img
                                className="rounded-full w-8 h-8"
                                src={listing.imageURL}
                                alt="User"
                              />
                            </div>
                            <div className="w-full ps-3">
                              <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-200">
                                {comment.text}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(comment.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {isLoggedIn && (
                        <div className="p-4">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Leave a comment..."
                            className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none"
                          />
                          <button
                            onClick={handleAddComment}
                            className="mt-2 w-full px-3 py-2 text-sm font-medium text-center text-white bg-gray-950 rounded-md hover:bg-gray-900"
                          >
                            Add Comment
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailView;
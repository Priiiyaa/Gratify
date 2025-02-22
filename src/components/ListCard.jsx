import React from "react";

const ListingCard = ({ data, isLoggedIn, onClick, distance }) => {
  const {
    user,
    title,
    description,
    quantity,
    price,
    location,
    imageURL,
    expiresAt,
    comments,
    unit,
    isUrgent,
    isExpired
  } = data;


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Function to open location in a new window
  const handleLocationClick = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    if (location && location.lat && location.lng) {
      const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
      window.open(url, "_blank");
    } else {
      alert("Location not available.");
    }
  };

  // Function to copy phone number to clipboard
  const handlePhoneClick = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    if (user.phoneNumber) {
      navigator.clipboard.writeText(user.phoneNumber).then(() => {
        alert("Phone number copied to clipboard!");
      });
    } else {
      alert("Phone number not available.");
    }
  };

  // Function to redirect to email app
  const handleEmailClick = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    if (user.email) {
      const mailtoUrl = `mailto:${user.email}`;
      window.location.href = mailtoUrl;
    } else {
      alert("Email not available.");
    }
  };

  return (
    <div
      className="md:min-w-md bg-[#090303] border border-gray-700 rounded-lg shadow-sm cursor-pointer relative"
      onClick={onClick} // Add onClick handler for the card
    >
      {isUrgent && <span class="absolute -right-3 -top-2 bg-red-800 text-gray-200 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Urgent</span>}
      {isExpired && <span class="absolute -right-3 -top-2 bg-red-800 text-gray-200 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Expired</span>}
      <a href="#">
        <img
          className="rounded-t-lg w-full h-48 object-cover"
          src={imageURL}
          alt={title}
        />
      </a>
      <div className="p-5">
        <div className="flex items-center space-x-3 mb-4">
          <img
            className="w-10 h-10 rounded-full"
            src={user.profileImage} // Replace with user profile picture URL if available
            alt="User"
          />
          <div>
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-gray-400">
              Expires at {formatDate(expiresAt)}
            </p>
          </div>
        </div>
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
            {title}
          </h5>
        </a>
        {description && (
          <p className="mb-3 font-normal text-gray-400">{description}</p>
        )}
        <div className="flex items-center justify-between my-8 text-md text-white">
          <span className="px-3 py-1 bg-gray-600 rounded-lg">
            Qty: {quantity} {unit}
          </span>
          <span className="px-3 py-1 bg-gray-600 rounded-lg text-lg">
            Price: {price === "0" ? <b>Free</b> : `$${price}`}
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
          <div className="flex w-full justify-end items-center">
            {/* Location Icon */}
            <button
              onClick={handleLocationClick}
              className="p-2 text-gray-400 hover:text-[#265646] flex gap-2 bg-gray-800 rounded-full"
              title="Open location"
            >
              <span>{distance} miles</span>
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

            {/* Comments Icon */}
            <button
              className="relative p-2 text-gray-400 hover:text-[#265646]"
              title="View comments"
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

            {isLoggedIn && (
              <>
                {/* Phone Icon */}
                <button
                  onClick={handlePhoneClick}
                  className="p-2 text-gray-400 hover:text-[#265646]"
                  title="Copy phone number"
                >
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

                {/* Email Icon */}
                <button
                  onClick={handleEmailClick}
                  className="p-2 text-gray-400 hover:text-[#265646]"
                  title="Send email"
                >
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
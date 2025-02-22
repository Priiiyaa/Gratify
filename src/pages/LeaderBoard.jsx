import React, { useEffect } from "react";

const LeaderBoard = () => {
  // Mock data for top 10 users
  const users = [
    { id: 1, name: "John Doe", points: 950, profileImage: "/avatar/0.jpeg" },
    { id: 2, name: "Jane Smith", points: 890, profileImage: "/avatar/1.jpeg" },
    { id: 3, name: "Alice Johnson", points: 850, profileImage: "/avatar/2.jpeg" },
    { id: 4, name: "Bob Brown", points: 820, profileImage: "/avatar/3.jpeg" },
    { id: 5, name: "Charlie Davis", points: 800, profileImage: "/avatar/4.jpeg" },
    { id: 6, name: "Eva Wilson", points: 780, profileImage: "/avatar/5.jpeg" },
    { id: 7, name: "Frank Miller", points: 760, profileImage: "/avatar/6.jpeg" },
    { id: 8, name: "Grace Lee", points: 740, profileImage: "/avatar/7.jpeg" },
    { id: 9, name: "Henry Garcia", points: 720, profileImage: "/avatar/8.jpeg" },
    { id: 10, name: "Ivy Martinez", points: 700, profileImage: "/avatar/9.jpeg" },
  ];

  useEffect(()=>{
    document.title = "LeaderBoard - Gratify";
  },[])

  return (
    <div className="min-h-screen bg-[#090303] text-white p-6 pt-25">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-center">Leaderboard</h1>
        <img className="w-10 h-10" src="images/king.png" alt="" />
        </div>
        <div className="bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 font-semibold text-lg border-b border-gray-700 pb-4">
              <div>Rank</div>
              <div>User</div>
              <div className="text-right">Points</div>
            </div>
            {users.map((user, index) => (
              <div
                key={user.id}
                className="grid grid-cols-3 gap-4 items-center py-4 border-b border-gray-700 last:border-b-0 hover:bg-[#262626] transition-colors"
              >
                <div className="flex items-center">
                  <span
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                        : index === 1
                        ? "bg-gradient-to-r from-gray-400 to-gray-600"
                        : index === 2
                        ? "bg-gradient-to-r from-yellow-700 to-yellow-900"
                        : "bg-gray-800"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{user.name}</span>
                </div>
                <div className="text-right">{user.points} pts</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
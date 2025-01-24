import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, fetchUserById } from "@/store/auth-slice";
import { AppDispatch, RootState } from "@/store/store";
import { UserFormData } from "@/common/formdata";
import { UserSearchIcon } from "lucide-react";

const UserSearch: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading } = useSelector((state: RootState) => state.auth);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<UserFormData[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const [selectedUser, setSelectedUser] = useState<UserFormData | null>(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers([]);
      return;
    }
    const filtered = users.filter(
      (user: UserFormData) =>
        user.role === "organization" &&
        (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, users.length]);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleUserClick = async (userId: string) => {
    try {
      const user = users.find((u: UserFormData) => u._id === userId);
      if (user) {
        setSelectedUser(user);
      } else {
        const { payload } = await dispatch(fetchUserById(userId));
        setSelectedUser(payload?.data || null);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      alert("Failed to fetch user details. Please try again.");
    }
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6 bg-gray-50">
      {/* Search Bar */}
      <div className="relative w-full max-w-xl mb-6">
        <UserSearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
        <input
          type="text"
          placeholder="Search organizations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-xl"
        />
      </div>

      {/* Results */}
      {searchQuery.trim() && (
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6 max-h-96 overflow-y-auto border border-gray-200">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.slice(0, visibleCount).map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 shadow-sm mb-4 hover:bg-blue-100 transition cursor-pointer"
                onClick={() => handleUserClick(user._id!)}
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold text-xl">
                    {user.name?.[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No results found.</p>
          )}

          {filteredUsers.length > visibleCount && (
            <button
              onClick={handleSeeMore}
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              See More
            </button>
          )}
        </div>
      )}

      {/* User Details Dialog */}
      {selectedUser && (
        <div
          className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseDialog}
        >
          <div
            className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-center text-3xl font-bold">
              {selectedUser.name}
            </h2>
            <p className="text-center text-lg text-gray-600">
              Organization Details
            </p>
            <div className="space-y-4 mt-4">
              {/* Organization Details */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">Email:</span>
                <span className="text-gray-800">
                  {selectedUser?.email || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-600 font-semibold block mb-1">
                  Description:
                </span>
                <p className="text-gray-800">
                  {selectedUser?.description || "N/A"}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">Status:</span>
                <span className="text-gray-800">
                  {selectedUser?.isVerified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="text-center border-b pb-2 mt-4">
                <span className="text-gray-600 font-semibold">
                  Bank Details
                </span>
              </div>
              {/* Bank Details */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">
                  Account Number:
                </span>
                <span className="text-gray-800">
                  {selectedUser?.accountDetails?.accountNumber || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">Bank Name:</span>
                <span className="text-gray-800">
                  {selectedUser?.accountDetails?.bankName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">
                  Account Title:
                </span>
                <span className="text-gray-800">
                  {selectedUser?.accountDetails?.accountTitle || "N/A"}
                </span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                onClick={handleCloseDialog}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearch;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, fetchUserById } from "@/store/auth-slice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AppDispatch, RootState } from "@/store/store";
import { UserFormData } from "@/common/formdata";

const UserSidebarSearch: React.FC = () => {
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
    <div className="w-full">
      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search organizations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        />
        {searchQuery.trim() && (
          <div
            className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => setSearchQuery("")}
          >
            ✕
          </div>
        )}
      </div>

      {/* Results */}
      {searchQuery.trim() && (
        <div className="bg-white shadow-lg rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-200">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.slice(0, visibleCount).map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 shadow-sm mb-2 hover:bg-blue-100 transition cursor-pointer"
                onClick={() => handleUserClick(user._id!)}
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold text-lg">
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
      <Dialog open={!!selectedUser} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-xl w-full h-[80vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl">
              {selectedUser?.name}
            </DialogTitle>
            <DialogDescription className="text-center">
              Organization Details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Organization Details */}
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-bold">Email:</span>
              <span className="text-gray-800">
                {selectedUser?.email || "N/A"}
              </span>
            </div>
            <div className="border-b pb-2">
              <span className="text-gray-600 font-bold block mb-1">
                Description:
              </span>
              <p className="text-gray-800 text-justify whitespace-pre-wrap">
                {selectedUser?.description || "N/A"}
              </p>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-bold">Status:</span>
              <span className="text-gray-800">
                {selectedUser?.isVerified ? "Verified" : "Pending"}
              </span>
            </div>
            <div className="text-center border-b pb-2">
              <span className="text-gray-600 font-bold">Bank Details</span>
            </div>
            {/* Bank Details */}
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-bold">Account Number:</span>
              <span className="text-gray-800">
                {selectedUser?.accountDetails?.accountNumber || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-bold">Bank Name:</span>
              <span className="text-gray-800">
                {selectedUser?.accountDetails?.bankName || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-bold">Account Title:</span>
              <span className="text-gray-800">
                {selectedUser?.accountDetails?.accountTitle || "N/A"}
              </span>
            </div>
          </div>
          <DialogFooter>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              onClick={handleCloseDialog}
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserSidebarSearch;

import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
// Import the thunk to fetch posts
import { UserFormData } from "@/common/formdata";
import OrgPostTiles from "@/components/organization-view/post-tile";

const OrganizationDashboard = () => {
  const user: UserFormData | null = useSelector(
    (state: RootState) => state.auth.user
  );

  if (!user || user.role !== "organization") {
    return (
      <div className="text-center text-gray-500 text-lg mt-10">
        No organization details available.
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl w-full mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-500 text-lg">
            Organization Dashboard Overview
          </p>
        </div>

        {/* Organization Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Organization Details
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-medium">Name:</span>
              <span className="text-gray-800">{user.name || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="text-gray-800">{user.email || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-medium">Description:</span>
              <span className="text-gray-800">
                {user.description || "No description provided."}
              </span>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Account Details
          </h2>
          {user.accountDetails?.accountNumber ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600 font-medium">
                  Account Number:
                </span>
                <span className="text-gray-800">
                  {user.accountDetails.accountNumber}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600 font-medium">
                  Account Title:
                </span>
                <span className="text-gray-800">
                  {user.accountDetails.accountTitle || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600 font-medium">Bank Name:</span>
                <span className="text-gray-800">
                  {user.accountDetails.bankName || "N/A"}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No account details provided.</p>
          )}
        </div>
      </div>
      {/* Posts */}

      <OrgPostTiles />
    </>
  );
};

export default OrganizationDashboard;

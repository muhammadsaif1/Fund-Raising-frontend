import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Update this import to match your store setup
import { updateUserOrOrganization } from "@/store/auth-slice"; // Update path as needed
import { useToast } from "@/hooks/use-toast";

const OrganizationAccountDetails = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("bio");
  const [bioData, setBioData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    description: user?.description || "",
  });
  const [bankData, setBankData] = useState({
    accountNumber: user?.accountDetails?.accountNumber || "",
    accountTitle: user?.accountDetails?.accountTitle || "",
    bankName: user?.accountDetails?.bankName || "",
  });

  const [bioEditable, setBioEditable] = useState(false);
  const [isBioChanged, setIsBioChanged] = useState(false);
  const [isBankChanged, setIsBankChanged] = useState(false);

  useEffect(() => {
    setIsBioChanged(
      bioData.name !== user?.name ||
        bioData.email !== user?.email ||
        bioData.description !== user?.description
    );

    setIsBankChanged(
      bankData.accountNumber !== user?.accountDetails?.accountNumber ||
        bankData.accountTitle !== user?.accountDetails?.accountTitle ||
        bankData.bankName !== user?.accountDetails?.bankName
    );
  }, [bioData, bankData, user]);

  const handleBioUpdate = async () => {
    if (!isBioChanged) return;
    try {
      await dispatch(
        updateUserOrOrganization({
          userId: user?._id || "",
          updates: { ...bioData },
        })
      ).unwrap();
      toast({ title: "Bio updated successfully!" });
      setBioEditable(false);
    } catch (error) {
      toast({ title: "Failed to update bio.", variant: "destructive" });
    }
  };

  const handleCancelBioEdit = () => {
    setBioData({
      name: user?.name || "",
      email: user?.email || "",
      description: user?.description || "",
    });
    setBioEditable(false);
  };

  const handleBankUpdate = async () => {
    if (
      !isBankChanged ||
      !bankData.accountNumber ||
      !bankData.accountTitle ||
      !bankData.bankName
    )
      return;
    try {
      await dispatch(
        updateUserOrOrganization({
          userId: user?._id || "",
          updates: { accountDetails: { ...bankData } },
        })
      ).unwrap();
      toast({ title: "Bank details updated successfully!" });
    } catch (error) {
      toast({
        title: "Failed to update bank details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "bio" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("bio")}
        >
          Bio
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "bank" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("bank")}
        >
          Bank Details
        </button>
      </div>

      {activeTab === "bio" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={bioData.name}
              onChange={(e) => setBioData({ ...bioData, name: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded"
              disabled={!bioEditable}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <input
              type="text"
              value={bioData.description}
              onChange={(e) =>
                setBioData({ ...bioData, description: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
              disabled={!bioEditable}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={bioData.email}
              onChange={(e) =>
                setBioData({ ...bioData, email: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
              disabled={!bioEditable}
            />
          </div>

          {!bioEditable ? (
            <button
              onClick={() => setBioEditable(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          ) : (
            <div className="space-x-4">
              <button
                onClick={handleBioUpdate}
                disabled={!isBioChanged}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                Update
              </button>
              <button
                onClick={handleCancelBioEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "bank" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Account Number</label>
            <input
              type="text"
              value={bankData.accountNumber}
              onChange={(e) =>
                setBankData({ ...bankData, accountNumber: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Account Title</label>
            <input
              type="text"
              value={bankData.accountTitle}
              onChange={(e) =>
                setBankData({ ...bankData, accountTitle: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Bank Name</label>
            <input
              type="text"
              value={bankData.bankName}
              onChange={(e) =>
                setBankData({ ...bankData, bankName: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <button
            onClick={handleBankUpdate}
            disabled={
              !isBankChanged ||
              !bankData.accountNumber ||
              !bankData.accountTitle ||
              !bankData.bankName
            }
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            {user?.accountDetails?.accountNumber
              ? "Update Account details"
              : "Add Account details"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrganizationAccountDetails;

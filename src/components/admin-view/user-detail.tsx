import { useState } from "react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateUserOrOrganization } from "@/store/auth-slice";
import CommonForm from "@/common/form";

export type UserForm = {
  isVerified: boolean;
};

interface AdminUserDetailsViewProps {
  userDetails: {
    _id: string;
    email: string;
    role: string;
    isVerified: boolean;
    description: string;
    accountDetails?: {
      accountNumber?: string;
      accountTitle?: string;
      bankName?: string;
    };
    createdAt?: string;
    image?: string;
    name: string;
    proofImage: string;
  };
}

function AdminUserDetailsView({ userDetails }: AdminUserDetailsViewProps) {
  const [formData, setFormData] = useState<UserForm>({
    isVerified: userDetails?.isVerified || false,
  });
  const dispatch: AppDispatch = useDispatch();
  const handleStatusUpdate = (event: React.FormEvent) => {
    event.preventDefault();
    if (userDetails.role === "organization") {
      dispatch(
        updateUserOrOrganization({
          userId: userDetails._id,
          updates: { isVerified: formData.isVerified },
        })
      );
      window.location.reload();
    }
  };

  return (
    <div className="grid gap-6 mt-6 max-h-[80vh] overflow-y-auto">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <p className="font-bold text-sm sm:text-base">User ID</p>
          <Label>{userDetails._id}</Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-bold text-sm sm:text-base">Name</p>
          <Label>{userDetails?.name}</Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-bold text-sm sm:text-base">Email</p>
          <Label>{userDetails.email}</Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-bold text-sm sm:text-base">Role</p>
          <Label>{userDetails.role}</Label>
        </div>

        {userDetails?.role === "organization" && (
          <div className="grid gap-2">
            <div className=" items-center justify-between">
              <p className="font-bold text-sm sm:text-base">Description:</p>
              <Label className="text-justify whitespace-pre-wrap break-words text-sm sm:text-base">
                {userDetails?.description}
              </Label>
            </div>
            <div className=" items-center justify-between">
              <p className="font-bold text-sm sm:text-base">Proof Image:</p>
              <Label className="text-justify whitespace-pre-wrap break-words text-sm sm:text-base">
                <img
                  src={userDetails?.proofImage}
                  alt={userDetails?.name}
                  className="w-full rounded-lg mb-4"
                />
              </Label>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-bold text-sm sm:text-base">Created At</p>
              <Label>{userDetails?.createdAt}</Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm sm:text-base">Account Details:</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm sm:text-base">Account Number</p>
              <Label>{userDetails?.accountDetails?.accountNumber}</Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm sm:text-base">Account Title</p>
              <Label>{userDetails?.accountDetails?.accountTitle}</Label>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm sm:text-base">Bank Name</p>
              <Label>{userDetails?.accountDetails?.bankName}</Label>
            </div>
          </div>
        )}

        {userDetails.role === "organization" && (
          <div className="grid gap-4 ">
            <CommonForm
              formControls={[
                {
                  label: "Verification",
                  name: "isVerified",
                  componentType: "select",
                  options: [
                    { label: "True", value: true },
                    { label: "False", value: false },
                  ],
                },
              ]}
              formData={formData}
              setFormData={setFormData}
              buttonText="Update Status"
              onSubmit={handleStatusUpdate}
            />
          </div>
        )}
      </div>
      <Separator />
    </div>
  );
}

export default AdminUserDetailsView;

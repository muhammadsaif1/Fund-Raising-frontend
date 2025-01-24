import { useToast } from "@/hooks/use-toast";
import { deleteUser } from "@/store/auth-slice";
import { AppDispatch } from "@/store/store";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

interface DeleteAccountProps {
  userId: string;
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({ userId }) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { toast } = useToast();

  const handleDeleteClick = () => {
    setIsDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setIsDialogVisible(false);
  };

  const handleConfirmDelete = async () => {
    dispatch(deleteUser(userId)).then((data) => {
      console.log(data);

      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        window.location.href = "/auth/login";
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "10px 20px",
          fontSize: "16px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
        }}
        onClick={handleDeleteClick}
      >
        Delete Account
      </button>

      {isDialogVisible && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              width: "300px",
            }}
          >
            <h3>Are you sure you want to delete your account?</h3>
            <div>
              <button
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "10px 20px",
                  marginRight: "10px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
              <button
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={handleCloseDialog}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;

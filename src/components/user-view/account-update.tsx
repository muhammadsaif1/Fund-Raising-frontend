import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  CircularProgress,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { updateUserOrOrganization } from "@/store/auth-slice";
import DeleteAccount from "./account-delete";

const UserAccountUpdation: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!user?._id) {
      console.error("User ID is missing.");
      return;
    }

    const { name, email, password } = formData;
    const updates = { name, email, ...(password && { password }) };

    await dispatch(
      updateUserOrOrganization({
        userId: user?._id,
        updates,
      })
    );

    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        width: { xs: "90%", sm: "80%", md: "70%" },
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: { xs: 2, sm: 3, md: 4 },
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
        {user?.role === "user"
          ? "User "
          : user?.role === "organization"
          ? "Organization "
          : "Admin "}
        Account Details
      </Typography>

      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        disabled={!isEditing}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        disabled={!isEditing}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        disabled={!isEditing}
        fullWidth
        margin="normal"
        type="password"
      />

      {isEditing ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          disabled={isLoading}
          fullWidth
          sx={{ mt: 3 }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Update"
          )}
        </Button>
      ) : (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setIsEditing(true)}
          fullWidth
          sx={{ mt: 3 }}
        >
          Edit
        </Button>
      )}
      <DeleteAccount userId={user?._id || ""} />
    </Box>
  );
};

export default UserAccountUpdation;

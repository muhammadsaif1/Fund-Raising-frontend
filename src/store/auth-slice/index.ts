import { UserFormData } from "@/common/formdata";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const getUserFromLocalStorage = (): UserFormData | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const initialState: {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserFormData | null;
  users: UserFormData[];
  error: string | null;
} = {
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  user: getUserFromLocalStorage(),
  users: [],
  error: null,
};

// Register User
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData: UserFormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        formData,
        {
          // headers: { "Content-Type": "application/json" },
          // headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Registration failed");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData: UserFormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData,
        { withCredentials: true }
      );
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);

        localStorage.setItem("user", JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Login failed");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  "/auth/delete",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/auth/${userId}/delete`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Delete failed");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const updateUserOrOrganization = createAsyncThunk(
  "/user/:userId/edit",
  async (
    { userId, updates }: { userId: string; updates: Partial<UserFormData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/auth/${userId}/edit`,
        updates,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Update failed");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/check-auth",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:3000/api/auth/check-auth",
        {
          withCredentials: true,
          headers: {
            "Cache-Control":
              "no-store, no-cache,must-revalidate,proxy-revalidate",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Server response:", response.data.user);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Registration failed");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "/auth/users",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth };
    if (state.auth.users.length > 0) {
      // Users already fetched, no need to refetch
      return state.auth.users;
    }
    try {
      const response = await axios.get("http://localhost:3000/api/auth/users", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Failed to fetch users");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

// Fetch User by ID
export const fetchUserById = createAsyncThunk(
  "/auth/:id",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/auth/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Failed to fetch user");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

// Forgot Password (Send OTP)
export const forgotPassword = createAsyncThunk(
  "/auth/forgot-password",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/forgot-password",
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || "Failed to send OTP for password reset"
        );
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "/auth/reset-password",
  async (
    {
      email,
      otp,
      newPassword,
    }: { email: string; otp: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/reset-password",
        { email, otp, newPassword },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || "Failed to reset password"
        );
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    resetUserDetails: (state) => {
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.users.push(action.payload.data);
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserOrOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserOrOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload.data };
      })
      .addCase(updateUserOrOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.users = state.users.filter(
          (user) => user._id !== action.payload.data._id
        );
        state.isAuthenticated = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = !action.payload.success ? null : action.payload.user;
        state.isAuthenticated = !action.payload.success ? false : true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, logout, resetUserDetails } = authSlice.actions;
export default authSlice.reducer;

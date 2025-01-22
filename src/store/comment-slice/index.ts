import { CommentFormData } from "@/common/formdata";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface CommentState {
  comments: CommentFormData[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: CommentState = {
  comments: [],
  isLoading: false,
  error: null,
};

// Fetch comments for a specific post
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/comments/${postId}`
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || "Failed to fetch comments"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Create a new comment
export const createComment = createAsyncThunk(
  "comments/createComment",
  async (
    { postId, userId, text }: { postId: string; userId: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/comments/${userId}/${postId}`,
        { text }
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || "Failed to create comment"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Update a comment
export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async (
    {
      postId,
      userId,
      commentId,
      text,
    }: { postId: string; userId: string; commentId: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/comments/${userId}/${postId}/${commentId}`,
        { text }
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || "Failed to update comment"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Delete a comment
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (
    { userId, commentId }: { userId: string; commentId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/comments/${userId}/${commentId}`
      );
      return { commentId };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data || "Failed to delete comment"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Comments slice
const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update comment
      .addCase(updateComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload.commentId
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = commentSlice.actions;

export default commentSlice.reducer;

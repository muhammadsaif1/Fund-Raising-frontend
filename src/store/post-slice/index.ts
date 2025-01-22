import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { PostFormData } from "@/common/formdata";

const initialState: {
  posts: PostFormData[];
  post: PostFormData | null;
  isLoading: boolean;
  error: string | null;
} = {
  posts: [],
  post: null,
  isLoading: false,
  error: null,
};

// Fetch all posts
export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3000/api/feed", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Failed to fetch posts");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

// fetch post by id
export const fetchPostById = createAsyncThunk(
  "/posts/:id",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/feed/${postId}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Failed to fetch post");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

// Create a post
export const createPost = createAsyncThunk(
  "posts/create",
  async (postData: PostFormData, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/feed/post/",
        postData,
        {
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Failed to create post");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

// Update a post
export const updatePost = createAsyncThunk(
  "posts/update",
  async (
    { postId, postData }: { postId: string; postData: Partial<PostFormData> },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `http://localhost:3000/api/feed/${postId}/edit`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Failed to update post");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

// Delete a post
export const deletePost = createAsyncThunk(
  "posts/delete",
  async (
    { postId }: { postId: string; userId: string },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/feed/${postId}/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || "Failed to delete post");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const toggleLike = createAsyncThunk(
  "post/toggleLike",
  async ({ postId, userId }: { postId: string; userId: string }) => {
    const response = await axios.post(
      `http://localhost:3000/api/feed/posts/like/${postId}`,
      {
        userId,
      }
    );
    return { postId, likes: response.data.likes };
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all posts
      .addCase(fetchAllPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.data;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPostById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.post = action.payload.data;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create a post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.push(action.payload.data);
        state.post = action.payload.data;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update a post
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.post = action.payload.data;
        state.posts = state.posts.map((p) =>
          p._id === action.payload.data._id ? action.payload.data : p
        );
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Delete a post
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload.data._id
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.likes = likes; // Update likes array
        }
      });
  },
});

export default postsSlice.reducer;

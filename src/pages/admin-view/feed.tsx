import PostTile from "@/components/common/posts-tile";
import CreatePostForm from "@/components/organization-view/create-post-form";
import { fetchAllPosts } from "@/store/post-slice";
import { RootState } from "@/store/store";
// import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminFeed = () => {
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  // if (isLoading)
  //   return (
  //     <p>
  //       <CircularProgress />{" "}
  //     </p>
  //   );

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Create Post Form */}
      <CreatePostForm />

      {/* Posts Section */}
      <div className="mt-6 mx-auto w-full max-w-2xl">
        {posts.map((post) => (
          <PostTile key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default AdminFeed;

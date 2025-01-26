import { PostFormData, UserFormData } from "@/common/formdata";
import { fetchAllPosts, fetchPostById, toggleLike } from "@/store/post-slice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostDetail from "../common/post-detail";

export default function OrgPostTiles() {
  const user: UserFormData | null = useSelector(
    (state: RootState) => state.auth.user
  );
  const { posts, post } = useSelector((state: RootState) => state.posts);
  const dispatch: AppDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostFormData | null>(null);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  // Filter posts created by the organization
  const organizationPosts = posts.filter(
    (post: PostFormData) => post.createdBy?._id === user._id
  );

  const handleLike = (postId: string) => {
    if (postId) {
      dispatch(toggleLike({ postId: postId, userId: user?._id || "" }));
    }
  };

  const handleOpenDetail = (postId: string) => {
    if (postId) {
      dispatch(fetchPostById(postId)).then((result) => {
        setSelectedPost(result.payload.data);
        console.log(result.payload.data);

        setIsModalOpen(true);
      });
    }
  };
  return (
    <>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Posts</h2>
        {organizationPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {organizationPosts.map((post) => (
              <div
                key={post._id}
                className="p-4 bg-gray-100 shadow-md rounded-md"
              >
                {/* Display image if available */}
                {post.image ? (
                  <div className="mb-2">
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                ) : null}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex justify-center items-center text-sm font-bold text-white">
                    {post.createdBy?.name?.charAt(0).toUpperCase()}
                    {/* org will be with name */}
                  </div>
                  <span className="font-semibold">{post?.createdBy?.name}</span>
                </div>
                <h3 className="text-lg font-bold text-blue-600">
                  {post.title || "Untitled Post"}
                </h3>
                <p className="text-gray-700">
                  {post.description?.slice(0, 100) || "No description provided"}
                  ...
                </p>
                <span className=" text-sm">
                  {post.likes?.length || 0}{" "}
                  {post?.likes?.length === 0 || post?.likes?.length === 1
                    ? "Like"
                    : "Likes"}
                </span>{" "}
                <hr />
                <button
                  onClick={() => handleLike(post?._id || "")}
                  className=" mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 left-2 mr-4"
                >
                  {post.likes?.includes(user?._id) ? "Unlike" : "Like"}
                </button>
                <button
                  onClick={() => handleOpenDetail(post?._id)}
                  className="mt-2 text-sm text-blue-500 hover:underline"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No posts available.</p>
        )}
        {isModalOpen && selectedPost && (
          <PostDetail
            post={selectedPost}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedPost(null);
              dispatch(fetchAllPosts);
            }}
          />
        )}
      </div>
    </>
  );
}

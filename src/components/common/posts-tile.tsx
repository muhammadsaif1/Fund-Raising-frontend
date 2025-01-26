import { fetchAllPosts, fetchPostById, toggleLike } from "@/store/post-slice";
import PostDetail from "./post-detail";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { PostFormData } from "@/common/formdata";

const PostTile = ({ post }: { post: PostFormData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostFormData | null>(null);
  const dispatch: AppDispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);

  const handleLike = () => {
    if (post._id) {
      dispatch(toggleLike({ postId: post._id, userId: user?._id || "" }));
    }
  };

  const handleOpenDetail = () => {
    if (post._id) {
      dispatch(fetchPostById(post._id)).then((result) => {
        setSelectedPost(result.payload.data);
        console.log(result.payload.data);

        setIsModalOpen(true);
      });
    }
  };
  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  return (
    <div className="border rounded-lg shadow-md p-4 mb-4 cursor-pointer hover:shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex justify-center items-center text-sm font-bold text-white">
          {post?.createdBy?.name.charAt(0).toUpperCase() || "O"}
          {/* org will be with name */}
        </div>
        <span className="font-semibold">{post?.createdBy?.name || "O"}</span>
      </div>

      <h3 className="font-bold text-lg" onClick={handleOpenDetail}>
        {post.title}
      </h3>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover rounded-lg mt-2"
        />
      )}
      <p className="text-gray-600 mt-2">{post.description?.slice(0, 100)}...</p>
      <div className="flex justify-between items-center mt-4">
        <span>
          {post.likes?.length || 0}{" "}
          {post?.likes?.length === 0 || post?.likes?.length === 1
            ? "Like"
            : "Likes"}
        </span>
        <button
          onClick={handleLike}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {post.likes?.includes(user?._id) ? "Unlike" : "Like"}
        </button>
      </div>

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
  );
};

export default PostTile;

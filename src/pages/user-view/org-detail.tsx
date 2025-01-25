import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAllPosts, fetchPostById, toggleLike } from "@/store/post-slice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CommentsTile from "../../components/common/comment-tile";
import { useToast } from "@/hooks/use-toast";
import { createComment, fetchComments } from "@/store/comment-slice";
import { PostFormData } from "@/common/formdata";

const OrganizationDetail = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { users, user } = useSelector((state: RootState) => state.auth);
  const { posts } = useSelector((state: RootState) => state.posts);
  const { toast } = useToast();

  const [selectedPost, setSelectedPost] = useState<PostFormData | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  const organization = users.find((user) => user._id === id);
  const organizationPosts = posts.filter((post) => post.createdBy?._id === id);

  const handleLike = (postId: string) => {
    dispatch(toggleLike({ postId, userId: user?._id || "" }));
    dispatch(fetchPostById(postId));
  };

  const handleCommentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) {
      toast({ title: "Comment cannot be empty.", variant: "destructive" });
      return;
    }

    if (selectedPost?._id) {
      dispatch(
        createComment({
          postId: selectedPost._id,
          userId: user?._id || "",
          text: commentText,
        })
      ).then(() => {
        toast({ title: "Comment added successfully." });
        setCommentText("");
        dispatch(fetchComments(selectedPost?._id));
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Section */}
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Organization Details</h1>
          <Link
            to="/user/home"
            className="bg-white text-blue-600 py-2 px-4 rounded shadow-md"
          >
            Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {/* Organization Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-extrabold text-gray-800">
              {organization?.name}
            </h2>
            <p className="text-gray-600 text-lg mt-2">{organization?.email}</p>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              About the Organization
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {organization?.description || "No description provided."}
            </p>
            <p className="text-gray-700 leading-relaxed font-extrabold">
              Status: {organization?.isVerified ? "Verified" : "Pending"}
            </p>
          </div>
          {organization?.accountDetails && organization?.isVerified && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Account Details
              </h3>
              <ul className="space-y-3">
                <li>
                  <strong className="text-gray-800">Account Number:</strong>{" "}
                  <span className="text-gray-600">
                    {organization.accountDetails.accountNumber}
                  </span>
                </li>
                <li>
                  <strong className="text-gray-800">Account Title:</strong>{" "}
                  <span className="text-gray-600">
                    {organization.accountDetails.accountTitle}
                  </span>
                </li>
                <li>
                  <strong className="text-gray-800">Bank Name:</strong>{" "}
                  <span className="text-gray-600">
                    {organization.accountDetails.bankName}
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          <h3 className="text-3xl font-bold mb-6">
            Posts by {organization?.name || "the organization"}
          </h3>
          {organizationPosts.length === 0 && <p>No posts Available</p>}
          {organizationPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-lg p-4 border border-gray-300 hover:shadow-xl transition cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              {/* Post Header */}
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={"/default-avatar.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                  <h4 className="text-lg font-semibold">
                    {organization?.name}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt || "").toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Post Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}

              {/* Post Content */}
              <h4 className="text-xl font-bold">{post.title}</h4>
              <p className="text-gray-700">
                {post.description?.slice(0, 150)}...
              </p>

              {/* Like and Comment Count */}
              <div className="flex justify-between items-center mt-4 text-gray-600">
                <span className="text-sm font-medium">
                  {post.likes?.length || 0}{" "}
                  {post.likes?.length === 1 ? "Like" : "Likes"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Post Details Dialog */}
      {selectedPost && (
        <Dialog open onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {selectedPost.title}
              </DialogTitle>
              <DialogDescription className="text-gray-700">
                {selectedPost.description}
              </DialogDescription>
            </DialogHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4">
              {selectedPost.image && (
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover rounded-lg my-4"
                />
              )}

              {/* Likes & Like Button */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 text-sm">
                  {selectedPost.likes?.length || 0}{" "}
                  {selectedPost.likes?.length === 1 ? "Like" : "Likes"}
                </span>
                <button
                  onClick={() => handleLike(selectedPost._id)}
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    selectedPost.likes?.includes(user?._id)
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {selectedPost.likes?.includes(user?._id) ? "Unlike" : "Like"}
                </button>
              </div>

              {/* Comments Section */}
              <div className=" overflow-y-auto border-t pt-4">
                <h4 className="text-lg font-bold mb-2">Comments</h4>
                <CommentsTile
                  post={selectedPost}
                  user={user}
                  onClose={() => setSelectedPost(null)}
                />
              </div>
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t flex">
              <input
                type="text"
                value={commentText}
                onChange={handleCommentInputChange}
                placeholder="Add a comment..."
                className="flex-1 border rounded p-2"
              />
              <button
                onClick={handleAddComment}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OrganizationDetail;

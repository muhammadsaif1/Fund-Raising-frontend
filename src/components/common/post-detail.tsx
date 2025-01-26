import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  fetchAllPosts,
  fetchPostById,
  updatePost,
} from "@/store/post-slice";
import { PostFormData } from "@/common/formdata";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AppDispatch, RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import CommentsTile from "./comment-tile";
import { createComment } from "@/store/comment-slice";

const PostDetail = ({
  post,
  onClose,
}: {
  post: PostFormData;
  onClose: () => void;
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState<PostFormData>(post);
  const [hasChanges, setHasChanges] = useState(false);
  const [commentText, setCommentText] = useState("");

  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setHasChanges(JSON.stringify(post) !== JSON.stringify(editedPost));
  }, [editedPost, post]);

  useEffect(() => {
    setEditedPost(post);
  }, [post]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };
  console.log(user, "User");

  const handleAddComment = () => {
    if (!commentText.trim()) {
      toast({ title: "Comment cannot be empty.", variant: "destructive" });
      return;
    }
    if (post._id && user?._id) {
      dispatch(
        createComment({
          postId: post._id,
          userId: user._id,
          text: commentText,
        })
      );
      toast({ title: "Comment added successfully." });
      setCommentText("");
      dispatch(fetchPostById(post._id));
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setEditedPost(post);
    setIsEditing(false);
  };

  const validate = () => {
    if (!editedPost.title || !editedPost.description) {
      alert("Title and description are required.");
      return false;
    }
    return true;
  };

  const handleUpdate = () => {
    if (validate() && post._id && hasChanges) {
      dispatch(updatePost({ postId: post._id, postData: editedPost })).then(
        (data) => {
          if (data?.payload?.success) {
            dispatch(fetchPostById(post?._id));
            toast({
              title: "Post updated successfully",
            });
            dispatch(fetchPostById(post?._id));
            dispatch(fetchAllPosts());
          } else {
            toast({
              title: data?.payload?.message,
              variant: "destructive",
            });
          }
        }
      );
      setIsEditing(false);
    } else {
      toast({
        title: "Failed to update post",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (post._id) {
      dispatch(deletePost({ postId: post._id })).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: "Post deleted successfully",
            variant: "destructive",
          });
          dispatch(fetchAllPosts());
        } else {
          toast({
            title: data?.payload?.message,
            variant: "destructive",
          });
        }
      });
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4">
          {/* Post Header */}
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center text-lg font-bold text-white">
                  {post?.createdBy?.name.charAt(0).toUpperCase() || "O"}
                </div>
                <span className="text-lg font-semibold">
                  {post?.createdBy?.name || "O"}
                </span>
              </div>
            </DialogTitle>
            <DialogDescription className="text-gray-700">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="title"
                    value={editedPost.title || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2 mb-4"
                    placeholder="Title"
                  />
                  {editedPost.image && (
                    <div className="mb-4">
                      <img
                        src={
                          typeof editedPost.image === "string"
                            ? editedPost.image
                            : URL.createObjectURL(editedPost.image)
                        }
                        alt={editedPost.title}
                        className="w-full rounded-lg mb-2"
                      />
                      <input type="file" onChange={handleInputChange} />
                    </div>
                  )}
                  <textarea
                    name="description"
                    value={editedPost.description || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2 mb-4"
                    placeholder="Description"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-2">
                    {post.title || "Untitled Post"}
                  </h2>
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="mb-2">{post.description}</p>
                  <span className="text-sm text-gray-600 font-medium">
                    {post.likes?.length || 0}{" "}
                    {post.likes?.length === 1 ? "Like" : "Likes"}
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Comments Section */}
          <div className="overflow-y-auto border-t pt-4">
            <h4 className="text-lg font-bold mb-2">Comments</h4>
            <CommentsTile post={post!} user={user!} onClose={onClose} />
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
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>

        {/* Footer Actions */}
        <DialogFooter>
          <div className="flex items-center justify-between px-4 pb-4">
            {!isEditing ? (
              user?.role === "organization" &&
              user?._id === post?.createdBy?._id && (
                <div>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )
            ) : (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={!hasChanges}
                  className={`px-4 py-2 text-white rounded ${
                    hasChanges
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Update
                </button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetail;

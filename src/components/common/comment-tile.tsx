import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchComments,
  deleteComment,
  updateComment,
} from "@/store/comment-slice";
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useToast } from "@/hooks/use-toast";
import { PostFormData, UserFormData } from "@/common/formdata";

interface CommentsTileProps {
  post: PostFormData;
  user: UserFormData;
  onClose: () => void;
}

const CommentsTile: React.FC<CommentsTileProps> = ({ post, user, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const { comments, isLoading } = useSelector(
    (state: RootState) => state.comments
  );
  const [visibleComments, setVisibleComments] = useState(10);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchComments(post._id));
  }, [dispatch, post._id]);

  const handleSeeMore = () => {
    setVisibleComments((prev) => prev + 10);
  };

  const handleEditClick = (commentId: string, currentText: string) => {
    setEditingCommentId(commentId);
    setEditingText(currentText);
  };

  const handleEditSubmit = () => {
    if (editingCommentId && editingText) {
      dispatch(
        updateComment({
          postId: post._id,
          userId: user._id,
          commentId: editingCommentId,
          text: editingText,
        })
      );
      toast({ title: "Comment Updated Successfully!" });
      setEditingCommentId(null);
      setEditingText("");
    }
  };

  const handleDeleteClick = (commentId: string) => {
    dispatch(deleteComment({ userId: user._id, commentId }));
    toast({ title: "Comment deleted successfully", variant: "destructive" });
  };

  const renderAvatar = (name: string) => {
    const initials = name.charAt(0).toUpperCase();
    return (
      <Avatar sx={{ bgcolor: "primary.main", marginRight: 1 }}>
        {initials}
      </Avatar>
    );
  };

  const displayedComments = comments.slice(0, visibleComments);

  console.log(displayedComments);

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "80vh",
        overflowY: "auto",
        padding: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Comments
      </Typography>
      {isLoading ? (
        <Typography>Loading comments...</Typography>
      ) : comments.length === 0 ? (
        <Typography>No comments available</Typography>
      ) : (
        displayedComments.map((comment) => (
          <Box
            key={comment._id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 1,
              borderBottom: "1px solid #ddd",
              marginBottom: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {renderAvatar(comment?.user?.name || "UK")}
              <Box>
                <Typography fontWeight="bold">
                  {comment?.user?.name || "UK"}
                </Typography>
                {editingCommentId === comment._id ? (
                  <TextField
                    fullWidth
                    size="small"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    sx={{ marginTop: 1 }}
                  />
                ) : (
                  <Typography>{comment?.text}</Typography>
                )}
              </Box>
            </Box>
            {comment.user?._id === user._id && (
              <Box>
                {editingCommentId === comment._id ? (
                  <Button size="small" onClick={handleEditSubmit}>
                    Save
                  </Button>
                ) : (
                  <>
                    <IconButton
                      onClick={() =>
                        handleEditClick(comment._id!, comment.commentText!)
                      }
                    >
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(comment._id!)}>
                      <Delete />
                    </IconButton>
                  </>
                )}
              </Box>
            )}
          </Box>
        ))
      )}
      {visibleComments < comments.length && (
        <Button fullWidth onClick={handleSeeMore}>
          See More
        </Button>
      )}
      {visibleComments >= comments.length && comments.length > 0 && (
        <Typography textAlign="center" sx={{ marginTop: 2 }}>
          No more comments
        </Typography>
      )}
    </Box>
  );
};

export default CommentsTile;

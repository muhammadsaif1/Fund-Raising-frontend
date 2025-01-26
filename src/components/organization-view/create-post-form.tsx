import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../store/post-slice";
import { AppDispatch, RootState } from "../../store/store";
import { PostFormData } from "@/common/formdata";
import { useToast } from "@/hooks/use-toast";

const CreatePostForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.posts);
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();

  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    description: "",
    image: undefined,
    userId: user?._id,
    // createdBy: user?._id,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: undefined }));
    setImagePreview(null);
  };
  console.log(formData, "create-post");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("title", formData.title);
    formDataToSubmit.append("description", formData.description);
    if (formData.image) {
      formDataToSubmit.append("image", formData.image);
    }

    try {
      await dispatch(createPost(formDataToSubmit)).unwrap();
      toast({
        title: "Posted!",
      });
      setFormData({
        title: "",
        description: "",
        image: undefined,
      });
      setImagePreview(null);
    } catch (err) {
      toast({
        title: " please try again",
        variant: "destructive",
      });
    }
  };

  const isSubmitDisabled = !formData.title || !formData.description;
  console.log(formData, "create-post");
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl w-full mx-auto bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row gap-6 items-center mt-4"
    >
      {/* Left Section: Image Preview */}
      <div className="flex flex-col items-center gap-4">
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-48 h-48 object-cover rounded-full border-2 border-gray-300"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-md hover:bg-red-600 focus:outline-none"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
            <label
              htmlFor="image"
              className="text-blue-500 font-medium cursor-pointer hover:underline"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Right Section: Form Fields */}
      <div className="flex flex-col flex-grow gap-4 w-full">
        <h1 className="text-3xl font-bold text-gray-700 text-center md:text-left">
          Create a Post
        </h1>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-gray-600 font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
            placeholder="What's on your mind?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-gray-600 font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            placeholder="Write something..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitDisabled || isLoading}
            className={`px-6 py-2 text-white font-semibold rounded-full shadow-lg focus:outline-none ${
              isSubmitDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreatePostForm;

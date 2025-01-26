import PostTile from "@/components/common/posts-tile";
import { fetchAllPosts } from "@/store/post-slice";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const UserFeed = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-6">
      {/* Posts Section (Takes Remaining Space) */}
      <main className="col-span-12 lg:col-span-12 flex justify-center">
        <div className="mt-6 sm:mt-8 w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-4xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-6 text-center">
            Hey, welcome back! It's{" "}
            <span className="font-bold">
              {new Date().toLocaleDateString("en-US", { weekday: "long" })},
            </span>{" "}
            Ready to make a difference today?
          </h1>

          {posts.length > 0 ? (
            <div className="space-y-6 sm:space-y-8">
              {posts.map((post) => (
                <PostTile key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No posts available.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserFeed;

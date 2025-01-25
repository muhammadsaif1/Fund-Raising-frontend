import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAllUsers } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";
import pic1 from "../../assets/1.jpg";
import pic2 from "../../assets/2.jpg";
import pic3 from "../../assets/3.jpg";
import pic4 from "../../assets/4.jpg";
import pic5 from "../../assets/5.jpg";
import pic6 from "../../assets/6.jpg";
import pic7 from "../../assets/7.jpg";

const images = [pic1, pic2, pic3, pic4, pic5, pic6, pic7];

const UserHome = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, users.length]);
  const organizations = users.filter((user) => user.role === "organization");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleOrganizationClick = (id: string) => {
    navigate(`/organization/${id}`);
  };

  return (
    <div className="container mx-auto px-4">
      {/* Image Slider */}
      <div className="relative w-full max-w-8xl h-auto mx-auto overflow-hidden mt-1">
        <img
          src={images[currentImageIndex]}
          alt={`Slide ${currentImageIndex + 1}`}
          className="w-full h-64 object-cover rounded-lg"
        />
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white px-4 py-2 rounded-lg"
          onClick={handlePrev}
        >
          &#8249;
        </button>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white px-4 py-2 rounded-lg"
          onClick={handleNext}
        >
          &#8250;
        </button>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold mt-6 mb-4 text-center">
        All Organizations
      </h2>

      {/* Organizations List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-auto ">
        {organizations.map((org) => (
          <div
            key={org._id}
            className=" border-s-violet-300 border rounded-lg p-4 shadow-lg hover:shadow-xl cursor-pointer "
            onClick={() => handleOrganizationClick(org._id || "")}
          >
            <h3 className="font-semibold text-lg">{org.name}</h3>
            <p className="text-gray-600">{org.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHome;

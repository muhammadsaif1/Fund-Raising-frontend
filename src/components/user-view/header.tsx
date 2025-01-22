import React, { useState } from "react";
import { House, LogOut, Menu, User, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { logout } from "@/store/auth-slice";
import UserSidebarSearch from "./sidebar";

const UserHeader = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function logoutHandler() {
    dispatch(logout());
    navigate("/auth/login");
  }

  const getLinkClassName = (path: string) =>
    `text-sm font-bold transition-colors ${
      location.pathname === path
        ? "text-blue-800 underline"
        : "text-blue-500 hover:text-blue-800"
    }`;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-blue-100 shadow-md">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo (Hidden on Mobile) */}
          <Link className="hidden md:flex items-center gap-2" to="/user/home">
            <House className="h-6 w-6 text-blue-800" />
            <span className="font-bold text-lg text-blue-800">Fundraising</span>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link to="/user/home" className={getLinkClassName("/user/home")}>
              Home
            </Link>
            <Link to="/user/feed" className={getLinkClassName("/user/feed")}>
              Feed
            </Link>
            <Link
              to="/user/search-organization"
              className={getLinkClassName("/user/search-organization")}
            >
              Search
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-blue-800 focus:outline-none"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* User Avatar and Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer bg-gray-300">
                <AvatarFallback className="bg-white text-blue-800 font-extrabold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              className="w-48 bg-white text-blue-800 shadow-md border border-gray-200"
            >
              <DropdownMenuLabel className="text-sm">
                Logged in as {user?.name || "User"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="border-gray-200" />
              <DropdownMenuItem
                onClick={() => navigate("/user/account")}
                className="text-blue-500 hover:text-blue-800"
              >
                <User className="mr-2 h-4 w-4 text-blue-500" />
                Account
              </DropdownMenuItem>
              <DropdownMenuSeparator className="border-gray-200" />
              <DropdownMenuItem
                onClick={logoutHandler}
                className="text-blue-500 hover:text-blue-800"
              >
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Sidebar for Mobile (Opens from Left) */}
      {isSidebarOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-4/5 max-w-xs bg-white shadow-lg flex flex-col items-start p-6 md:hidden">
          <button
            className="self-end text-blue-800 focus:outline-none"
            onClick={toggleSidebar}
          >
            <X className="h-8 w-8" />
          </button>

          <nav className="mt-6 w-full space-y-4">
            <Link
              to="/user/home"
              className={`block w-full ${getLinkClassName("/user/home")}`}
              onClick={toggleSidebar}
            >
              Home
            </Link>
            <Link
              to="/user/feed"
              className={`block w-full ${getLinkClassName("/user/feed")}`}
              onClick={toggleSidebar}
            >
              Feed
            </Link>
            <div className=" lg:flex items-center justify-center w-full max-w-lg">
              <div className="w-full">
                <UserSidebarSearch />
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default UserHeader;

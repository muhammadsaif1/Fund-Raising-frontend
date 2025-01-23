import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { logout } from "@/store/auth-slice";

type OrganizationHeaderProps = {
  setOpen: (open: boolean) => void;
};

function OrganizationHeader({ setOpen }: OrganizationHeaderProps) {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  function logoutHandler() {
    dispatch(logout());
    navigate("/auth/login");
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b shadow-md ">
      {/* Menu Toggle Button */}
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Spacer to push Logout Button to the right */}
      <div className="flex-1" />

      {/* Logout Button */}
      <Button
        onClick={logoutHandler}
        className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
      >
        <LogOut />
        Logout
      </Button>
    </header>
  );
}

export default OrganizationHeader;

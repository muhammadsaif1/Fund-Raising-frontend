import { UserFormData } from "@/common/formdata";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface CheckAuthProps {
  isAuthenticated: boolean;
  user?: UserFormData | null;
  children: ReactNode;
}

function CheckAuth({ isAuthenticated, user, children }: CheckAuthProps) {
  const location = useLocation();

  if (
    !isAuthenticated &&
    !location.pathname.includes("/auth/login") &&
    !location.pathname.includes("/auth/register")
  ) {
    return <Navigate to="/auth/login" />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/auth/login") ||
      location.pathname.includes("/auth/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user?.role === "organization") {
      return <Navigate to="/organization/dashboard" />;
    } else {
      return <Navigate to="/user/home" />;
    }
  }

  if (isAuthenticated) {
    if (
      user?.role === "admin" &&
      (location.pathname.includes("/organization") ||
        location.pathname.includes("/user"))
    ) {
      return <Navigate to="/admin/dashboard" />;
    }

    if (
      user?.role === "organization" &&
      (location.pathname.includes("/admin") ||
        location.pathname.includes("/user"))
    ) {
      return <Navigate to="/organization/dashboard" />;
    }

    if (
      user?.role === "user" &&
      (location.pathname.includes("/admin") ||
        location.pathname.includes("/organization"))
    ) {
      return <Navigate to="/user/home" />;
    }
  }

  if (!isAuthenticated) {
    if (
      location.pathname.includes("/user") ||
      location.pathname.includes("/organization") ||
      location.pathname.includes("/admin")
    )
      return <Navigate to={"/auth/login"} />;
  }

  return <>{children}</>;
}

export default CheckAuth;

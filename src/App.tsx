import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import CheckAuth from "./components/common/check-auth";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import OrganizationDashboard from "./pages/organization-view/dashboard";
import OrganizationAccount from "./pages/organization-view/account";
import UserHome from "./pages/user-view/home";
import UserAccount from "./pages/user-view/account";
import AdminDashboard from "./pages/admin-view/dashboard";
import OrganizationFeed from "./pages/organization-view/feed";
import UserFeed from "./pages/user-view/feed";
import AdminAccount from "./pages/admin-view/account";
import AuthLayout from "./components/auth/layout";
import OrganizationLayout from "./components/organization-view/layout";
import UserLayout from "./components/user-view/layout";
import AdminLayout from "./components/admin-view/layout";
import { CircularProgress } from "@mui/material";
import OrganizationDetail from "./pages/user-view/org-detail";
import UserSearch from "./pages/user-view/search";
import AdminFeed from "./pages/admin-view/feed";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading)
    return (
      <div>
        <CircularProgress />
      </div>
    );

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Redirect / to /auth/login */}
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <Navigate to="/auth/login" />
            </CheckAuth>
          }
        />

        {/* Authentication Pages */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* Organization View Pages */}
        <Route
          path="/organization"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <OrganizationLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<OrganizationDashboard />} />
          <Route path="feed" element={<OrganizationFeed />} />
          <Route path="account" element={<OrganizationAccount />} />
        </Route>

        {/* User View Pages */}
        <Route path="organization/:id" element={<OrganizationDetail />} />

        {/* User View Pages */}
        <Route
          path="/user"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <UserLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<UserHome />} />

          <Route path="feed" element={<UserFeed />} />
          <Route path="account" element={<UserAccount />} />
          <Route path="search-organization" element={<UserSearch />} />
        </Route>

        {/* Admin View Pages */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="feed" element={<AdminFeed />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="account" element={<AdminAccount />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

import { Outlet } from "react-router-dom";
import UserHeader from "./header";
import UserFooter from "./footer";

function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header at the top */}
      <UserHeader />

      {/* Main content takes up remaining space */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Sticky Footer at the bottom */}
      <UserFooter />
    </div>
  );
}

export default UserLayout;

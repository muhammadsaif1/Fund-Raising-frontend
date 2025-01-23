import { Outlet } from "react-router-dom";

import { useState } from "react";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  return (
    <div className="flex min-h-screen w-full">
      {/* Admin sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* Admin Header */}
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6  ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

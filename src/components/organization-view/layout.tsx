import { Outlet } from "react-router-dom";

import { useState } from "react";
import OrgSideBar from "./sidebar";
import OrganizationHeader from "./header";

function OrganizationLayout() {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  return (
    <div className="flex min-h-screen w-full">
      {/* Admin sidebar */}
      <OrgSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* Admin Header */}
        <OrganizationHeader setOpen={setOpenSidebar} />
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6  ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default OrganizationLayout;

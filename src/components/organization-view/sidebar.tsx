import { ChartNoAxesCombined } from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { OrgSideBarMenuItems } from "../../config/index";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

type OrgSideBarProps = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

function MenuItems({ setOpen }: OrgSideBarProps) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2 ">
      {OrgSideBarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            if (setOpen) {
              setOpen(false);
            }
            if (setOpen) setOpen(false);
          }}
          className="flex text-xl items-center gap-2 rounded-md px-3  py-2 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <menuItem.icon size={20} />
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function OrgSideBar({ open, setOpen }: OrgSideBarProps) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 ">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex  gap-2 mt-5 mb-5">
                <ChartNoAxesCombined />
                <h1 className="text-2xl font-extrabold">Organization Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden  w-64  flex-col border-r bg-background p-6 lg:flex ">
        <div
          onClick={() => navigate("/organization/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ChartNoAxesCombined />
          <h1 className="text-lg font-extrabold">Organization Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default OrgSideBar;

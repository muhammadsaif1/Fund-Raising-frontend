import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAllUsers } from "@/store/auth-slice";
import { Dialog, DialogContent } from "../ui/dialog";
import AdminUserDetailsView from "./user-detail";

function AdminUsersView() {
  const [activeTab, setActiveTab] = useState<"users" | "organizations">(
    "users"
  );
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { users } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, users.length]);

  const filteredUsers = users.reduce(
    (acc, user) => {
      if (user.role === "user") acc.users.push(user);
      else if (user.role === "organization") acc.organizations.push(user);
      return acc;
    },
    { users: [], organizations: [] } as {
      users: typeof users;
      organizations: typeof users;
    }
  );

  const handleActionClick = (user: (typeof users)[0]) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const renderTableRows = (data: typeof users) =>
    data.map((user) => (
      <TableRow key={user._id} className="hidden md:table-row">
        <TableCell>{user._id}</TableCell>
        <TableCell> {user?.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        {user.role === "organization" && (
          <TableCell>{user.isVerified ? "Verified" : "Pending"}</TableCell>
        )}
        <TableCell>
          <Button onClick={() => handleActionClick(user)}>View details</Button>
        </TableCell>
      </TableRow>
    ));

  const renderMobileRows = (data: typeof users) =>
    data.map((user) => (
      <div
        key={user._id}
        className="block md:hidden border rounded-md p-4 mb-4 shadow-sm"
      >
        <p>
          <span className="font-semibold">ID:</span> {user._id}
        </p>
        <p>
          <span className="font-semibold">Name:</span> {user?.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        {user.role === "organization" && (
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {user.isVerified ? "Verified" : "Pending"}
          </p>
        )}
        <div className="mt-2">
          <Button onClick={() => handleActionClick(user)}>View details</Button>
        </div>
      </div>
    ));

  return (
    <Card className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <CardHeader>
        <CardTitle className="text-center text-lg sm:text-xl md:text-2xl">
          All
          {activeTab === "users" ? " Users" : " Organizations"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="users"
          onValueChange={(value) =>
            setActiveTab(value as "users" | "organizations")
          }
        >
          <TabsList className="flex justify-center space-x-4 mb-4">
            <TabsTrigger
              value="users"
              className="px-4 py-2 text-sm sm:text-base md:text-lg"
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="organizations"
              className="px-4 py-2 text-sm sm:text-base md:text-lg"
            >
              Organizations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            {/* Desktop Table */}
            <div className="overflow-x-auto hidden md:block">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderTableRows(filteredUsers.users)}</TableBody>
              </Table>
            </div>
            {/* Mobile View */}
            <div className="block md:hidden">
              {renderMobileRows(filteredUsers.users)}
            </div>
          </TabsContent>

          <TabsContent value="organizations">
            {/* Desktop Table */}
            <div className="overflow-x-auto hidden md:block">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderTableRows(filteredUsers.organizations)}
                </TableBody>
              </Table>
            </div>
            {/* Mobile View */}
            <div className="block md:hidden">
              {renderMobileRows(filteredUsers.organizations)}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          {selectedUser && <AdminUserDetailsView userDetails={selectedUser} />}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default AdminUsersView;

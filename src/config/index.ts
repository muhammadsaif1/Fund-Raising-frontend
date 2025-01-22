import { Feed, Person } from "@mui/icons-material";
import { LayoutDashboard } from "lucide-react";

export const getRegisterFormControls = (role: "user" | "organization") => {
  const commonControls = [
    {
      name: "name",
      label: "Name",
      placeholder: "Enter your name",
      componentType: "input" as const,
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter Your email",
      componentType: "input" as const,
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter Your password",
      componentType: "input" as const,
      type: "password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Enter Your password again",
      componentType: "input" as const,
      type: "password",
    },
  ];

  if (role === "organization") {
    return [
      ...commonControls,
      {
        name: "description",
        label: "Description",
        placeholder: "Enter Your organization's description",
        componentType: "input" as const,
        type: "textarea",
      },
      {
        name: "proofImage",
        label: "Proof of Organization",
        placeholder: "Upload proof image",
        componentType: "file" as const,
        type: "file",
      },
    ];
  }

  return commonControls;
};

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input" as const,
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input" as const,
    type: "password",
  },
];

export const OrgSideBarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/organization/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "feed",
    label: "feed",
    path: "/organization/feed",
    icon: Feed,
  },
  {
    id: "account",
    label: "account",
    path: "/organization/account",
    icon: Person,
  },
];

export const AdminSideBarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "account",
    label: "Account",
    path: "/admin/account",
    icon: Person,
  },
  {
    id: "feed",
    label: "Feed",
    path: "/admin/feed",
    icon: Feed,
  },
];

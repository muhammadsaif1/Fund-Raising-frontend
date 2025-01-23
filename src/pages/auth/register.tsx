import CommonForm from "@/common/form";
import { UserFormData } from "@/common/formdata";
import { Button } from "@/components/ui/button";
import { getRegisterFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { AppDispatch } from "@/store/store";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice";
import { Navigate } from "react-router-dom";

export default function AuthRegister() {
  const [role, setRole] = useState<"user" | "organization">("user");
  const [formData, setFormData] = useState<UserFormData>({
    role: "user",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const { toast } = useToast();

  const formControls = getRegisterFormControls(role);

  const handleRoleChange = (selectedRole: "user" | "organization") => {
    setRole(selectedRole);
    setFormData((prev) => ({
      ...prev,
      role: selectedRole,
    }));
  };
  console.log(formData, "register");
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (formData.password !== formData["confirmPassword"]) {
      toast({
        title: "Passwords do not match!",
        variant: "destructive",
      });
      return;
    }

    const formDataWithImage = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formDataWithImage.append(key, String(value));
      }
    });

    if (role === "organization" && imageFile) {
      formDataWithImage.append("proofImage", imageFile);
    } else if (role === "organization" && !imageFile) {
      toast({
        title: "Organization registration requires a proof image",
        variant: "destructive",
      });
      return;
    }
    console.log("Final FormData contents:");
    for (const pair of formDataWithImage.entries()) {
      console.log(pair[0], pair[1]);
    }

    dispatch(registerUser(formDataWithImage)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message || "Registration successful",
        });
        setTimeout(() => {
          <Navigate to={"/auth/login"} />;
        }, 1000);
      } else {
        toast({
          title: data?.payload?.message || "Registration failed",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already Have an account?
          <a
            href="/auth/login"
            className="font-medium text-primary hover:underline ml-2"
          >
            Login
          </a>
        </p>
      </div>
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => handleRoleChange("user")}
          variant={role === "user" ? "primary" : "secondary"}
        >
          User
        </Button>
        <Button
          onClick={() => handleRoleChange("organization")}
          variant={role === "organization" ? "primary" : "secondary"}
        >
          Organization
        </Button>
      </div>
      <CommonForm
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        buttonText="Register"
        isButtonDisabled={false}
        imageUpload={{
          onImageSelect: setImageFile,
          selectedImage: imageFile,
        }}
      />
    </div>
  );
}

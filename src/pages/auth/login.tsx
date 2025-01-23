import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { forgotPassword, loginUser, resetPassword } from "@/store/auth-slice";
import CommonForm from "@/common/form";
import { loginFormControls } from "@/config";
import { UserFormData } from "@/common/formdata";
import { AppDispatch } from "@/store/store";

const AuthLogin: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    password: "",
  });
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const dispatch: AppDispatch = useDispatch();
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message });
      } else {
        toast({ title: data?.payload?.message, variant: "destructive" });
      }
    });
  };

  const handleForgotPassword = async () => {
    try {
      const response = await dispatch(forgotPassword(email)).unwrap();
      toast({ title: response.message });
      setStep(2);
    } catch (error: any) {
      toast({ title: error || "Failed to send OTP", variant: "destructive" });
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await dispatch(
        resetPassword({ email, otp, newPassword })
      ).unwrap();
      toast({ title: response.message });
      setStep(1);
    } catch (error: any) {
      toast({
        title: error || "Failed to reset password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign In to your account
        </h1>
        <p className="mt-2">
          Don't Have an account
          <a
            href="/auth/register"
            className="font-medium text-primary hover:underline ml-2"
          >
            Sign Up
          </a>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        buttonText="Login"
      />
      <Dialog>
        <DialogTrigger asChild>
          <button className="text-sm text-primary hover:underline">
            Forgot Password?
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogDescription>
            {step === 1 && (
              <div>
                <p>Enter your email to receive a password reset OTP.</p>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleForgotPassword} className="mt-4">
                  Send OTP
                </Button>
              </div>
            )}
            {step === 2 && (
              <div>
                <p>Enter the OTP sent to your email and set a new password.</p>
                <Input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mb-2"
                />
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button onClick={handleResetPassword} className="mt-4">
                  Reset Password
                </Button>
              </div>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthLogin;

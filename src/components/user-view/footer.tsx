import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UserFooter() {
  const [dialogContent, setDialogContent] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openDialog = (content: string) => {
    setDialogContent(content);
    setIsOpen(true);
  };

  return (
    <footer className="bg-black text-white py-6 px-4 mt-auto w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Left: Copyright */}
        <p className="text-sm">© 2025 Fundraising App. All rights reserved.</p>

        {/* Right: Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Button
            variant="link"
            className="text-white"
            onClick={() =>
              openDialog(
                "Thank you for your invaluable support of our fundraising platform. We urge you to donate only to verified organizations, as they have undergone a thorough verification process to ensure that your contributions are reaching the right hands. Please remember, donations are vital for the success of the causes we support, and we are committed to providing a safe and transparent environment for you to contribute. So far, we have worked hard to establish a robust verification system for organizations, allowing them to provide necessary details, including account information for offline donations, while ensuring that their status is updated upon verification. Our platform also enables users to view, like, and comment on posts created by registered organizations. We are continually improving to make your experience seamless and impactful. We thank you for your generosity and encourage you to be part of this meaningful journey"
              )
            }
          >
            Instructions
          </Button>
          <Button
            variant="link"
            className="text-white"
            onClick={() =>
              openDialog(
                "About Us: Our mission is to support fundraising for impactful causes."
              )
            }
          >
            About
          </Button>
          <Button
            variant="link"
            className="text-white"
            onClick={() =>
              openDialog(
                "Contact Us: Reach out via email at saif.shabir12@gmail.com"
              )
            }
          >
            Contact
          </Button>
        </div>
      </div>

      {/* Dialog for displaying information */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Help Desk</DialogTitle>
          </DialogHeader>
          <p>{dialogContent}</p>
        </DialogContent>
      </Dialog>
    </footer>
  );
}

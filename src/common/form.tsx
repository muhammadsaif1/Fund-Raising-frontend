import { Button } from "@/components/ui/button";
import { UserFormData } from "./formdata";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type FormControl = {
  name: string;
  label: string;
  componentType: "input" | "textarea" | "file" | "select";
  placeholder?: string;
  type?: string;
  options?: { label: string; value: string | boolean }[];
};

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  selectedImage: File | null;
}

interface CommonFormProps {
  formControls: FormControl[];
  formData: UserFormData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  buttonText?: string;
  isButtonDisabled?: boolean;
  imageUpload?: ImageUploadProps;
}

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isButtonDisabled,
  imageUpload,
}: CommonFormProps) {
  function renderInputsByComponentId(getControlItem: FormControl) {
    let element = null;
    const value = formData[getControlItem.name as keyof UserFormData] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type || "text"}
            value={value as string}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            value={value as string}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      case "file":
        element = (
          <>
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setFormData((prev) => ({
                    ...prev,
                    [getControlItem.name]: file,
                  }));
                  imageUpload?.onImageSelect(file);
                }
              }}
            />
            {imageUpload?.selectedImage && (
              <p className="text-sm mt-2">
                Selected Image: {imageUpload.selectedImage.name}
              </p>
            )}
          </>
        );
        break;

      case "select":
        element = (
          <select
            name={getControlItem.name}
            id={getControlItem.name}
            value={formData[getControlItem.name] === true ? "true" : "false"}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value === "true",
              })
            }
            className="border rounded p-2"
          >
            {getControlItem.options?.map((option) => (
              <option
                key={option.value.toString()}
                value={option.value.toString()}
              >
                {option.label}
              </option>
            ))}
          </select>
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type || "text"}
            value={value as string}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }
    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentId(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isButtonDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;

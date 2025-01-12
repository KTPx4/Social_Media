import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import apiClient from "../../utils/apiClient";

interface DialogBoxProps {
  setIsVisible: (visible: boolean) => void;
  visible: boolean;
}

const DialogBox = ({ visible, setIsVisible }: DialogBoxProps) => {
  const [fieldStateError, setFieldStateError] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  async function handleSendEmail() {
    let fliedError = "";
    if (!fieldValue) {
      fliedError = "This field can not be empty";
    }
    if (!fliedError) {
      try {
        await apiClient.post("/user/reset", { username: fieldValue });

        setIsVisible(false);
      } catch (err) {
        if (err instanceof Error) {
          fliedError = err.message;
        }
      }
    }
    setFieldStateError(fliedError);
  }
  const footerContent = (
    <div>
      <Button
        label="Send Recover email"
        icon="pi pi-check"
        onClick={handleSendEmail}
        autoFocus
      />
    </div>
  );

  return (
    <div className="card flex justify-content-center">
      <Dialog
        header="Recover password"
        visible={visible}
        style={{ width: "50vw", background: "white" }}
        onHide={() => {
          if (!visible) return;
          setIsVisible(false);
        }}
        footer={footerContent}
      >
        <InputText
          className="w-full"
          placeholder="Enter username"
          onChange={(e) => {
            setFieldValue(e.target.value);
          }}
        ></InputText>
        <p className="text-xs text-red-700">{fieldStateError}</p>
      </Dialog>
    </div>
  );
};

export default DialogBox;

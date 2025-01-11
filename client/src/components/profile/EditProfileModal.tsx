import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import { InputText } from "primereact/inputtext";
interface ProfileModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const EditProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  setVisible,
}: ProfileModalProps) => {
  const [fieldStateError, setFieldStateError] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const footerContent = (
    <div>
      <Button
        label="Send Recover email"
        icon="pi pi-check"
        onClick={() => setVisible(false)}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header="Recover password"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
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
  );
};

export default EditProfileModal;

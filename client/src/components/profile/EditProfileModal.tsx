import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputSwitch } from "primereact/inputswitch";
import { FileUpload } from "primereact/fileupload";
import apiClient from "../../utils/apiClient";
interface ProfileModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const EditProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  setVisible,
}: ProfileModalProps) => {
  const [checked, setChecked] = useState(false);
  const [fieldStateError, setFieldStateError] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File>();

  const onFileSelected = async (event) => {
    const formData = new FormData();
    const file = event.files[0];
    try {
      const data = await apiClient.post("/user/upload", formData);
    } catch (error) {}
    // reader.readAsDataURL(blob);

    // reader.onloadend = function () {
    //   const base64data = reader.result;
    // };
  };
  const onFileClear = async (event) => {
    setSelectedFiles(undefined);
    // const formData = new FormData();
    // const file = event.files[0];
    // try {
    //   const data = await apiClient.post("/user/upload", formData);
    // } catch (error) {}
    // reader.readAsDataURL(blob);

    // reader.onloadend = function () {
    //   const base64data = reader.result;
    // };
  };
  const footerContent = (
    <div>
      <Button
        label="Update Profile"
        icon="pi pi-user-edit"
        onClick={() => setVisible(false)}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header="Recover password"
      visible={visible}
      style={{
        width: "50%",
        height: "auto",
        background: "white",
      }}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
      footer={footerContent}
    >
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "auto", // Adjust as needed
          marginBottom: "",
        }}
      ></div> */}

      <div className="flex flex-column gap-3">
        <Avatar
          shape="circle"
          image="https://picsum.photos/id/237/200/300.jpg"
          style={{
            width: "20vh",
            height: "20vh",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        />
        <FileUpload
          mode="basic"
          name="demo[]"
          url="/api/upload"
          accept="image/*"
          customUpload
          //   uploadHandler={customBase64Uploader}
          onSelect={onFileSelected}
          onClear={onFileClear}
        />
        {/* <FileUpload
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
          name="demo[]"
          url={"/user/upload"}
          multiple
          accept="image/*"
          maxFileSize={1000000}
          emptyTemplate={
            <p className="m-0">
              Drag and drop files to here to edit your profile.
            </p>
          }
        /> */}
        <InputText
          className="w-full"
          placeholder="Edit username"
          onChange={(e) => {
            setFieldValue(e.target.value);
          }}
        ></InputText>
        <InputText
          className="w-full"
          placeholder="Edit user Profile"
          onChange={(e) => {
            setFieldValue(e.target.value);
          }}
        ></InputText>
        <div className="bg-black-alpha-60 px-2 border-round-2xl w-full flex justify-content-between align-items-center">
          <InputSwitch
            checked={checked}
            onChange={(e) => setChecked(e.value)}
          />
          <p className="text-white text-lg"> {checked ? "Male" : "Female"} </p>
        </div>
        <InputText
          type="email"
          className="w-full"
          placeholder="Edit email"
          onChange={(e) => {
            setFieldValue(e.target.value);
          }}
        ></InputText>
        <InputTextarea placeholder="Edit bios"></InputTextarea>
        <InputText
          className="w-full"
          type="number"
          placeholder="Edit Phone"
          onChange={(e) => {
            setFieldValue(e.target.value);
          }}
        ></InputText>
      </div>

      <p className="text-xs text-red-700">{fieldStateError}</p>
    </Dialog>
  );
};

export default EditProfileModal;

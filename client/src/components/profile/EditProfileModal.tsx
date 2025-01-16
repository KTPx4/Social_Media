import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";
import { InputTextarea } from "primereact/inputtextarea";
import { InputSwitch } from "primereact/inputswitch";
import { FileUpload } from "primereact/fileupload";
import apiClient from "../../utils/apiClient";
import { ProgressBar } from "primereact/progressbar";
import useStore from "../../store/useStore";

interface ProfileModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const EditProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  setVisible,
}: ProfileModalProps) => {
  const { myAccount, setMyAccount } = useStore();
  const [selectedFiles, setSelectedFiles] = useState<File>();

  const [checked, setChecked] = useState(false);
  const [userInformation, setUserInformation] = useState({
    username: myAccount?.userName || "", // Default to an empty string if `myAccount.username` is null/undefined
    userProfile: myAccount?.userProfile || "", // Default to an empty string
    name: myAccount?.name || "",
    email: myAccount?.email || "",
    gender: myAccount?.gender || "",
    bio: myAccount?.bio || "",
    phone: myAccount?.phone || "",
  });
  const [formErrors, setFormErrors] = useState({
    file: "",
    username: "",
    userProfile: "",
    name: "",
    email: "",
    gender: "",
    bio: "",
    phone: "",
  });

  const onFileSelected = async (event) => {
    const file = event.files[0];
    const cleanedFile = new File([file], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });
    setSelectedFiles(cleanedFile);
  };
  const onFileClear = async () => {
    setSelectedFiles(undefined);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValid = true;
    const errors = {
      file: "",
      username: "",
      userProfile: "",
      name: "",
      email: "",
      gender: "",
      bio: "",
      phone: "",
    };
    Object.keys(userInformation).forEach((key) => {
      if (
        !userInformation[key as keyof typeof userInformation] &&
        key != "bio" &&
        key != "phone" &&
        key != "gender"
      ) {
        errors[key as keyof typeof userInformation] =
          "This field can not be empty";
        isValid = false;
      }
    });
    if (isValid) {
      try {
        await apiClient.put("/user/update", userInformation);
        // await apiClient.post("/user/update", userInformation);
      } catch (error: unknown) {
        if (error instanceof Error) {
          errors.username = error.message;
          // setFormErrors(errors);
        } else {
          console.log("An unknown error occurred");
        }
      }
      try {
        if (selectedFiles) {
          const formDataPicture = new FormData();
          formDataPicture.append("file", selectedFiles);
          await apiClient.put("/user/upload", formDataPicture);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          errors.file = "file is Invalid";
        } else {
          console.log("An unknown error occurred");
        }
      }
    }
    if (Object.values(errors).every((value) => !value)) {
      const UserData = await apiClient.get("/user/validate");
      setMyAccount(UserData.data.data);
      setVisible(false);
    }
    setFormErrors(errors);
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, cancelButton } = options; // Removed uploadButton

    return (
      <div
        className={`${className} justify-content-center align-items-center`}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {cancelButton}
      </div>
    );
  };

  return (
    <Dialog
      header="Edit Profile"
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
    >
      <form className="flex flex-column" onSubmit={handleSubmit}>
        <Avatar
          shape="circle"
          image={myAccount?.imageUrl}
          style={{
            width: "20vh",
            height: "20vh",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        />
        <FileUpload
          mode="advanced"
          name="demo[]"
          url="/api/upload"
          accept="image/*"
          customUpload
          onSelect={onFileSelected}
          onClear={onFileClear}
          onRemove={onFileClear}
          style={{ margin: "1.5rem 0rem 1.5rem" }}
          headerTemplate={headerTemplate}
        />
        <p className="text-xs text-red-700">{formErrors.file}</p>
        <label htmlFor="username">Username</label>
        <InputText
          id="username"
          value={userInformation.username}
          className="w-full"
          placeholder="Edit username"
          onChange={(e) => {
            setUserInformation({
              ...userInformation,
              username: e.target.value,
            });
          }}
        ></InputText>
        <p className="text-xs text-red-700">{formErrors.username}</p>
        <label htmlFor="userProfile">User Profile</label>
        <InputText
          id="userProfile"
          value={userInformation.userProfile}
          className="w-full"
          placeholder="Edit user Profile"
          onChange={(e) => {
            setUserInformation({
              ...userInformation,
              userProfile: e.target.value,
            });
          }}
        ></InputText>
        <p className="text-xs text-red-700">{formErrors.userProfile}</p>
        <label htmlFor="name">Name</label>
        <InputText
          id="name"
          value={userInformation.name}
          className="w-full"
          placeholder="Edit name"
          onChange={(e) => {
            setUserInformation({
              ...userInformation,
              name: e.target.value,
            });
          }}
        ></InputText>
        <p className="text-xs text-red-700">{formErrors.name}</p>
        <div className="bg-black-alpha-60 px-2 border-round-2xl w-full flex justify-content-between align-items-center mb-4">
          <InputSwitch
            checked={checked}
            onChange={(e) => {
              setChecked(e.value);
              setUserInformation({
                ...userInformation,
                gender: e.value ? "Male" : "Female",
              });
            }}
          />
          <p className="text-white text-lg"> {checked ? "Male" : "Female"} </p>
        </div>
        <label htmlFor="email">Email</label>
        <InputText
          id="email"
          value={userInformation.email}
          type="email"
          className="w-full"
          placeholder="Edit email"
          onChange={(e) => {
            setUserInformation({ ...userInformation, email: e.target.value });
          }}
        ></InputText>
        <p className="text-xs text-red-700">{formErrors.email}</p>
        <label htmlFor="bio">Bio</label>
        <InputTextarea
          id="bio"
          value={userInformation.bio}
          placeholder="Edit bios"
          onChange={(e) => {
            setUserInformation({ ...userInformation, bio: e.target.value });
          }}
        ></InputTextarea>
        <p className="text-xs text-red-700">{formErrors.bio}</p>
        <label htmlFor="phone">Phone</label>
        <InputText
          id="phone"
          value={userInformation.phone}
          className="w-full"
          type="number"
          placeholder="Edit Phone"
          onChange={(e) => {
            setUserInformation({ ...userInformation, phone: e.target.value });
          }}
        ></InputText>
        <p className="text-xs text-red-700">{formErrors.phone}</p>
        <Button
          type="submit"
          className="p-button-secondary w-3 mt-2"
          label="Edit"
        />
      </form>
    </Dialog>
  );
};

export default EditProfileModal;

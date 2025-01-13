// export default ProfilePage;

import { Avatar } from "primereact/avatar";

import { Button } from "primereact/button";

import { data, useNavigate } from "react-router-dom";

import { Menubar } from "primereact/menubar";
import { useContext, useState } from "react";
import EditProfileModal from "../../components/profile/EditProfileModal";
import useStore from "../../store/useStore";

const UserProfilePage = () => {
  const { myAccount } = useStore();
  const userData = JSON.parse(JSON.stringify(myAccount)); // deep copy of myAccount
  Object.keys(userData).forEach((key) => {
    if (!userData[key]) {
      userData[key] = "";
    }
  });
  const navigate = useNavigate(); //  const username = queryParams.get("username"); //  const token = queryParams.get("token"); //  const [passwordError, setPasswordError] = useState(""); //  const [NewPass, setPassword] = useState(""); //  async function handleResetPassword() { //   let error = ""; //   if (!NewPass) { //    error = "This field can not be empty"; //   } else if (NewPass.length < 6 || NewPass.length > 30) { //    error = "Password must be between  6 to 30  characters long"; //   } //   if (!error) { //    try { //     await apiClient.get("/user/reset", { //      params: { username, token, NewPass }, //     }); //     navigate("/"); //    } catch (err) { //     if (err instanceof Error) { //      error = err.message; //     } //    } //   } //   setPasswordError(error); //  }
  const [visible, setVisible] = useState(false);
  const items = [
    {
      label: "Home",

      icon: "pi pi-home",
    },

    {
      label: "Features",

      icon: "pi pi-star",
    },

    {
      label: "Projects",

      icon: "pi pi-search",

      items: [
        {
          label: "Components",

          icon: "pi pi-bolt",
        },

        {
          label: "Blocks",

          icon: "pi pi-server",
        },

        {
          label: "UI Kit",

          icon: "pi pi-pencil",
        },

        {
          label: "Templates",

          icon: "pi pi-palette",

          items: [
            {
              label: "Apollo",

              icon: "pi pi-palette",
            },

            {
              label: "Ultima",

              icon: "pi pi-palette",
            },
          ],
        },
      ],
    },

    {
      label: "Contact",

      icon: "pi pi-envelope",
    },
  ];

  return (
    <div className="flex-column h-screen w-screen ">
      <EditProfileModal
        setVisible={setVisible}
        visible={visible}
      ></EditProfileModal>
      <div className="flex w-full h-auto">
        <div className="w-4 h-full flex justify-content-center align-items-center ">
          <Avatar
            shape="circle"
            image={myAccount?.imageUrl}
            style={{
              width: "40vh",
              height: "40vh",
              marginRight: "auto",
              marginLeft: "auto",
            }}
          />
        </div>
        <div className="h-auto w-full flex-column pl-8 pb-4 pt-4 w-11">
          <div className="flex gap-4">
            <p>Username: {userData.userName}</p>
            <div className="flex gap-2">
              <Button
                label="Edit profile"
                onClick={() => {
                  setVisible(true);
                }}
              ></Button>
              <Button label="View profile"></Button>
              <Button
                icon="pi pi-spin pi-cog"
                rounded
                text
                aria-label="Filter"
              />
            </div>
          </div>
          <div className="flex justify-content-between w-4">
            <p>3 post</p> <p>3 followers</p> <p>3 following</p>
          </div>
          <p>Name: {userData.name}</p>
          <p>
            Email: <a href={`mailto:${userData.email}`}>{userData.email}</a>
          </p>
          <p>{userData.bio}</p>
        </div>
      </div>
      <div
        className="w-full flex  gap-3

    h-auto pl-4 pb-4 pt-4"
      >
        <div>
          <Avatar
            image="https://picsum.photos/id/237/200/300.jpg"
            size="xlarge"
            shape="circle"
          />
          <p>asdsadsa</p>
        </div>
        <div>
          <Avatar
            image="https://picsum.photos/id/237/200/300.jpg"
            size="xlarge"
            shape="circle"
          />
          <p>asdsadsa</p>
        </div>
        <div>
          <Avatar
            image="https://picsum.photos/id/237/200/300.jpg"
            size="xlarge"
            shape="circle"
          />
          <p>asdsadsa</p>
        </div>
        <div>
          <Avatar
            image="https://picsum.photos/id/237/200/300.jpg"
            size="xlarge"
            shape="circle"
          />
          <p>asdsadsa</p>
        </div>
      </div>
      <div className="w-full h-auto ">
        <Menubar model={items} />
      </div>
    </div>
  );
};

export default UserProfilePage;

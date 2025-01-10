import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MenuBar from "../../components/MenuBar";
import { Menubar } from "primereact/menubar";

const ProfilePage = () => {
  //   const location = useLocation();
  //   const queryParams = new URLSearchParams(location.search);
  //   const navigate = useNavigate();
  //   const username = queryParams.get("username");
  //   const token = queryParams.get("token");

  //   const [passwordError, setPasswordError] = useState("");
  //   const [NewPass, setPassword] = useState("");

  //   async function handleResetPassword() {
  //     let error = "";
  //     if (!NewPass) {
  //       error = "This field can not be empty";
  //     } else if (NewPass.length < 6 || NewPass.length > 30) {
  //       error = "Password must be between  6 to 30  characters long";
  //     }
  //     if (!error) {
  //       try {
  //         await apiClient.get("/user/reset", {
  //           params: { username, token, NewPass },
  //         });
  //         navigate("/");
  //       } catch (err) {
  //         if (err instanceof Error) {
  //           error = err.message;
  //         }
  //       }
  //     }
  //     setPasswordError(error);
  //   }
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
      <div className="flex w-full h-auto">
        <div className="w-full h-full flex justify-content-center align-items-center w-4">
          <img
            src="https://fastly.picsum.photos/id/808/536/354.jpg?hmac=Wj27FehH0gnLQFDE1TwjgdDrLIByp-1dOSh9UznzPyw"
            className="border-circle w-17rem h-17rem  m-2 bg-primary font-bold flex align-items-center justify-content-center"
          ></img>
        </div>
        <div className="h-auto w-full flex-column pl-8 pb-4 pt-4 w-11">
          <div className="flex gap-4">
            <p>phucnguyenhoang3839</p>
            <div className="flex gap-2">
              <Button label="Edit profile"> </Button>
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
            <p>3 post</p>
            <p>3 followers</p>
            <p>3 following</p>
          </div>
          <p>Phuc Nguyen</p>
          <a>sdfsdfdsf</a>
          <p>hello every one </p>
        </div>
      </div>
      <div className="w-full h-auto pl-4 pb-4 pt-4">
        <div>
          {" "}
          <Avatar
            image="/images/avatar/amyelsner.png"
            size="xlarge"
            shape="circle"
          />
          <p>asdsadsa</p>
        </div>
      </div>
      <div className="w-full h-full ">
        <div className="card">
          <Menubar model={items} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

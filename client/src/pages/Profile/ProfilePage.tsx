import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

  return (
    <div className="flex-column h-screen w-screen">
      <div className="bg-black-alpha-10 flex  w-full h-auto">
        <div className="bg-red-100 w-full h-full flex justify-content-center align-items-center w-1">
          <Avatar
            image="/images/avatar/amyelsner.png"
            size="xlarge"
            shape="circle"
          />
        </div>
        <div className="bg-blue-700  h-auto w-full flex-column pl-8 pb-4 pt-4">
          <div className="flex gap-4">
            <p>phucnguyenhoang3839</p>
            <div className="flex gap-2">
              <Button label="Edit profile"> </Button>
              <Button label="View profile"></Button>
              <Button icon="pi pi-check" rounded text aria-label="Filter" />
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
      <div className="bg-pink-700 w-full h-auto pb-4 pt-4">
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
      <div className="bg-red-700 w-full h-full"></div>
    </div>
  );
};

export default ProfilePage;

// export default ProfilePage;

import { Avatar } from "primereact/avatar";

import { Button } from "primereact/button";

import { data, useNavigate } from "react-router-dom";

import { Menubar } from "primereact/menubar";
import { useContext, useRef, useState } from "react";
import EditProfileModal from "../../components/profile/EditProfileModal";
import useStore from "../../store/useStore";
import ProfilePostsGrid from "../../components/profile/ProfilePostsGrid";
import { Toast } from "primereact/toast";
import ListPostComponent from "../../components/profile/ListPostComponent.tsx";

const ProfilePage = () => {
  const { myAccount } = useStore();
  const navigate = useNavigate(); //  const username = queryParams.get("username"); //  const token = queryParams.get("token"); //  const [passwordError, setPasswordError] = useState(""); //  const [NewPass, setPassword] = useState(""); //  async function handleResetPassword() { //   let error = ""; //   if (!NewPass) { //    error = "This field can not be empty"; //   } else if (NewPass.length < 6 || NewPass.length > 30) { //    error = "Password must be between  6 to 30  characters long"; //   } //   if (!error) { //    try { //     await apiClient.get("/user/reset", { //      params: { username, token, NewPass }, //     }); //     navigate("/"); //    } catch (err) { //     if (err instanceof Error) { //      error = err.message; //     } //    } //   } //   setPasswordError(error); //  }
  const [visible, setVisible] = useState(false);
  const [postType, setPostType] = useState("posts");
  const handleSetPostType = (type: string) => {
    return () => {
      setPostType(type);
    };
  };


  const items = [
    {
      label: "POSTS",
      icon: "pi pi-table",
      command: handleSetPostType("posts"),
    },
    {
      separator: true,
    },
    {
      label: "SAVED",
      icon: "pi pi-bookmark",
      command: handleSetPostType("saves"),
    },
    {
      separator: true,
    },
    // {
    //   label: "TAGGED",
    //   icon: "pi pi-tag",
    // },
    // {
    //   separator: true,
    // },
  ];

  return (
    <div className="flex-column h-screen w-screen " style={{
      height: "100vh",
      overflow: "auto"
    }}>
      <EditProfileModal
        setVisible={setVisible}
        visible={visible}
      ></EditProfileModal>
      <div style={{display: "flex", justifyContent: "center"}}>
        <div className="flex h-auto" style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10
        }}>
          {/*<div className="w-4 h-full flex justify-content-center align-items-center p-4 ">*/}
          {/*</div>*/}
          <Avatar
              shape="circle"
              image={myAccount?.imageUrl}
              style={{
                minWidth: "100px",
                minHeight: "100px",
                marginRight: "auto",
                marginLeft: "auto",
              }}
          />
          <div className="h-auto w-full flex-column pl-8 pb-4 pt-4 w-11">
            <div className="flex gap-4">
              <p>Username: {myAccount?.userName}</p>
              <div className="flex gap-2">
                <Button
                    label="Edit profile"
                    onClick={() => {
                      setVisible(true);
                    }}
                ></Button>
                <Button
                    icon="pi pi-spin pi-cog"
                    rounded
                    text
                    aria-label="Filter"
                />
              </div>
            </div>
            <div className="flex gap-4 w-4" style={{}}>
              <p style={{textAlign: "center"}}>{myAccount?.countFollowers} Followers </p>
              <p style={{textAlign: "center"}}>{myAccount?.countFollowings} Followings </p>
              <p style={{textAlign: "center"}}>{myAccount?.countPosts} Posts</p>
            </div>
            <p>Name: {myAccount?.name}</p>
            <p>
              Email: <a href={`mailto:${myAccount?.email}`}>{myAccount?.email}</a>
            </p>
            <p>{myAccount?.bio}</p>
          </div>
        </div>
      </div>

      <div className="w-full h-auto ">
        <Menubar model={items} style={{background: "transparent", border: "none"}}/>
        {/*<Toast ref={toast} /> */}
        {/*<ProfilePostsGrid*/}
        {/*  postType={postType}*/}
        {/*  userProfile={myAccount?.userProfile}*/}
        {/*></ProfilePostsGrid>*/}
        <ListPostComponent userProfile={myAccount?.userProfile} postType={postType}/>
      </div>
    </div>
  );
};

export default ProfilePage;

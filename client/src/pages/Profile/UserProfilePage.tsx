// export default ProfilePage;

import { Avatar } from "primereact/avatar";

import { Button } from "primereact/button";

import { data, useNavigate, useParams } from "react-router-dom";

import { Menubar } from "primereact/menubar";
import { useContext, useEffect, useState } from "react";
import EditProfileModal from "../../components/profile/EditProfileModal";
import useStore from "../../store/useStore";
import apiClient from "../../utils/apiClient";
import ResourcesErrorCard from "../../components/ResourcesErrorCard";
import { ThemeContext } from "../../ThemeContext";
import ProfilePostsGrid from "../../components/profile/ProfilePostsGrid";

const UserProfilePage = () => {
  const themeContext = useContext(ThemeContext);
  const { currentTheme, changeTheme } = themeContext;
  // const queryParams = new URLSearchParams(location.search);
  const { userProfileString } = useParams<{ userProfileString: string }>();
  const navigate = useNavigate();
  const { userId } = useStore();
  // const userProfileString = queryParams.get("userProfile");
  const textColor = currentTheme.getText();
  const backgroundColor = currentTheme.getBackground();
  const keyTheme = currentTheme.getKey();
  const [userProfile, setUserProfile] = useState<Record<string, any> | null>(
    null
  );
  const [postType, setPostType] = useState("posts");
  const [profileError, setProfileError] = useState("");
  useEffect(() => {
    // if (userId == id) navigate("../profile");

    async function getUserInfo() {
      try {
        const userData = await apiClient.get(
          `/user/profile/${userProfileString}`
        );
        if (userData.data.data.id == userId && userId) {
          navigate("../profile");
        }
        setUserProfile(userData.data);
      } catch (error) {
        if (error instanceof Error) {
          setProfileError(error.message);
        }
      }
    }
    getUserInfo();
  }, []);
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
    {
      label: "TAGGED",
      icon: "pi pi-tag",
    },
    {
      separator: true,
    },
  ];

  if (!userProfile)
    return (
      <ResourcesErrorCard
        backgroundColor={backgroundColor}
        keyTheme={keyTheme}
        textColor={textColor}
        errorText={profileError}
      />
    );

  return (
    <div className="flex-column h-screen w-screen ">
      {/* <EditProfileModal
        setVisible={setVisible}
        visible={visible}
      ></EditProfileModal> */}
      <div className="flex w-full h-auto">
        <div className="w-4 h-full flex justify-content-center align-items-center p-4 ">
          <Avatar
            shape="circle"
            image={userProfile?.data.imageUrl}
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
            <p>Username: {userProfile?.data.userName}</p>
            <div className="flex gap-2">
              <Button icon="pi pi-user-plus" rounded text aria-label="Filter" />
              <Button icon="pi pi-ban" rounded text aria-label="Filter" />
              <Button icon="pi pi-flag" rounded text aria-label="Filter" />
              <Button
                icon="pi pi-spin pi-cog"
                rounded
                text
                aria-label="Filter"
              />
            </div>
          </div>
          <div className="flex gap-4 w-4">
            <p>3 Friends </p> <p>3 Posts</p>
          </div>
          <p>Name: {userProfile?.data.name}</p>
          <p>
            Email:{" "}
            <a href={`mailto:${userProfile?.data.email}`}>
              {userProfile?.data.email}
            </a>
          </p>
          <p>{userProfile?.data.bio}</p>
        </div>
      </div>

      <div className="w-full h-auto ">
        <Menubar model={items} />
        <ProfilePostsGrid
          postType={postType}
          userProfile={userProfile?.data.userProfile}
        ></ProfilePostsGrid>
      </div>
    </div>
  );
};

export default UserProfilePage;

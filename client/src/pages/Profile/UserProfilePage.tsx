// export default ProfilePage;

import { Avatar } from "primereact/avatar";

import { Button } from "primereact/button";

import { data, useNavigate, useParams } from "react-router-dom";

import { Menubar } from "primereact/menubar";
import React, {useContext, useEffect, useRef, useState} from "react";
import EditProfileModal from "../../components/profile/EditProfileModal";
import useStore from "../../store/useStore";
import apiClient from "../../utils/apiClient";
import ResourcesErrorCard from "../../components/ResourcesErrorCard";
import { ThemeContext } from "../../ThemeContext";
import ProfilePostsGrid from "../../components/profile/ProfilePostsGrid";
import ListPostComponent from "../../components/profile/ListPostComponent.tsx";
import {ProgressSpinner} from "primereact/progressspinner";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;
import PostCard from "../../components/post/PostCard.tsx";

const FriendStatus = {
  Normal: 0, Prevented : 1, Obstructed :2
}
const FriendType = {
    None : 0, Waiting : 1, Response : 2
}

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
  const [iconStatus, setIconStatus] = useState("")
  const [iconFriendType, setIconFriendType] = useState("")
  const [titleStatus, setTitleStatus] = useState("")
  const [titleFriendType, setTitleFriendType] = useState("")
  const [isFollow, setIsFollow] = useState(false)


  const[page, setPage]= useState(1)
  const [listPost, setListPost] = useState([])
  const [canLoad, setCanLoad] = useState(true)
  const [loading, setLoading] = useState(true)
  const [listComponentPost, setListComponentPost] = useState([])
  const [firstLoad, setFirtLoad]= useState(true)
  const refBody = useRef(null);

  useEffect(() => {
    if(firstLoad)
    {
      const loadProfile = async() =>{
        var rs = await apiClient.get(`/user/profile/${userProfileString}`)
        var status = rs.status
        if(status === 200)
        {
          setUserProfile(rs.data)
          setFirtLoad(false)
          if(data) {
            var iconStatus = data.friendStatus == FriendStatus.Normal ? "pi-ban" : "pi-unlock"
            var titleStatus = data.friendStatus == FriendStatus.Normal ? "Block" : "UnBlocked"
            var iconTypeFriend = data.isFriend ? "pi-user-minus" :
                (data.friendType === FriendType.None ? "pi-user-plus" :
                        (data.friendType === FriendType.Waiting ? "pi-times-circle" : "pi-check-circle")
                )
            var titleType = data.isFriend ? "Remove" :
                (data.friendType === FriendType.None ? "Add friend" :
                        (data.friendType === FriendType.Waiting ? "Cancel request" : "Accept request")
                )
            setIconStatus(iconStatus)
            setTitleStatus(titleStatus)
            setIconFriendType(iconTypeFriend)
            setTitleFriendType(titleType)
          }
        }
      }
      loadProfile()

    }
  }, [firstLoad]);

  useEffect(() => {
    if(postType)
    {
      setTimeout(()=>{
        loadPost()
      }, 400)
    }
  }, [postType]);

  const handleSetPostType = (type: string) => {
    return () => {
      if(type === postType) return
      setPage(1)
      setPostType(type);
    };
  };
  const onScrollPost = async()=>{
    if(!refBody.current || loading) return
    const { scrollTop, scrollHeight, clientHeight } = refBody.current;

    if (scrollTop + clientHeight >= scrollHeight - 1) {

      await loadPost()
    }
  }
  const loadPost = async()=>{
    if(!canLoad ) return
    setLoading(true)
    try{
      var rs = await apiClient.get(`/user/profile/${userProfileString}/${postType}?page=${page}`)
      var status = rs.status
      if(status === 200)
      {

        var data = rs.data.data
        if(!data || data.length < 1) setCanLoad(false)
        else
        {
          setPage(page+1)
          var newData = data.filter(p => !listPost.map(post => post.id).includes(p.id))
          setListPost((prev) => [...prev, ...newData])
          var newComponents = newData.map((p) => <PostCard post={p} isHideComment={true} key={p.id+Date.now()}/>)
          setListComponentPost((prev) => [...prev, ...newComponents])

        }
      }
    }
    catch (e)
    {
      console.log(e)
    }
    setLoading(false)

  }

  const items = [
    {
      label: "POSTS",
      icon: "pi pi-table",
      command: handleSetPostType("posts"),
    },
    {
      separator: true,
    },
    // {
    //   label: "SAVED",
    //   icon: "pi pi-bookmark",
    //   command: handleSetPostType("saves"),
    // },
    // {
    //   separator: true,
    // },
    // {
    //   label: "TAGGED",
    //   icon: "pi pi-tag",
    // },
    // {
    //   separator: true,
    // },
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
      <div ref={refBody} onScroll={onScrollPost} className="flex-column h-screen w-screen " style={{
        height: "100vh",
        overflow: "auto"
      }}>
        {/* <EditProfileModal
        setVisible={setVisible}
        visible={visible}
      ></EditProfileModal> */}
        <div style={{display: "flex", justifyContent: "center"}}>

          <div className="flex h-auto" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10
          }}>
            {/*<div className="w-4 h-full flex justify-content-center align-items-center p-4 ">*/}
            {/*</div>*/}
            <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
              <Avatar
                  shape="circle"
                  image={userProfile?.data.imageUrl}
                  style={{
                    minWidth: "100px",
                    minHeight: "100px",
                    marginRight: "auto",
                    marginLeft: "auto",
                  }}
              />
              <Button title={isFollow ? "UnFollow" : "Follow"} label="Follow" aria-label="Filter" className={"my-2"}
                      outlined severity="info"/>

            </div>

            <div className="h-auto w-full flex-column pl-8 pb-4 pt-4 w-11">
              <div className="" style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%"
              }}>
                <p style={{margin: 0, fontSize: 20, fontWeight: "bold"}}>{userProfile?.data.userName}</p>
                <div className="flex gap-2">
                  <Button icon={`pi ${iconFriendType}`} title={titleFriendType} rounded text aria-label="Filter"/>
                  <Button icon={`pi ${iconStatus}`} rounded text aria-label="Filter" title={titleStatus}/>
                  <Button icon="pi pi-flag" rounded text aria-label="Filter" title="Report"/>
                  <Button icon="pi pi-comments" rounded text aria-label="Filter" title="Fast chat"/>
                </div>
                <div className="flex gap-4 " style={{}}>
                  <p style={{textAlign: "center"}}>{userProfile?.data.countFollowers} Followers </p>
                  <p style={{textAlign: "center"}}>{userProfile?.data.countFollowings} Followings </p>
                  <p style={{textAlign: "center"}}>{userProfile?.data.countPosts} Posts</p>
                </div>

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
        </div>

        <div className="w-full h-auto ">
          <Menubar model={items} style={{background: "transparent", border: "none"}}/>
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}>

            {listComponentPost?.map((post) => {
              return post
            })}
            {(!listComponentPost || listComponentPost?.length < 1) && !loading  && (
                <h1>Nothing to show here</h1>
            )}
            {loading && (
                <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="4" fill="transparent"
                                 animationDuration=".5s"/>
            )}
          </div>
        </div>
      </div>
  );
};

export default UserProfilePage;

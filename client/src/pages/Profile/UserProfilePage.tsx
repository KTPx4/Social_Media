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
import {Toast} from "primereact/toast";
import {ConfirmDialog} from "primereact/confirmdialog";
import {useWebSocketContext} from "../../store/WebSocketContext.tsx";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import input = Simulate.input;

const FriendStatus = {
  Normal: 0, Prevented : 1, Obstructed :2
}
const FriendType = {
    None : 0, Waiting : 1, Response : 2
}

const UserProfilePage = () => {
  const themeContext = useContext(ThemeContext);
  const { currentTheme, changeTheme } = themeContext;
  const textHintColor = currentTheme.getHint()
  // const queryParams = new URLSearchParams(location.search);
  const { userProfileString } = useParams<{ userProfileString: string }>();
  const navigate = useNavigate();
  const { userId , myAccount} = useStore();
  // const userProfileString = queryParams.get("userProfile");
  const textColor = currentTheme.getText();
  const backgroundColor = currentTheme.getBackground();
  const keyTheme = currentTheme.getKey();
  const [userProfile, setUserProfile] = useState<Record<string, any> | null>(
    null
  );

  const {isConnected, sendDirectMessage } = useWebSocketContext()


  const [postType, setPostType] = useState("posts");
  const [profileError, setProfileError] = useState("");

  const [isFollow, setIsFollow] = useState(false)
  const [countFollower, setCountFollower] = useState(0)
  const [countFollowing, setCountFollowing] = useState(0)
  const [countPost, setCountPost] = useState(0)
  const [friendStatus, setFriendStatus] = useState(FriendStatus.Normal)
  const [friendType, setFriendType] = useState(FriendType.None)
  const [isFriend, setIsFriend] = useState(false);

  const[page, setPage]= useState(1)
  const [listPost, setListPost] = useState([])
  const [canLoad, setCanLoad] = useState(true)
  const [loading, setLoading] = useState(true)
  const [listComponentPost, setListComponentPost] = useState([])
  const [firstLoad, setFirtLoad]= useState(true)
  const refBody = useRef(null);
  const toast = useRef<Toast>(null);
  const [visibleFastChat, setVisibleFastChat] = useState(false);
  const [inputChat, setInputChat] = useState("")
  useEffect(() => {
    if(userProfileString)
    {
      if(myAccount?.userProfile === userProfileString)
      {
        window.location.href = "/home/profile"
      }
    }
  }, [userProfileString]);

  useEffect(() => {
    if(firstLoad)
    {
      const loadProfile = async() =>{
        var rs = await apiClient.get(`/user/profile/${userProfileString}`)
        var status = rs.status
        if(status === 200)
        {
          setUserProfile(rs.data)
          var data = rs.data.data
          setIsFollow(data.isFollow)
          setCountFollower(data.countFollowers)
          setCountFollowing(data.countFollowings)
          setCountPost(data.countPosts)

          setFirtLoad(false)
          if(data) {
            setFriendStatus( data.friendStatus)
            setIsFriend(data.isFriend)
            setFriendType(data.friendType)
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

  const HandleFollow = async() =>{
    var id = userProfile?.data?.id
    if(!id) return
    try{
        var rs = null
       if(isFollow)
       {
         rs = await apiClient.delete(`/user/profile/${id}/follow`)
       }
       else{
         rs = await apiClient.post(`/user/profile/${id}/follow`)
       }
       var status = rs.status
        if(status === 200 || status === 204)
        {
          toast.current?.show({severity:'success', summary: 'Success', detail:'Follow user success', life: 3000});
          setCountFollower(countFollower + (isFollow ? -1 : 1))
          setIsFollow(!isFollow)
        }
        else{
          toast.current?.show({severity:'error', summary: 'Error', detail:'Follow failed', life: 3000});
        }
      }
      catch (e)
      {
        toast.current?.show({severity:'error', summary: 'Error', detail:'Follow failed', life: 3000});
      }
  }

  const HandleFriend = async() =>{
    var id = userProfile?.data?.id
    if(!id) return
    // isFriend ? "pi-user-minus" :
    //     (friendType === FriendType.None ? "pi-user-plus" :
    //             (friendType === FriendType.Waiting ? "pi-times-circle" : "pi-check-circle")
    //     )
    var rs = null
    var newFriend = isFriend
    try{
       if(isFriend || friendType == FriendType.Waiting)
       {
         rs = await apiClient.delete(`/user/profile/${id}/friend`)
         newFriend = false
       }
       else if(!isFriend || friendType == FriendType.None || friendType === FriendType.Response ){
         rs = await apiClient.post(`/user/profile/${id}/friend`)

         newFriend = friendType === FriendType.Response
       }
       var status = rs?.status
       if(status === 200 || status === 204)
       {
         setIsFriend(newFriend)
         var newType =  !(!isFriend && friendType == FriendType.None)? FriendType.None : FriendType.Waiting
         setFriendType(newType)
       }
       else{
         toast.current?.show({severity:'error', summary: 'Error', detail:'Error when action friend', life: 3000});
       }
     }
      catch (e)
      {
        console.log(e)
        toast.current?.show({severity:'error', summary: 'Error', detail:'Error when action friend', life: 3000});

      }
  }
  const HandleStatus =  async() =>{
  //   friendStatus == FriendStatus.Normal
    var id = userProfile?.data?.id
    if(!id) return
    if(friendStatus == FriendStatus.Obstructed) return

    var rs = null

    try{
      if(friendStatus != FriendStatus.Normal)
      {
        rs = await apiClient.delete(`/user/profile/${id}/ban`)
      }
      else{
        rs = await apiClient.post(`/user/profile/${id}/ban`)
      }
      var status = rs?.status
      if(status === 200 || status === 204)
      {
          setFriendStatus(friendStatus == FriendStatus.Normal ? FriendStatus.Prevented : FriendStatus.Normal)
          setVisibleFastChat(false)
      }
      else{
        toast.current?.show({severity:'error', summary: 'Error', detail:'Error when action status', life: 3000});
      }
    }
    catch (e)
    {
      console.log(e)
      toast.current?.show({severity:'error', summary: 'Error', detail:'Error when action status', life: 3000});

    }
  }

  const HandleFastChat= async () =>{
    var id = userProfile?.data?.id
    if(!id)  toast.current?.show({severity:'error', summary: 'Error', detail:'Missing id user', life: 3000});
    var mess = inputChat.trim()
    if(!mess) toast.current?.show({severity:'warn', summary: 'Error', detail:'Please input message', life: 3000});
    if(!isConnected) toast.current?.show({severity:'error', summary: 'Error', detail:'Cant connected to server!', life: 3000});
    var rs = await sendDirectMessage(userId, id, mess)
    if(rs)
    {
      toast.current?.show({severity:'success', summary: 'Message', detail:'Send message success', life: 3000});
    }
    else{
      toast.current?.show({severity:'error', summary: 'Message', detail:'Send message failed', life: 3000});
    }
    setInputChat("")
    setVisibleFastChat(false)
  }

  if (!userProfile)
    return (
      <ResourcesErrorCard
        backgroundColor={backgroundColor}
        keyTheme={keyTheme}
        textColor={textColor}
        errorText={profileError}
      />
    );


  var iconStatus = friendStatus == FriendStatus.Obstructed ? "pi-times" : "pi-ban"
  var titleStatus = friendStatus == FriendStatus.Normal ? "Block" :  friendStatus == FriendStatus.Obstructed ? "Blocked by this user":"UnBlocked"

  var iconTypeFriend = isFriend ? "pi-user-minus" :
      (friendType === FriendType.None ? "pi-user-plus" :
              (friendType === FriendType.Waiting ? "pi-times-circle" : "pi-check-circle")
      )
  var titleType = isFriend ? "Remove friend" :
      (friendType === FriendType.None ? "Add friend" :
              (friendType === FriendType.Waiting ? "Cancel request" : "Accept request")
      )
  var severityType = isFriend ? "info" :
      (friendType === FriendType.None ? "secondary" :
              (friendType === FriendType.Waiting ? "warning" : "success")
      )
  var severityStatus = friendStatus == FriendStatus.Normal ? "secondary" : friendStatus == FriendStatus.Obstructed ? "error" : "warning"

  return (
      <div ref={refBody} onScroll={onScrollPost} className="flex-column h-screen w-screen " style={{
        height: "100vh",
        overflow: "auto"
      }}>
        <Dialog
            className={keyTheme}
            visible={visibleFastChat}
            onHide={() => setVisibleFastChat(false)}
            header="Fast chat"
            // accept={HandleFastChat}
        >
          <div style={{display: "flex", flexDirection: "row", width: "90%", marginLeft: 5}}>
            <Avatar
                shape="circle"
                image={userProfile?.data.imageUrl}
                style={{
                  maxWidth: "50px",
                  maxHeight: "50px",
                }}
            />
            <p style={{margin: "0 10px", fontSize: 18, fontWeight: "bold"}}>{userProfile?.data.userName}</p>
          </div>
          <InputText onChange={(e) => setInputChat(e.target.value)}
                     style={{
                        width: "100%",
                        border: "none",
                        background: "transparent",
                        boxShadow: "none",
                        color: textHintColor
                      }}
                     placeholder={"Write anything..."}
                     onKeyPress={async(e) =>{
                       if(e.key === "Enter"){
                         await HandleFastChat()
                       }
                     }}
          />
          <Button onClick={HandleFastChat} label={"Send"} style={{marginTop: 10, float: "inline-end"}} outlined/>
        </Dialog>
        <Toast ref={toast} />
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
              <Button onClick={HandleFollow}   label={isFollow ? "UnFollow" : "Follow"} aria-label="Filter" className={"my-2"}
                      outlined severity={isFollow ? "info" : "secondary"}/>

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
                  <Button onClick={HandleFriend} icon={`pi ${iconTypeFriend}`} title={titleType} outlined  severity={severityType} aria-label="Filter"/>
                  <Button onClick={HandleStatus} icon={`pi ${iconStatus}`} rounded text aria-label="Filter" title={titleStatus} severity={severityStatus}/>
                  <Button icon="pi pi-flag" rounded text aria-label="Filter" title="Report" />
                  <Button onClick={()=> setVisibleFastChat(true)} icon="pi pi-comments" rounded text aria-label="Filter" title="Fast chat"/>
                </div>
                <div className="flex gap-4 " style={{}}>
                  <p style={{textAlign: "center"}}>{countFollower} Followers </p>
                  <p style={{textAlign: "center"}}>{countFollowing} Followings </p>
                  <p style={{textAlign: "center"}}>{countPost} Posts</p>
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

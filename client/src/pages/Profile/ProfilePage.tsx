// export default ProfilePage;

import { Avatar } from "primereact/avatar";

import { Button } from "primereact/button";

import { data, useNavigate } from "react-router-dom";

import { Menubar } from "primereact/menubar";
import React, {useContext, useEffect, useRef, useState} from "react";
import EditProfileModal from "../../components/profile/EditProfileModal";
import useStore from "../../store/useStore";
import ProfilePostsGrid from "../../components/profile/ProfilePostsGrid";
import { Toast } from "primereact/toast";
import ListPostComponent from "../../components/profile/ListPostComponent.tsx";
import apiClient from "../../utils/apiClient.tsx";
import {ProgressSpinner} from "primereact/progressspinner";
import PostCard from "../../components/post/PostCard.tsx";
import "./profilecss.css"
import {ThemeContext} from "../../ThemeContext.tsx";
const ProfilePage = () => {
  const { myAccount } = useStore();
  const navigate = useNavigate(); //  const username = queryParams.get("username"); //  const token = queryParams.get("token"); //  const [passwordError, setPasswordError] = useState(""); //  const [NewPass, setPassword] = useState(""); //  async function handleResetPassword() { //   let error = ""; //   if (!NewPass) { //    error = "This field can not be empty"; //   } else if (NewPass.length < 6 || NewPass.length > 30) { //    error = "Password must be between  6 to 30  characters long"; //   } //   if (!error) { //    try { //     await apiClient.get("/user/reset", { //      params: { username, token, NewPass }, //     }); //     navigate("/"); //    } catch (err) { //     if (err instanceof Error) { //      error = err.message; //     } //    } //   } //   setPasswordError(error); //  }
  const [visible, setVisible] = useState(false);
  const [postType, setPostType] = useState("posts");
  const [callBackProps, setCallBackProps] = useState(null)
  const refBody = useRef(null);
  const[page, setPage]= useState(1)
  const [listPost, setListPost] = useState([])
  const [canLoad, setCanLoad] = useState(true)
  const [loading, setLoading] = useState(true)
  const [listComponentPost, setListComponentPost] = useState([])
  // theme
  const themeContext = useContext(ThemeContext);
  // @ts-ignore
  const { currentTheme, changeTheme } = themeContext;
  const keyTheme = currentTheme.getKey()

  const handleSetPostType = (type: string) => {
    return () => {
      if(type === postType) return
      setPage(1)
      setListPost([])
      setListComponentPost([])
      setLoading(true)
      setTimeout(()=>{
        setPostType(type);
      }, 400)

    };
  };

  useEffect(() => {
    if(postType)
    {
        setTimeout(()=>{
          loadPost()
        }, 400)
    }
  }, [postType]);

  const loadPost = async()=>{
    if(!canLoad ) return
    setLoading(true)
    try{
      var rs = await apiClient.get(`/user/profile/${myAccount?.userProfile}/${postType}?page=${page}`)
      var status = rs.status
      if(status === 200)
      {

        var dt = rs.data.data
        if(!dt || dt.length < 1) setCanLoad(false)
        else {
          var newData = dt.filter(p => !listPost.map(post => post.id).includes(p.id))
          var dataSource = page === 1 ? dt : newData
          var newComponents = dataSource.map((p) => <PostCard post={p} isHideComment={false} key={p.id+Date.now()} />)

          if(page === 1)
          {
            setListPost(dt)

            setListComponentPost(newComponents)
          }
          else{
            setListPost((prev) => [...prev, ...newData])

            setListComponentPost((prev) => [...prev, ...newComponents])
          }
          setPage(page+1)
        }

      }
    }
    catch (e)
    {
      console.log(e)
    }
    setLoading(false)

  }

  const onScrollPost = async()=>{
    if(!refBody.current || loading) return
    const { scrollTop, scrollHeight, clientHeight } = refBody.current;

    if (scrollTop + clientHeight >= scrollHeight - 1) {

      await loadPost()
    }
  }

  const items = [
    {
      label: "POSTS",
      icon: "pi pi-table",
      command: handleSetPostType("posts"),
      className: postType === "posts" ? "menu-active" : "menu-default",
    },
    {
      separator: true,
    },
    {
      label: "SAVED",
      icon: "pi pi-bookmark",
      command: handleSetPostType("saves"),
      className: postType === "saves" ? "menu-active" : "menu-default",
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
    <div ref={refBody} onScroll={onScrollPost} className="flex-column h-screen w-screen " style={{
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

      <div className={"w-full h-auto " +keyTheme}>
        <Menubar model={items} style={{background: "transparent", border: "none"}}/>
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>

          {listComponentPost?.map((post)=>{
            return post
          })}
          {(!listComponentPost || listComponentPost?.length < 1) && !loading && (
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

export default ProfilePage;

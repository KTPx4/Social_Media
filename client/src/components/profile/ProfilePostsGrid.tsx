import React, { useEffect, useRef, useState } from "react";
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
import { Image } from "primereact/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { Card } from "primereact/card";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
interface ProfileModalProps {
  userProfile: string;
}

const ProfilePostsGrid: React.FC<ProfileModalProps> = ({
  userProfile,
}: ProfileModalProps) => {
  const [page, setPage] = useState(2);
  const navigate = useNavigate();
  const [checkHasMore, setCheckHasMore] = useState(true);
  const [items, setItems] = useState([]);
  const token = useRef("");
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("token");
    token.current = localToken || sessionToken || "";
    apiClient
      .get(`/user/profile/${userProfile}/posts`, {
        params: {
          page: 1,
        },
      })
      .then((res) => setItems(res.data.data));
  }, []);
  const fetchMoreData = () => {
    apiClient
      .get(`/user/profile/${userProfile}/posts`, {
        params: {
          page,
        },
      })
      .then((res) => {
        setItems((prevItems) => [...prevItems, ...res.data.data]);
        res.data.data > 0 ? setCheckHasMore(true) : setCheckHasMore(false);
      })
      .catch((err) => console.log(err));
    setPage((prevIndex) => prevIndex + 1);
  };
  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMoreData}
      hasMore={checkHasMore}
      loader={
        <div
          className="flex justify-content-center align-items-center w-full mt-2"
          key={0}
        >
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
        </div>
      }
      endMessage={
        <p style={{ textAlign: "center", width: "100%", marginTop: "20px" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
      style={{
        backgroundColor: "transparent",
        display: "flex",
        flexWrap: "wrap",
        gap: "3%",
        margin: "0px  20px 0px ",
      }}
    >
      {items &&
        items.map((item) => (
          <Button
            key={item.id}
            style={{
              marginTop: "2vh",
              flexGrow: 0,
              flexShrink: 0,
              flexBasis: "30%",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
            onClick={() => navigate(`../post/${item.id}`)}
            outlined
          >
            <Image
              indicatorIcon={<i className="pi pi-search"></i>}
              prefix=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                maxWidth: "100%", // Ensure it doesn’t exceed parent width
                maxHeight: "100%", // Ensure it doesn’t exceed parent height
              }}
              src={item.listMedia[0].mediaUrl + token.current}
              alt="Image"
            />
          </Button>
        ))}
      {/* <div className="container">
        <div className="row"></div>
      </div> */}
    </InfiniteScroll>
  );
  // const loadMoreHandler = async () => {
  //   try {
  //     // setPage((prevState) => prevState + 1);
  //     const postData = await apiClient("/user/profile/px4/posts", {
  //       params: { page },
  //     });
  //     if (postData?.data.length === 0) {
  //       setCheckHasMore(false);
  //     }
  //     // items.push(
  //     //   postData?.data.map((post) => (
  //     //     <Image src={post.authorId} alt="Image" width="250" />
  //     //   ))
  //     // );
  //     const addedItems = [...items, postData?.data.data];
  //     setItems(addedItems);
  //     // items.push(postData?.data);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.log(error.message);
  //     }
  //   }
  // };
  // useEffect(() => {
  //   loadMoreHandler();
  // }, []);
  // return (
  //   <InfiniteScroll
  //     pageStart={page}
  //     loadMore={loadMoreHandler}
  //     hasMore={checkHasMore}
  //     loader={
  //       <div className="loader" key={0}>
  //         Loading ...
  //       </div>
  //     }
  //   >
  //     {items.map((post) => (
  //       <Image key={post.id} src={post.mediaUrl} alt="Image" width="250" />
  //     ))}
  //   </InfiniteScroll>
  // );
  // const [items, setItems] = useState([]);
  // const [hasMore, setHasMore] = useState(true);
  // const [index, setIndex] = useState(2);
  // useEffect(() => {
  //   axios
  //     .get("https://api.escuelajs.co/api/v1/products?offset=10&limit=12")
  //     .then((res) => setItems(res.data))
  //     .catch((err) => console.log(err));
  // }, []);
  // const fetchMoreData = () => {
  //   axios
  //     .get(`https://api.escuelajs.co/api/v1/products?offset=${index}0&limit=12`)
  //     .then((res) => {
  //       setItems((prevItems) => [...prevItems, ...res.data]);
  //       res.data.length > 0 ? setHasMore(true) : setHasMore(false);
  //     })
  //     .catch((err) => console.log(err));
  //   setIndex((prevIndex) => prevIndex + 1);
  // };
  // return (
  //   <InfiniteScroll
  //     dataLength={items.length}
  //     next={fetchMoreData}
  //     hasMore={hasMore}
  //     loader={
  //       <div className="loader" key={0}>
  //         Loading ...
  //       </div>
  //     }
  //     endMessage={
  //       <p style={{ textAlign: "center" }}>
  //         <b>Yay! You have seen it all</b>
  //       </p>
  //     }
  //     style={{
  //       backgroundColor: "transparent",
  //       display: "flex",
  //       flexWrap: "wrap",
  //     }}
  //   >
  //     {items &&
  //       items.map((item) => (
  //         <Button
  //           key={item.id}
  //           style={{
  //             flexGrow: 0,
  //             flexShrink: 0,
  //             flexBasis: "33.3333%",
  //             justifyContent: "center",
  //             alignItems: "center",
  //           }}
  //           outlined
  //         >
  //           <Image src="https://picsum.photos/id/237/200/300" alt="Image" />
  //         </Button>
  //       ))}
  //     {/* <div className="container">
  //       <div className="row"></div>
  //     </div> */}
  //   </InfiniteScroll>
  // );
};

export default ProfilePostsGrid;

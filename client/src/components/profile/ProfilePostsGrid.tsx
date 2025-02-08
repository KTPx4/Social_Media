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
import { id } from "date-fns/locale";
interface ProfileModalProps {
  userProfile: string;
  postType: string;
}

const ProfilePostsGrid: React.FC<ProfileModalProps> = ({
  userProfile,
  postType,
}: ProfileModalProps) => {
  const [page, setPage] = useState(2);

  const [checkHasMore, setCheckHasMore] = useState(true);
  const [items, setItems] = useState([]);
  const token = useRef("");
  useEffect(() => {
    const initializeData = async () => {
      const localToken = localStorage.getItem("token");
      const sessionToken = sessionStorage.getItem("token");
      token.current = localToken || sessionToken || "";

      try {
        await apiClient
          .get(`/user/profile/${userProfile}/${postType}`, {
            params: {
              page: 1,
            },
          })
          .then((res) => setItems(res.data.data))
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error.message);
      }
    };

    initializeData();
  }, [userProfile, postType]);
  const fetchMoreData = async () => {
    await apiClient
      .get(`/user/profile/${userProfile}/${postType}`, {
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
        gap: "2%",
        justifyContent: "space-between", // Ensures proper spacing
        margin: "0px 20px 0px",
      }}
    >
      {items &&
        items.map((item) => (
          <Button
            key={item.id}
            style={{
              borderColor: "darkgray",
              marginTop: "2vh",
              flexGrow: 0,
              flexShrink: 0,
              flexBasis: "30%",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
            onClick={() => {
              window.location.href = `/post/${item.id}`;
            }}
            outlined
          >
            <img
              className="bg-contain"
              src={item.listMedia[0].mediaUrl + token.current}
              alt=""
            />
            {/* <Image
              indicatorIcon={<i className="pi pi-search"></i>}
              prefix=""
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%", // Sets the fixed height
                flexGrow: 0,
                flexShrink: 0,
              }}
              key={item.id}
              src={item.listMedia[0].mediaUrl + token.current}
              alt="Image"
            /> */}
          </Button>
        ))}
      {/* <div className="container">
        <div className="row"></div>
      </div> */}
    </InfiniteScroll>
  );
};

export default ProfilePostsGrid;

import React, { useContext, useState } from "react";
import { Button } from "primereact/button";
import "./Layout.css";
import { Outlet, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../ThemeContext.tsx";
import CreatePostModal from "../post/CreatePostModal.tsx";
import useStore from "../../store/useStore.tsx";
const Layout: React.FC = () => {
  const { myAccount } = useStore();

  // @ts-ignore
  const navigate = useNavigate();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  // Hàm để hiển thị và ẩn modal
  // @ts-ignore
  const showModal = () => setModalVisible(true);
  // @ts-ignore
  const hideModal = () => setModalVisible(false);

  // theme
  const themeContext = useContext(ThemeContext);
  // @ts-ignore
  const { currentTheme, changeTheme } = themeContext;
  const textColor = currentTheme.getText();
  // @ts-ignore
  const textHintColor = currentTheme.getHint();
  // @ts-ignore
  const captionColor = currentTheme.getCaption();
  const backgroundColor = currentTheme.getBackground();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="body-main-content"
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
          width: "100%",
          height: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <CreatePostModal visible={isOpenCreate} setVisible={setIsOpenCreate} />
        {/* Nav-bar dọc */}
        <div className="app-navbar">
          <div
            className="navbar-header"
            style={{ height: "80%", color: textColor }}
          >
            <p
              className="font-italic text-4xl mb-4"
              style={{
                marginLeft: 15,
                fontFamily: "Arizonia, serif",
                fontSize: "40px !important",
                color: textColor,
              }}
            >
              Internal
            </p>

            {/*<span className="instagram-logo">Insternal</span>*/}
            <div
              style={{
                color: `${textColor}`,
                height: "60%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
              <Button
                icon="pi pi-home"
                label="Home"
                className="navbar-item"
                style={{ color: textColor }}
              />
              <Button
                icon="pi pi-search"
                label="Search"
                className="navbar-item"
                style={{ color: textColor }}
              />
              {/*<Button icon="pi pi-compass" label="Explore" className="navbar-item"/>*/}
              {/*<Button icon="pi pi-video" label="Reels" className="navbar-item"/>*/}
              <Button
                onClick={() => setIsOpenCreate(true)}
                icon="pi pi-plus"
                label="Create"
                className="navbar-item"
                style={{ color: textColor }}
              />

              <Button
                icon="pi pi-bell"
                label="Notifications"
                className="navbar-item"
                badge="2"
                badgeClassName="red-badge"
                style={{ color: textColor }}
              />
              <Button
                icon="pi pi-comments"
                label="Messages"
                className="navbar-item"
                style={{ color: textColor }}
              />
            </div>
          </div>
          <div
            className="navbar-menu"
            style={{
              height: "20%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <Button
              className="navbar-item"
              label="Profile"
              icon={
                <img
                  src={myAccount?.imageUrl}
                  alt="Profile"
                  className="profile-icon"
                />
              }
              onClick={() => {
                window.location.href = "/home/profile";
              }}
              style={{ color: textColor }}
            />
            {/*<Button icon="pi pi-comments" label="Threads" className="navbar-item"/>*/}
            <Button
              icon="pi pi-bars"
              label="More"
              className="navbar-item"
              style={{ color: textColor }}
            />
          </div>
        </div>
        {/*body*/}
        {/* Nội dung */}
        <Outlet />
      </div>
      {/* Nav-bar ngang */}
      <div
        className="horizontal-navbar"
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "60px",
          backgroundColor: "#222",
          display: "none",
          justifyContent: "space-evenly",
          alignItems: "center",
          zIndex: 999,
          // Ẩn hiện dựa trên media query
        }}
      >
        <Button
          icon="pi pi-home"
          rounded
          text
          className="horizontal-navbar-item"
        />
        <Button
          icon="pi pi-search"
          rounded
          text
          className="horizontal-navbar-item"
        />
        <Button
          onClick={() => setIsOpenCreate(true)}
          icon="pi pi-plus"
          rounded
          text
          className="horizontal-navbar-item"
        />
        <Button
          icon="pi pi-bell"
          rounded
          text
          className="horizontal-navbar-item"
        />
        <Button
          icon="pi pi-comments"
          rounded
          text
          className="horizontal-navbar-item"
        />
        <Button
          icon="pi pi-cog"
          rounded
          text
          className="horizontal-navbar-item"
        />
      </div>
    </div>
  );
};

export default Layout;

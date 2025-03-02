import React, {useContext, useEffect, useRef, useState} from "react";
import { Button } from "primereact/button";
import "./Layout.css";
import { Outlet, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../ThemeContext.tsx";
import CreatePostModal from "../post/CreatePostModal.tsx";
import useStore from "../../store/useStore.tsx";
import {Sidebar} from "primereact/sidebar";
import NotificationPage from "../../pages/Notification/NotificationPage.tsx";
import {TieredMenu} from "primereact/tieredmenu";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import {Dialog} from "primereact/dialog";
const Layout: React.FC = () => {
  const { myAccount } = useStore();

  // @ts-ignore
  const navigate = useNavigate();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [countNotifies, setCountNotifies] = useState(myAccount.countNotifies ?? 0);
  const [vNotifications, setVNotifications] = useState<boolean>(false);
  const menu = useRef(null);
  const [items, setItemMenu] = useState([])
    const [showLogout, setShowlogout] = useState(false);

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
    const  keyTheme = currentTheme.getKey()
  // @ts-ignore
  const textHintColor = currentTheme.getHint();
  // @ts-ignore
  const captionColor = currentTheme.getCaption();
  const backgroundColor = currentTheme.getBackground();
  const Logout = () =>{
      setShowlogout(true)
  }

  const HandleLogout = () =>{
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      navigate("/")
  }

  const ToMessage = () =>{
      navigate("/message")
  }
  const ShowNotificationPage = () =>{
      navigate("/notifications");
  }
  const ToHome = () =>{
      navigate("/home")
  }
  const ToAdmin = () =>{
      navigate("/admin")
  }
  const ToSearch = ()=>{
      navigate("/search")

  }
    useEffect(() => {
        if(myAccount)
        {
            var its = [
                {
                    label: 'Theme',
                    icon: 'pi pi-palette',
                    items: [
                        {
                            label: 'Light',
                            icon: "pi pi-sun",
                            command: ()=>{
                                changeTheme("theme_light")
                            }
                        },
                        {
                            label: 'Dark',
                            icon: "pi pi-moon",
                            command: ()=>{
                                changeTheme("theme_dark")
                            }
                        },
                    ]
                },
                {
                    label: 'Log out',
                    icon: 'pi pi-sign-out',
                    command: Logout
                },

            ];
            var role = myAccount?.userRoles ?? []
            var isCan = role.includes("admin") || role.includes("mod") || role.includes("mod-post") || role.includes("mod-account")
            if(myAccount?.userRoles && myAccount.userRoles.length > 0 && isCan){

                its =[
                    {
                        label: 'Manage',
                        icon: 'pi pi-microsoft',
                        command: ToAdmin
                    }
                    ,...its]
            }
            setItemMenu(its)
        }
    }, [myAccount]);



    if(countNotifies > 99) setCountNotifies("99+")
    return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
            <Dialog
                className={keyTheme}
                visible={showLogout}
                header={"Do you want log out?"}
                onHide={()=> setShowlogout(false)}>
                <div style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <Button onClick={HandleLogout} text severity={"danger"} label={"Yes"}/>
                    <Button onClick={()=>setShowlogout(false)} text severity={"secondary"} label={"No"}/>
                </div>
            </Dialog>

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
                      onClick={ToHome}
                    icon="pi pi-home"
                    label="Home"
                    className="navbar-item"
                    style={{ color: textColor }}
                  />
                  <Button
                    icon="pi pi-search"
                    label="Search"
                    className="navbar-item"
                    onClick={ToSearch}
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
                    onClick={()=>setVNotifications(!vNotifications)}
                    icon="pi pi-bell"
                    label="Notifications"
                    className="navbar-item"
                    badge={countNotifies}
                    badgeClassName="p-badge-info"
                    style={{ color: textColor }}
                  />
                  <Button
                    icon="pi pi-comments"
                    label="Messages"
                    className="navbar-item"
                    onClick={ToMessage}
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
                        style={{color: textColor}}
                    />
                    {/*<Button icon="pi pi-comments" label="Threads" className="navbar-item"/>*/}

                    <div className="card flex justify-content-center">
                        <TieredMenu popup ref={menu} model={items} breakpoint="767px"/>

                        <Button
                            icon="pi pi-bars"
                            label="More"
                            className="navbar-item"
                            style={{color: textColor}}
                            // @ts-ignore
                            onClick={(e) => menu.current.toggle(e)}
                        />
                    </div>
                </div>
            </div>
              {/*body*/}
              <div className="slider-bar-custom" style={{
                  position: "absolute",
                  zIndex: 1111,
                  height: "100%",
                  left: 220,
                      display: vNotifications ? "block" : "none",
                      backgroundColor: backgroundColor,

                  }}>
                      <Button text style={{right: "-80%", marginTop: 10,color: textColor}} icon={"pi pi-times"} onClick={()=>setVNotifications(false)}/>
                      <NotificationPage CallBackCloseNotification={()=>setVNotifications(false)}/>
                      {/*<Sidebar visible={vNotifications} onHide={() => setVNotifications(false)}>*/}
                      {/*</Sidebar>*/}
                  </div>

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
              onClick={ToHome}
              icon="pi pi-home"
              rounded
              text
              className="horizontal-navbar-item"
            />
            <Button
              icon="pi pi-search"
              onClick={ToSearch}
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
                onClick={ShowNotificationPage}
                icon="pi pi-bell"
              rounded
              text
              className="horizontal-navbar-item"
            />
            <Button
              icon="pi pi-comments"
              rounded
              onClick={ToMessage}
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

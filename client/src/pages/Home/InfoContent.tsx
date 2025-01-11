import {Avatar} from "primereact/avatar";
// @ts-ignore
import React, {useContext, useRef, useState} from "react";
import {ThemeContext} from "../../ThemeContext.tsx";
import {Button} from "primereact/button";
import {TieredMenu} from "primereact/tieredmenu";

interface UserInfo {
    User: any
}
const InfoContent : React.FC<UserInfo> = ({User}) =>{

    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const textColor = currentTheme.getText()
    const textHintColor = currentTheme.getHint()
    const captionColor = currentTheme.getCaption()

    // @ts-ignore
    const [isFriend, setFriend] = useState(true);
    // @ts-ignore
    const [isBlock, setBlock] = useState(true);
    // @ts-ignore
    const [isFollow, setFollow] = useState(false);

    const menu = useRef(null);

    const items = [
        {
            label: "View more",
            icon: 'pi pi-user',
            command: () =>{

            }
        },
        {
            label: isBlock ? 'Block' : "UnBlock",
            icon: 'pi pi-ban',
            command: () =>{

            }
        },
        {
            label: 'Report',
            icon: 'pi pi-exclamation-triangle',
            command: () =>{

            }
        },

    ];
    if(User == null) return (<></>)
    return(
        <>
            <Button  style={{
                color: textColor,
                margin: "0 0 10px 5px"
            }}
                 text
                     icon={"pi pi-times"}
            />

            <div style={{
                display: "flex",
                flexDirection: "row"
            }}>
                <Avatar
                    image={"https://via.placeholder.com/150"}
                    shape="circle"
                    style={{ width: 70, height: 70 , minWidth:  70, marginRight: 10}}

                />

                <div style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}>
                    {/*user profile*/}
                    <p
                        style={{
                            color: textColor,
                            fontSize: 23,
                            margin: 0,
                            marginBottom: 6,
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}>px4k3.pt</p>
                    {/*name*/}
                    <p style={{
                        color: captionColor,
                        fontSize: 15,
                        margin: 0,
                        marginBottom: 6,
                    }}>Kieu Thanh Phat Kieu Thanh Phat</p>

                    {/*info follow*/}
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            color: textColor
                        }}
                    >
                        <p style={{fontSize: 15, margin: 0, marginRight: 3}}>
                            <span style={{fontWeight: 700}}>1000</span> posts
                        </p>
                        <p style={{fontSize: 15, margin: 0, marginRight: 3}}>
                            <span style={{fontWeight: 700}}>1000</span> followers
                        </p>
                        <p style={{fontSize: 15, margin: 0}}>
                            <span style={{fontWeight: 700}}>1000</span> following
                        </p>
                    </div>

                    {/*bio*/}
                    <p style={{color: textHintColor}}>this is bio of user this is bio of userthis is bio of userthis is bio of userthis is bio of userthis is bio of userthis is bio of userthis is bio of userthis is bio of user</p>

                    {/*button*/}
                    <div style={{
                        marginTop:5,
                        display: "flex",
                        justifyContent: "space-evenly",

                    }}>
                        <TieredMenu model={items} popup ref={menu} breakpoint="767px" />
                        <Button label="Follow" severity="secondary"  style={{ borderRadius: 10, fontSize: "12px !important", height: "30px", padding: "20px" }} size={"small"}/>
                        <Button label="Message" severity="secondary" style={{borderRadius: 10, height: "30px", padding: "20px"}} />
                        <Button icon={`pi  ${!isFriend ? "pi-user-plus" : "pi-user-minus"}`} label="" severity="info" style={{borderRadius: 10, height: "30px", padding: "20px"}} />
                        <Button
                            // @ts-ignore
                            onClick={(e) => menu.current.toggle(e)}
                            icon="pi pi-ellipsis-h" rounded text label="" severity="info" style={{borderRadius: 10, color: textColor, height: "30px", padding: "20px"}} />
                    </div>
                </div>
            </div>
        </>
    )
}
export default InfoContent;
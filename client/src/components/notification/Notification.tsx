// Notification.tsx
import React, {useContext} from 'react';
import {ThemeContext} from "../../ThemeContext.tsx";
import {useNavigate} from "react-router-dom";
import {Button} from "primereact/button";
import {convertToHoChiMinhTime, toHCMTime} from "../../utils/Convertor.tsx";
import apiClient from "../../utils/apiClient.tsx";
import useStore from "../../store/useStore.tsx";

interface NotificationProps {
    Notify: any;
    CallBackClick: any;
}

const Notification: React.FC<NotificationProps> = ({Notify, CallBackClick}) => {
    var {id, imageUrl, interactProfile, type, content, isSeen, createdAt, targetId, destinationId } = Notify
    var {myAccount, setMyAccount} = useStore()
    var time = convertToHoChiMinhTime(createdAt)
    const navigate = useNavigate();
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    // @ts-ignore
    const textColor = currentTheme.getText()
    const borderColor = currentTheme.getBorder()
    const backgroundColor = currentTheme.getBackground()
    const textHintColor = currentTheme.getHint()
    const keyTheme = currentTheme.getKey()

    const ClickElement = async () =>{

        switch (type)
        {
            case 1:
                CallBackClick()
                if(isSeen === false)
                {
                    try{
                        var rs = await apiClient.post(`/notify/${id}`)
                        console.log(rs)
                        var status = rs.status
                        if(status === 204)
                        {
                            isSeen = true
                            setMyAccount({...myAccount, countNotifies: myAccount.countNotifies - 1})
                        }

                    }
                    catch(error){
                        console.log(error)
                    }
                }

                if(window.location.href.includes(`/post/${destinationId}`))
                {
                    window.location.reload()
                }
                else{
                    navigate(`/post/${destinationId}`)
                }
                break;

            case 3:
                navigate(`/report/${id}`)
                break
        }

    }

    const renderContent = () => {
        switch (type) {
            case 1: // Comment
                return (
                    <div style={{width: "100%", display: 'flex', alignItems: 'center',  cursor: "pointer" }}>
                        <img src={imageUrl} alt="User  Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <div style={{width: "100%", display: "flex", flexDirection: "row", alignItems: "center"}}>

                                <span style={{color: textColor, fontSize: 13, wordWrap: "break-word"}}>
                                    <span style={{
                                        color: textColor,
                                        fontSize: 13,
                                        fontWeight: "bold",
                                        fontStyle: "italic"
                                    }}>{interactProfile} </span> has been {content}</span>
                                {!isSeen && (
                                    <div className={"point-seen"}/>
                                )}
                            </div>
                            <div>
                            <span style={{fontSize: 10, color: textHintColor}}>{time} ago</span>
                            </div>
                        </div>
                    </div>
                );
            case 3: // report
                return (
                    <div style={{width: "100%", display: 'flex', alignItems: 'center',  cursor: "pointer" }}>
                        <img src={'/vite.png'} alt="User  Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <div style={{width: "100%", display: "flex", flexDirection: "row", alignItems: "center"}}>

                                <span style={{color: textColor, fontSize: 13, wordWrap: "break-word"}}>
                                    {content}
                                </span>
                                {!isSeen && (
                                    <div className={"point-seen"}/>
                                )}
                            </div>
                            <div>
                                <span style={{fontSize: 10, color: textHintColor}}>{time} ago</span>
                            </div>
                        </div>
                    </div>
                );

            // Add cases for other types in the future
            default:
                return null;
        }
    };

    return (
        <div
            onClick={ClickElement}
            style={{
                // backgroundColor: "aqua",
                padding: "5px 0", marginTop: 20,
            }}
        >
            {renderContent()}
        </div>
    );
};

export default Notification;
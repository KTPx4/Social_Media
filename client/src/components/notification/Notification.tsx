// Notification.tsx
import React, {useContext} from 'react';
import {ThemeContext} from "../../ThemeContext.tsx";
import {useNavigate} from "react-router-dom";

interface NotificationProps {
    id: string;
    userId: string;
    type: number;
    targetId: string;
    createdAt: string;
    isSeen: boolean;
    imageUrl: string;
    interactProfile: string;
    content: string;
}

const Notification: React.FC<NotificationProps> = ({ imageUrl, interactProfile, type, content, isSeen, createdAt, targetId }) => {
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

    const ClickElement = () =>{
        console.log("Click:", targetId)
        navigate(`/post/${targetId}`)
    }

    const renderContent = () => {
        switch (type) {
            case 1: // Comment
                return (
                    <div onClick={ClickElement} style={{width: "100%", display: 'flex', alignItems: 'center', marginBottom: '10px', marginTop: 20, cursor: "pointer" }}>
                        <img src={imageUrl} alt="User  Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                        <div style={{width: "80%"}}>
                            <span style={{fontSize: 14, fontWeight: "bold", fontStyle: "italic"}}>{interactProfile}</span>
                            <span style={{fontSize: 13, wordWrap: "break-word"}}> has {content}</span>
                        </div>
                    </div>
                );
            // Add cases for other types in the future
            default:
                return null;
        }
    };

    return <>{renderContent()}</>;
};

export default Notification;
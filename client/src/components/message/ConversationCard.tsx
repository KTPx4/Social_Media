import React, {useContext, useEffect, useState} from "react";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import {ThemeContext} from "../../ThemeContext.tsx";
import useStore from "../../store/useStore.tsx";
import {ToHCMLite, toHCMTime} from "../../utils/Convertor.tsx";
interface CardProps{
    Conversation: any;
}
enum ConversationType {
    Direct = 0,
    Group = 1
}
const ConversationCard : React.FC<CardProps> = ({Conversation}) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
    const {userId} = useStore()
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const textColor = currentTheme.getText()
    const textHintColor = currentTheme.getHint()
    const captionColor = currentTheme.getCaption()
    const cardColor = currentTheme.getCard()

    // data
    const [imgGroup, setImgGroup] = useState(Conversation.imageUrl);
    const [nameChat, setNameChat] = useState(Conversation.name);
    const [oponentChat, setOponentChat] = useState(null);
    const [lastMessage, setLastMessage] = useState(Conversation.lastMessage)
    const [timeMessage, setTimeMessage] = useState(ToHCMLite(Conversation.lastMessage.createdAt));

    useEffect(() => {
        if(Conversation && Conversation.type === ConversationType.Group)
        {
            setImgGroup(Conversation.imageUrl + token)

        }
        else if(Conversation && Conversation.type === ConversationType.Direct)
        {
            var members = Conversation.members
            var op = members.filter((i: any) => i.userId !==  userId)[0]
            setOponentChat(op)
            setNameChat(op.name)
        }

    }, [Conversation]);
    return(
        <>
            <div style={{
                marginTop: 3,
                // backgroundColor: cardColor,
                padding: "10px 0",
                display: "flex",
                alignItems: "center", // Căn giữa theo chiều dọc
                gap: "10px" // Tạo khoảng cách giữa Avatar và nội dung
            }}>

                <Avatar style={{minWidth: 30, minHeight: 30}}  image={imgGroup} size="normal" shape="circle" className="p-mr-2"/>

                <div style={{flexGrow: 1, width:"60%"}}>
                    <span style={{fontWeight: "bold", color: textColor}}>{nameChat}</span>
                    <div style={{marginTop: 5,display: "flex", alignItems: "center", width: "100%"}}>
                        <p style={{
                            margin: 0,
                            flexGrow: 1,
                            fontSize: 12,
                            color: lastMessage.isSystem ? "aqua" : textHintColor,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            {lastMessage.senderId === userId ? "You:" : ""}{lastMessage.content}
                        </p>

                        <p style={{ margin: 0,fontSize: 12, color: textHintColor, marginLeft: "10px", whiteSpace: "nowrap"}}>
                            {timeMessage}
                        </p>
                    </div>
                </div>

                <Button icon="pi pi-ellipsis-h" className="p-button-text"/>
            </div>

        </>
    )
}
export default ConversationCard
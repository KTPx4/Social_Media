import React, {useContext, useEffect, useState} from "react";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import {ThemeContext} from "../../ThemeContext.tsx";
import useStore from "../../store/useStore.tsx";
import {ToHCMLite, toHCMTime} from "../../utils/Convertor.tsx";
import  "./ConversationCard.css"

interface CardProps{
    Conversation: any;
    ClickCallback: any;
    userId: any;
    ListMembers:any;
}
enum ConversationType {
    Direct = 0,
    Group = 1
}

const ConversationCard : React.FC<CardProps> = ({Conversation, ClickCallback, userId, ListMembers}) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";

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
    const [countUnRead, setCountUnRead] = useState(Conversation.unRead);
    const [currentMembers, setCurrentMembers] = useState([]);

    useEffect(() => {
        if(Conversation)
        {

            var members = ListMembers[Conversation.id].members
            var dict = {}
            members.forEach((d)=>{
                // @ts-ignore
                dict[d.userId] = d
            })

            setCurrentMembers(dict)

            if(Conversation.unRead > 99) setCountUnRead("99+");

            if(Conversation.type === ConversationType.Group)
            {
                setImgGroup(Conversation.imageUrl + token)
            }
            else if(Conversation.type === ConversationType.Direct)
            {
                var members = Conversation.members
                var op = members.filter((i: any) => i.userId !==  userId)[0]
                setOponentChat(op)
                setNameChat(op.name)
                setImgGroup(op.imageUrl)
            }
        }


    }, [Conversation]);
    return(
        <>
            <div


                className="ConversationCard"
                style={{
                    marginTop: 3,
                    borderRadius: 8,
                    backgroundColor: Conversation.isSelected ? cardColor : "transparent",
                    padding: "15px 5px",
                    display: "flex",
                    alignItems: "center", // Căn giữa theo chiều dọc
                    gap: "10px" // Tạo khoảng cách giữa Avatar và nội dung
                }}
            >

                <Avatar   onClick={()=>ClickCallback(Conversation)} style={{minWidth: 30, minHeight: 30}}  image={imgGroup} size="normal" shape="circle" className="p-mr-2">

                </Avatar>

                <div   onClick={()=>ClickCallback(Conversation)} style={{flexGrow: 1, width:"60%"}}>
                    <span  style={{fontWeight: "bold", color: textColor}}>{nameChat}</span>

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
                            {/*// @ts-ignore*/}
                           <span  style={{fontSize: 12, fontWeight: "bold"}}> {lastMessage.senderId === userId ? "You:" : (`${currentMembers[lastMessage.senderId]?.name}: ` ?? "")}</span> {lastMessage.content}
                        </p>

                        <p style={{ margin: 0,fontSize: 12, color: textHintColor, marginLeft: "10px", whiteSpace: "nowrap"}}>
                            {timeMessage}
                        </p>
                    </div>
                </div>

                <p style={{
                    margin : 0,
                    padding: "2px 4px",
                    fontSize: 10,
                    backgroundColor: "red",
                    borderRadius: "100%",
                    color: "white"
                }}>{countUnRead}</p>
                <Button style={{display: "none"}} icon="pi pi-ellipsis-h" className="p-button-text btn-card-more"/>
            </div>

        </>
    )
}
export default ConversationCard
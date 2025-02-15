import React, {useContext, useEffect, useState} from "react";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import {ThemeContext} from "../../ThemeContext.tsx";
import useStore from "../../store/useStore.tsx";
import {ToHCMLite, toHCMTime} from "../../utils/Convertor.tsx";
import  "./ConversationCard.css"
import apiClient from "../../utils/apiClient.tsx";

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
    const [imgGroup, setImgGroup] = useState();
    const [nameChat, setNameChat] = useState();
    const [oponentChat, setOponentChat] = useState({});
    const [lastMessage, setLastMessage] = useState(null)
    const [timeMessage, setTimeMessage] = useState("");
    const [countUnRead, setCountUnRead] = useState(0);
    const [currentMembers, setCurrentMembers] = useState([]);
    const [CurrentConv, setCurrentConv] = useState<any>({});
    const [lastSender, setLastSender] = useState("");

    useEffect(() => {
        if(Conversation )
        {
            if(Conversation.isNew)
            {
                loadConversation()
            }
            else{
                setCurrentConv(Conversation)
            }
        }
    }, [Conversation]);

    useEffect(() => {
        if(CurrentConv)
        {

            var members = ListMembers[CurrentConv.id]?.members ?? []

            if(members)
            {
                var dict = {}
                members.forEach((d)=>{
                    // @ts-ignore
                    dict[d.userId] = d
                })

                setCurrentMembers(dict)
            }

            if(CurrentConv.unRead > 99)
            {
                setCountUnRead("99+")
            }
            else{
                setCountUnRead(CurrentConv.unRead)
            }
            setLastMessage(CurrentConv?.lastMessage)
            setTimeMessage(ToHCMLite(CurrentConv?.lastMessage?.createdAt))
            SenderSend(CurrentConv?.lastMessage, dict)
            if(CurrentConv.type === ConversationType.Group)
            {
                setImgGroup(CurrentConv.imageUrl + token)
                setNameChat(CurrentConv.name)
            }
            else if(CurrentConv.type === ConversationType.Direct)
            {
                var members = CurrentConv.members
                var op = members.filter((i: any) => i.userId !==  userId)[0]
                setOponentChat(op)
                setNameChat(op?.name ?? "")
                setImgGroup(op?.imageUrl ?? "")
            }
        }


    }, [CurrentConv]);

    const loadConversation = async( )=>{

        try{
            var rs = await apiClient.get(`/chat/conversation/${Conversation.id}`)
            var status = rs.status
            if(status === 200)
            {
                var data = rs.data.data

                setCurrentConv(data)
            }
        }
        catch(err){
            console.log(err)
        }
    }

    const SenderSend = (lastMess, listMems)=> {

        var sender = ""
        // @ts-ignore
        if (lastMess?.isSystem) sender= "System:";
        // @ts-ignore
        else if (lastMess && lastMess?.senderId === userId) sender = "You:";
        // @ts-ignore
        else sender = listMems[lastMess?.senderId]?.name ? `${listMems[lastMess?.senderId]?.name}:` : "_:";
        setLastSender(sender)

    }
    return (
        <>
            <div
                className="ConversationCard"
                style={{
                    marginTop: 3,
                    borderRadius: 8,
                    backgroundColor: CurrentConv?.isSelected ? cardColor : "transparent",
                    padding: "15px 5px",
                    display: "flex",
                    alignItems: "center", // Căn giữa theo chiều dọc
                    gap: "10px" // Tạo khoảng cách giữa Avatar và nội dung
                }}
            >

                <Avatar   onClick={()=>ClickCallback(CurrentConv??{})} style={{minWidth: 30, minHeight: 30}}  image={imgGroup} size="normal" shape="circle" className="p-mr-2">

                </Avatar>

                <div   onClick={()=>ClickCallback(CurrentConv??{})} style={{flexGrow: 1, width:"60%"}}>
                    <span  style={{fontWeight: "bold", color: CurrentConv?.type === ConversationType.Group? "magenta" : textColor}}>{nameChat}</span>

                    <div style={{marginTop: 5,display: "flex", alignItems: "center", width: "100%"}}>
                        <p style={{
                            margin: 0,
                            flexGrow: 1,
                            fontSize: 12,
                            color: textHintColor,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            {/*// @ts-ignore*/}
                            <span style={{fontSize: 12, fontWeight: "bold"}}> {lastSender}</span> {lastMessage?.content}
                        </p>

                        <p style={{ margin: 0,fontSize: 12, color: textHintColor, marginLeft: "10px", whiteSpace: "nowrap"}}>
                            {timeMessage}
                        </p>
                    </div>
                </div>
                {countUnRead > 0 && (
                    <p style={{
                        margin : 0,
                        padding: "2px 4px",
                        fontSize: 10,
                        backgroundColor: "red",
                        borderRadius: "100%",
                        color: "white"
                    }}>{countUnRead}</p>
                )}
                {/*<Button style={{display: "none"}} icon="pi pi-ellipsis-h" className="p-button-text btn-card-more"/>*/}
            </div>

        </>
    )
}
export default ConversationCard
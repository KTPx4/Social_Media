import React, {useEffect, useState} from "react";
import LeftInfo from "../../components/message/LeftInfo.tsx";
import RightContent from "../../components/message/RightContent.tsx";
import useStore from "../../store/useStore.tsx";
import apiClient from "../../utils/apiClient.tsx";
import {useWebSocketContext} from "../../store/WebSocketContext.tsx";
import InfoChatDirect from "../../components/message/InfoChatDirect.tsx";
import InfoChatGroup from "../../components/message/InfoChatGroup.tsx";

enum ConversationType {
    Direct = 0,
    Group = 1
}
const MessagePage : React.FC = () =>{
    const {userId} = useStore()

    // data
    const [listConversation, setListConversation] = useState([])

    const [currentConversation, setConversation] = useState(null)
    const [listMembers, setListMembers] = useState([])
    // @ts-ignore
    const {isConnected, messages, sendMessage, setNewMessages } = useWebSocketContext()

    const [showInfo, setShowInfo] = useState<boolean>(false)

    useEffect(() => {
        if(messages)
        {
            var convId = messages.conversationId
            var newList = listConversation.map((c) =>{
                if(c.id === convId)
                {
                    c.time = Date.now()
                    c.lastMessage = messages.message
                    if(!currentConversation || currentConversation.id !== convId) c.unRead = c.unRead + 1
                }
                return c
            })
            console.log(newList)
            setListConversation(newList)
        }
    }, [messages]);

    useEffect(() => {
        LoadData()
    }, []);

    const ClickConversation = async (Conversation:any) =>{
        setConversation(Conversation)
    }
    const CloseInfo = () =>{
        setShowInfo(false)
    }
    const LoadData = async()=>{
        try{
            var rs = await apiClient.get("/chat/conversation")
            console.log("get conversation: ", rs.data.data)
            var status = rs.status
            if(status === 200)
            {
                var dict = {}
                var data = rs.data.data

                data.forEach((d)=>{
                    // @ts-ignore
                    dict[d.id] = d
                })

                setListMembers(dict)

                data = data.map( (e : any) =>{
                    return {...e, isSelected: false, time: Date.now()}
                })
                setListConversation(data)
            }
        }
        catch (err)
        {
            console.log(err)
        }
    }
    const InfoContent = currentConversation === null ? null : (currentConversation.type === ConversationType.Direct ? <InfoChatDirect /> : <InfoChatGroup />)
    return(
        <div style={{
            width: "100%", height: "100%",
            display:"flex",
            flexDirection: "row",

        }}>
            <div className="left-info" style={{
                height: "100vh",
                width:"25%",
                minWidth: 250,
                backgroundColor: "transparent",
            }}>
                <LeftInfo ClickCallBack={ClickConversation} userId={userId} listConversation={listConversation} setListConversation={setListConversation} ListMembers={listMembers}/>
            </div>

            <div className={"right-message"} style={{
                height: "100%",
                width: showInfo  ? "50%" : "75%",
                backgroundColor: "transparent"
            }}>
                <RightContent CurrentConversation={currentConversation} userId={userId} listConversation={listConversation} setListConversation={setListConversation} showInfo={()=>setShowInfo(!showInfo)}/>
            </div>

            <div className={"right-setting"} style={{
                height: "100%",
                width: showInfo  ? "25%" :"0%",
                backgroundColor: "transparent"
            }}>
                {showInfo && InfoContent}
            </div>
        </div>
    )
}

export  default  MessagePage;
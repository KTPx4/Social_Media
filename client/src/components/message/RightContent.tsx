import React, {useContext, useEffect, useRef, useState} from "react";
import {ThemeContext} from "../../ThemeContext.tsx";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {InputTextarea} from "primereact/inputtextarea";
import MessageCard from "./MessageCard.tsx";
import apiClient from "../../utils/apiClient.tsx";

import "./RightCss.css"
import {useWebSocketContext} from "../../store/WebSocketContext.tsx";
import {InputText} from "primereact/inputtext";
import {ProgressSpinner} from "primereact/progressspinner";


enum ConversationType {
    Direct = 0,
    Group = 1
}
enum SendMessageType{
    Text = 0,
    Image = 1, Video = 2, File = 3
}
const FastMessage = {
    Like: "👍",
    Heart: "❤️",
    Heart_2: "💘"
}
const RightContent : React.FC<any> = ({CurrentConversation, userId , listConversation, setListConversation, showInfo})=>{
    const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";

    // @ts-ignore
    const {isConnected, messages, sendMessage, setNewMessages } = useWebSocketContext()
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;

    const  cardColor = currentTheme.getCard()
    const borderColor = currentTheme.getBorder()

    const [nameChat, setNameChat] = useState(null);
    const [oponentChat, setOponentChat] = useState(null);
    const [imgGroup, setImgGroup] = useState(null);
    const [listMembers, setListMembers] = useState(null);
    const [page , setPage] = useState(1);
    const [listMessage, setListMessage] = useState([]);
    const [inputMessage, setInputMessage] = useState("")
    const [firtLoad, setFirstLoad] = useState(true);
    const [isLoading,setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const bodyContentRef = useRef(null);
    const [canLoad, setCanLoad] = useState(true);
    const [isScrollTop, setScrollTop] = useState(false);
    const LoadMessages  = async()=>{
        if(!canLoad) {
            setTimeout(()=>{
                setLoading(false)
            }, 1000)
            return
        }
        try{
           if(page > 1)  setScrollTop(true)
            var rs = await apiClient.get(`/chat/conversation/${CurrentConversation.id}?page=${page}`)
            console.log("get message: ", rs)
            var status = rs.status
            if(status === 200)
            {
                var data = rs.data.data
                if(data.length > 0)
                {
                    // @ts-ignore
                    setListMessage((prev) => [...rs.data.data, ...prev])
                }
                else{
                    setCanLoad(false)
                }
                setPage(page+1)
                setLoading(false)
            }
        }
        catch (err)
        {
            console.log(err)
        }
    }
    const SendLike = async()=>{
        if(!isConnected || !CurrentConversation) return;
        setScrollTop(false)

        var rs = await sendMessage(userId, CurrentConversation.id, FastMessage.Like, SendMessageType.Text)
        // @ts-ignore
        var success = rs.success
        if(!success)
        {
            alert("Cannot send message. Try again!")
        }else{
            var newMess = rs.data
            // @ts-ignore
            setListMessage((prev) => [...prev, newMess])
            setFirstLoad(true)
        }
    }
    const SendMessage = async()=>{
        if(!inputMessage.trim() || !isConnected || !CurrentConversation) return;
        setScrollTop(false)
        var rs = await sendMessage(userId, CurrentConversation.id, inputMessage.trim(), SendMessageType.Text)
        // @ts-ignore
        var success = rs.success
        if(!success)
        {
            alert("Cannot send message. Try again!")
        }else{
            var newMess = rs.data
            setInputMessage("")
            // @ts-ignore
            setListMessage((prev) => [...prev, newMess])

            var newdata = listConversation.map( (e : any) =>{
                return {...e,  lastMessage: newMess, time: Date.now()}
            })
            setListConversation(newdata)
        }
    }
    const scrollEndMess = ()=>{

        if(messagesEndRef && messagesEndRef.current)
        {
            // @ts-ignore
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const handleScroll = async() => {
        if (!bodyContentRef.current) return;
        // setScrollTop(true)
        const { scrollTop } = bodyContentRef.current;
        if (scrollTop === 0) {
            setLoading(true)
            await LoadMessages();
        }
    };
    useEffect(() => {
        if(messages && CurrentConversation && messages.sender !== userId && messages.conversationId === CurrentConversation.id)
        {
            setListMessage(prev => [...prev, messages.message])
        }
    }, [messages]);

    useEffect(() => {
        console.log("1 times", isScrollTop)
        if(listMessage && listMessage.length > 0 && !isScrollTop)
        {
            scrollEndMess()
        }
    }, [listMessage]);

    useEffect(() => {
        if(CurrentConversation)
        {
            setNameChat(CurrentConversation.name)
            var members = CurrentConversation.members
            var dict = {}
            // @ts-ignore
            members.forEach((m)=>{
                // @ts-ignore
                dict[m.userId] = m
            })
            // @ts-ignore
            setListMembers(dict)

            if(CurrentConversation.type === ConversationType.Group)
            {
                // @ts-ignore
                setImgGroup(CurrentConversation.imageUrl + token)
            }
            else if(CurrentConversation.type === ConversationType.Direct)
            {
                var members = CurrentConversation.members
                var op = members.filter((i: any) => i.userId !==  userId)[0]
                setOponentChat(op)
                setNameChat(op.name)
                setImgGroup(op.imageUrl)
            }

            LoadMessages()

        }

    }, [CurrentConversation]);

    const showIcon = ()=>{

    }

    if(!CurrentConversation){
        return(<></>)
    }

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            padding: "0",
            justifyContent: "space-between"
        }}>
            {/*Header*/}
            <div className="header-content" style={{
                top: 0,
                padding: 10,
                height: "10%",
                width: "100%",
                backgroundColor: "transparent",
                borderBottom: `1px solid ${borderColor}`,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    {/*// @ts-ignore*/}
                    <Avatar style={{minWidth: 50, minHeight: 50}} image={imgGroup} size="normal" shape="circle"
                            className="p-mr-2"/>
                    <p style={{
                        margin: "0px 9px",
                        fontSize: 20
                    }}>{nameChat}</p>
                </div>
                <div>
                    <Button text icon={"pi pi-phone"}/>
                    <Button text icon={"pi pi-ellipsis-h"} onClick={showInfo}/>

                </div>

            </div>

            {/*Content*/}
            {isLoading && (
                <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="4" fill="transparent" animationDuration=".5s" />
            )}
            <div  ref={bodyContentRef} onScroll={handleScroll} className="body-content" style={{
                height: "80%",
                padding: 10,
                backgroundColor: "transparent",
                overflow: "auto"
                // borderBottom: `1px solid ${borderColor}`,
            }}>
                {listMessage.map((m)=>
                    // @ts-ignore
                    <MessageCard key={m.id} ListMembers={listMembers} Message={m}/>
                )}
                {/* Element dùng để cuộn xuống cuối */}
                <div ref={messagesEndRef}/>
            </div>

            {/*footer*/}
            <div className="footer-content" style={{
                // borderRadius: 5,
                backgroundColor: cardColor,
                display: "flex",
                flexDirection: "column-reverse", // Giúp input mở rộng lên trên
                alignItems: "center",
                height: "auto",
                minHeight: "40px",
                // maxHeight: "150px",
                paddingTop: 10,
                marginBottom: 7,
            }}>
                <div>
                </div>
                <div style={{
                    width:"100%",
                    display: "flex",
                    flexDirection:"row",
                    justifyContent: "space-evenly"
                }}>
                    <Button text icon={"pi pi-file-plus"} size={"large"}/>

                    <IconField
                        style={{
                        width: "80%",
                        display: "flex",
                        alignItems: "center",
                    }}>
                        <InputText
                            maxLength={1000}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if(e.key === "Enter")
                                {
                                    SendMessage()
                                }
                            }}
                            value={inputMessage}
                            // autoResize
                            // @ts-ignore
                            rows={1}
                            style={{
                                width: "100%",
                                borderRadius: 15,
                                // marginTop: 10,
                                padding: "10px",
                                border: "1px solid #ccc",
                                maxHeight: "100px",
                                overflow: "auto",
                                resize: "none",
                            }}
                            placeholder="Send message"
                        />
                        <InputIcon onClick={showIcon} style={{marginRight: 15}} className="pi pi-face-smile"/>
                    </IconField>
                    <Button onClick={SendLike} text icon={"pi pi-thumbs-up-fill"} size={"large"}/>
                </div>
            </div>
        </div>
    )
}
export default RightContent;
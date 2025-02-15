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
import {Dialog} from "primereact/dialog";
import FooterRightContent from "./FooterRightContent.tsx";
import {Message} from "primereact/message";


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
const FriendStatus = {
    Normal: 0, Prevented : 1, Obstructed :2
}
const RightContent : React.FC<any> = ({DirectUser, CurrentConversation, DbContext, userId , listConversation, setListConversation, showInfo, ListMembers, HandleChangeLastMess })=>{
    const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";

    // @ts-ignore
    const {isConnected, subscribeToMessages, sendMessage, setNewMessages,sendReactMessage } = useWebSocketContext()
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const keyTheme = currentTheme.getKey()
    const  cardColor = currentTheme.getCard()
    const borderColor = currentTheme.getBorder()

    const [nameChat, setNameChat] = useState(null);
    const [oponentChat, setOponentChat] = useState(null);
    const [imgGroup, setImgGroup] = useState(null);
    const [listMembers, setListMembers] = useState(null);
    const [page , setPage] = useState(1);
    const [listMessage, setListMessage] = useState([]);
    const [inputMessage, setInputMessage] = useState("")
    const [replyMessage, setReplyMess] = useState(null)
    const [firtLoad, setFirstLoad] = useState(true);
    const [isLoading,setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const bodyContentRef = useRef(null);
    const [canLoad, setCanLoad] = useState(true);
    const [isScrollTop, setScrollTop] = useState(false);
    const [isShowReactions, setShowReactions] = useState(false)

    const [listReactions, setListReactions] = useState([]);

    const CallBackReplyMessRef = useRef(null);
    const [infoDicrectUser, setInfoDicrect] = useState(null)

    useEffect(() => {
        const handleNewMessage = (message) => {
            var type =message.type
            if(type === "message")
            {
                var newMessage = message.message
                if(newMessage && CurrentConversation && message.sender !== userId && message.conversationId === CurrentConversation.id)
                {
                    newMessage.reacts = []
                    setListMessage( (prev) => {
                        var newList = [...prev, newMessage]
                        return newList
                    })
                }
            }
            else if(type === "react")
            {

            }
            // console.log("📩 New message received: ", message);
            // Xử lý thông báo tin nhắn mà không rerender
        };

        subscribeToMessages(handleNewMessage);
    }, []);

    useEffect(() => {

        if(listMessage && listMessage.length > 0 )
        {
            if( !isScrollTop) scrollEndMess()
        }

    }, [listMessage]);

    useEffect(() => {
        if(CurrentConversation)
        {
            LoadLocal()
            setPage(1)
            setListMessage(CurrentConversation.listMessage ?? [])
            setNameChat(CurrentConversation?.name ?? "")
            var members = CurrentConversation?.members ?? []
            var dict = {}
            // @ts-ignore
            members?.forEach((m)=>{
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
            setTimeout(()=>{
                LoadMessages()

            }, 400)

        }
        if(DirectUser && CurrentConversation.type === ConversationType.Direct)
        {
            setInfoDicrect(DirectUser)
        }
        else  setInfoDicrect(null)

    }, [CurrentConversation, DirectUser]);

    const LoadLocal = async () =>{
        try{
            var id = CurrentConversation.id

            // @ts-ignore
            const saveMessage = await DbContext.getItem<{id: string; messages: any }[]>(id);

            if(!saveMessage) return

            // @ts-ignore
            var data = saveMessage?.messages

            if(data.length > 0)
            {
                setListMessage(data)

            }
        }
        catch (e)
        {
            console.log(e)
        }
    }
    const LoadMessages  = async()=>{
        if(!canLoad) {
            setTimeout(()=>{
                setLoading(false)
            }, 1000)
            return
        }
        setLoading(true)
        try{
           if(page > 1)  setScrollTop(true)
            var rs = await apiClient.get(`/chat/conversation/${CurrentConversation.id}/chat?page=${page}`)

            var status = rs.status
            if(status === 200)
            {
                var data = rs.data.data
                if(data.length > 0)
                {
                    // @ts-ignore
                   if(page === 1)
                   {
                       setListMessage(data)
                       await DbContext.addItem({ id: CurrentConversation.id, messages: data }); // Lưu vào IndexedDB
                   }
                   else{
                      await UpdateListMess(rs.data.data)
                   }
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
           alert(err)
        }
    }
    const UpdateListMess = async(data) =>{
        data = [...data, ...listMessage]
        setListMessage(data)

        var id = CurrentConversation.id
        // @ts-ignore
        const saveMessage = await DbContext.getItem<{id: string; messages: any }[]>(id);

        const listOld = saveMessage.messages.map(ms => ms.id)
        data.filter((m)=> !listOld.includes(m.id))
        if(saveMessage.length > 0)
        {
            await DbContext.addItem({ id: CurrentConversation.id, messages: data }); // Lưu vào IndexedDB
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
            HandleChangeLastMess(newMess)
        }
    }

    const SendMessage = async()=>{
        if(!inputMessage.trim() || !isConnected || !CurrentConversation) return;
        setScrollTop(false)
        var rs = await sendMessage(userId, CurrentConversation.id, inputMessage.trim(), SendMessageType.Text, replyMessage)
        if(!rs)
        {
            alert("Error when send message")
            return
        }
        // @ts-ignore
        var success = rs.success
        if(!success)
        {
            alert("Cannot send message. Try again!")
        }else{
            var newMess = rs.data
            newMess.reacts = []
            setInputMessage("")
            // @ts-ignore
            setListMessage((prev) => [...prev, newMess])
            setFirstLoad(true)
            HandleChangeLastMess(newMess)
            // var newdata = listConversation.map( (e : any) =>{
            //     return {...e,  lastMessage: newMess, time: Date.now()}
            // })
            // setListConversation(newdata)
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



    const showIcon = ()=>{

    }
    const ShowReactions = (listReactions) =>{
        setListReactions(listReactions)
        setTimeout(()=>{
            setShowReactions(true)
        },300)
    }

    const HandleReplyMess= async (Mess) =>{
        if(!CallBackReplyMessRef?.current) return;
        var func = CallBackReplyMessRef.current
        setReplyMess(Mess.id)
        func(Mess)
    }

    const subriceCallBack = (callback) =>{
        CallBackReplyMessRef.current = callback
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
            <Dialog
                className={keyTheme}
                header="Reactions"
                visible={isShowReactions}
                onHide={()=>setShowReactions(false)}
            >
                {listReactions.map((e)=>
                    {

                        return (
                            <div key={e.userId} style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <Avatar className={"mx-1"} size="normal" shape="circle" image={listMembers[e.userId]?.imageUrl}/>
                                <p style={{width: 200, margin: "0 5px", textOverflow: "ellipsis"}}>{listMembers[e.userId]?.name}</p>
                                <span>{e.react}</span>
                            </div>
                        )
                    }
                )}
            </Dialog>
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
                    {/*<Button text icon={"pi pi-phone"}/>*/}
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
                    <MessageCard key={m.id} ListMembers={listMembers} Message={m}
                                 sendReact={sendReactMessage}
                                 showReactions={ShowReactions}
                                 ReplyMessage={HandleReplyMess}
                                 // onSelectReaction={onSelectMessageForReaction}
                    />
                )}
                {/* Element dùng để cuộn xuống cuối */}
                <div ref={messagesEndRef}/>
                <div style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row-reverse"
                }}>
                    { CurrentConversation.lastMessage?.senderId === userId &&  CurrentConversation.lastMessage?.seenIds && (
                        <Button tooltip={"Seen"} style={{marginLeft: "auto", width: 30, height: 30}} text rounded icon={"pi pi-eye"}/>
                    )}
                    {  CurrentConversation.lastMessage?.senderId === userId &&  CurrentConversation.lastMessage?.seenIds === null && (
                        <Button tooltip={"Sent"} style={{marginLeft: "auto", width: 30, height: 30}} text rounded icon={"pi pi-check\n"}/>
                    )}
                </div>
            </div>

            {/*footer*/}
            {(!infoDicrectUser || (infoDicrectUser && infoDicrectUser.friendStatus ===  FriendStatus.Normal)) && (
                <FooterRightContent CurrConvID={CurrentConversation?.id} setReplyMess={setReplyMess} ListMembers={listMembers} SendMessage={SendMessage} SendLike={SendLike} showIcon={showIcon} setInputMessage={setInputMessage} inputMessage={inputMessage} CallBackReply={subriceCallBack}/>
            )}
            {infoDicrectUser && infoDicrectUser.friendStatus !==  FriendStatus.Normal &&(
                <>
                    <Message severity="warn" text="Can't send message to this user!" />
                </>
            )}
        </div>
    )
}
export default RightContent;
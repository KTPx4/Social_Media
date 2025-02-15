import React, {useContext, useEffect, useRef, useState} from "react";
import {ThemeContext} from "../../ThemeContext.tsx";
import useStore from "../../store/useStore.tsx";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import {Menu} from "primereact/menu";
import {MenuItem} from "primereact/menuitem";
import EmojiPicker from "emoji-picker-react";
import {useWebSocketContext} from "../../store/WebSocketContext.tsx";
import {Messages} from "primereact/messages";
import {Tooltip} from "primereact/tooltip";
import {toHCMTime} from "../../utils/Convertor.tsx";
import apiClient from "../../utils/apiClient.tsx";
import {Image} from "primereact/image";

const enum MessageType
{
    Text = 0, Image = 1, Video = 2, File = 3
}

const MessageCard : React.FC<any> = ({ListMembers, Message, sendReact, showReactions, ReplyMessage}) => {
    var urlServer =  import.meta.env.VITE_SERVER_URL ||  "https://localhost:7000";
    const {userId, setId} = useStore()
    // const {reactMessage } = useWebSocketContext()
    const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
    const Url = `${urlServer}/api/file/src?t=message&id=`

    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const keyTheme = currentTheme.getKey()
    const textColor = currentTheme.getText()
    const textHintColor = currentTheme.getHint()
    const captionColor = currentTheme.getCaption()
    const borderColor = currentTheme.getBorder()
    const cardColor = currentTheme.getCard()
    const isMe = Message.senderId ===  userId ? "me" : "friend"
    const backMessColor = Message.senderId ===  userId ? "#4ba3e3" : cardColor
    const menuRight = useRef<Menu>(null);
    const items: MenuItem[] = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Refresh',
                    icon: 'pi pi-refresh'
                },
                {
                    label: 'Export',
                    icon: 'pi pi-upload'
                }
            ]
        }
    ];


    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
// Emoji reactions mặc định
    const defaultReactions = ["👍", "❤️", "😆", "😢", "🙏", "👎", "😡"];
    const [reactions, setReactions] = useState<string[]>(defaultReactions);
    const [showReaction, setShowReaction] = useState<boolean>(false);
    const [listReactShow, setListReactShow] = useState([]);
    const [listReact, setListReact] = useState([]);
    const [myReact, setMyReact] = useState("")
    const { subscribeToMessages } = useWebSocketContext()
    const MessageIdRef = useRef(null);
    const [sender, setSender] = useState(ListMembers[Message.senderId] ?? null)

    useEffect(() => {
        subscribeToMessages(HandleGetReact)

    }, []);

    useEffect(() => {
        if(Message)
        {


            if(!ListMembers[Message.senderId] )
            {
                LoadUser(Message.senderId)
            }
            MessageIdRef.current = Message.id
            setListReact(Message.reacts)
            SetListUniqueIcon(Message.reacts)

        }
    }, [Message]);



    const LoadUser = async(id) =>{
        try{
            if(!id) return
            var rs = await  apiClient.get(`/user/search/${id}`)
            var status = rs.status
            if(status === 200)
            {
                var data= rs.data.data
                setSender(data)
            }
        }
        catch (e)
        {
            console.log(e)
        }
    }

    const HandleGetReact = (react) =>{
        var type = react.type

        if(type !== "react") return

        var mess = react.message
        if(!MessageIdRef.current || mess.messageId !== MessageIdRef.current) return


        setListReact((prev) =>{
            var newList = prev?.map(r =>{
                if(r.userId === mess.senderId)
                    return {...r, react: mess.react, createdAt: mess.createdAt}
                return r
            })
            if(newList?.filter(r => r.userId === mess.senderId).length < 1)
            {
                newList.push({
                    createdAt: Date.now(),
                    messageId: Message.id,
                    react:  mess.react,
                    userId:  mess.senderId
                })
            }

            SetListUniqueIcon(newList)
            return newList

        })

    }

    const SetListUniqueIcon = (ReactDatas : any) =>{
        var stringReacts = ReactDatas?.map((r)=> {
            if(r.userId === userId)
            {
                setMyReact(r.react)
            }
            return r.react
        })
        var unique =  [...new Set(stringReacts)].slice(0, 5);

        setListReactShow(unique)
    }
    const HandleReplyComment = async()=>{
        ReplyMessage(Message)
    }
    const ShowReactions = () =>{


        showReactions(listReact)
    }
    const HandleReaction = async(emoji) =>{
        setShowReaction(false);
        var rs = await sendReact(userId, Message.id, emoji)
        if(rs !== null)
        {
            setMyReact(emoji)
            var newListReact = listReact.map((r) => r.userId === userId ? {...r, react: emoji} : r )
            if(newListReact.filter(r => r.userId === userId).length < 1)
            {
                newListReact.push({
                    createdAt: Date.now(),
                    messageId: Message.id,
                    react: emoji,
                    userId: userId
                })
            }
            setListReact(newListReact)
            SetListUniqueIcon(newListReact)
        }


    }

    const handleEmojiSelect = (emoji: any) => {
        if (!reactions.includes(emoji.emoji)) {
            // setReactions([...reactions, emoji.emoji]); // Thêm vào danh sách reactions
            var  newReact = reactions.map((e, index) => index === (reactions.length -1) ? emoji.emoji : e)
            setReactions(newReact)
            setShowEmojiPicker(false)
        }

    };

    const handleSelectMessageForReaction = () => {
        setShowReaction(true)
    };

    const textColorSystem= Message?.content?.includes("remove") ? "red" : ( Message?.content?.includes("added") ? "#44c944" : "aqua")
    return(
        <div className={keyTheme}>
            <div
                className={ "message message-" + (Message.isSystem ? "system" : isMe)}
                style={{
                    marginTop: 20,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: isMe==="me" ? "row-reverse" : "row"
                }}
            >
                <Tooltip target=".avatar-user" />
                {!Message.isSystem ?
                    <Avatar
                        data-pr-tooltip={sender?.name}
                        data-pr-position={"top"}
                        className={"mx-1 avatar-user"} size="normal" shape="circle" image={sender?.imageUrl}/> : <></>}
                <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>

                    <div style={{
                        display: "flex",
                        alignItems: isMe === "me" ? "flex-end" : "flex-start",
                        flexDirection: "column",
                        gap: 5, // Khoảng cách giữa reply và message chính
                    }}>

                        {/*//reply message*/}
                        {Message.messageReply && (
                            <p

                                style={{
                                margin: 0,
                                backgroundColor: textHintColor,
                                color: "black",
                                padding: "15px 20px",
                                minWidth: 50,
                                maxWidth: 250,
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                borderRadius: 15,
                                display: "flex",
                                justifyContent: "start",
                                fontSize: (Message.isSystem || Message.isDeleted) ? 12 : 14,
                                fontStyle: (Message.isSystem || Message.isDeleted) ? "italic" : "normal",
                                opacity: 0.8, // Làm mờ để dễ nhìn hơn
                                transform: "scale(0.95)", // Thu nhỏ một chút để nhấn mạnh message chính
                            }}>
                                {Message.isDeleted ? "Message has been deleted!" : Message.messageReply.content}
                            </p>
                        )}

                        {/*message*/}
                        <div style={{
                            zIndex: 20,
                            display: "flex",
                            flexDirection: isMe === "me" ? "row-reverse" : "row",
                            alignItems: "center"

                        }}>
                            <Tooltip target=".message-content"/>

                            {/*Type text */}
                            {Message.type === MessageType.Text && (
                                <p
                                    data-pr-tooltip={toHCMTime(Message.createdAt)}
                                    // data-pr-position={isMe === "me" ? 'left' : "right"}
                                    data-pr-position={"top"}
                                    className={"message-content"}
                                    style={{
                                        zIndex: 20,
                                        margin: "-12px 0 0 0", // Kéo message chính lên trên reply một chút
                                        backgroundColor: Message.isSystem ? "transparent" : backMessColor,
                                        color: Message.isSystem ? textColorSystem : textColor,
                                        padding: 10,
                                        width: "fit-content",
                                        minWidth: 50,
                                        maxWidth: 400,
                                        borderRadius: 20,
                                        display: "flex",
                                        justifyContent: "center",
                                        fontSize: (Message.isSystem || Message.isDeleted) ? 12 : 16,
                                        fontStyle: (Message.isSystem || Message.isDeleted) ? "italic" : "normal",
                                        overflowWrap: "anywhere",
                                        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)", // Đổ bóng nhẹ để nổi bật hơn
                                    }}>
                                    {Message.isDeleted ? "Message has been deleted!" : Message.content}
                                </p>
                            )}

                            { Message.type === MessageType.Image &&
                                (
                                    <>
                                       <Image
                                               preview className={"message-img"}
                                               src={Message.content + token}
                                               style={{margin: "30px 0", objectFit: "cover", maxWidth: 320, maxHeight: 250, display:"block"}} />
                                    </>
                                )
                            }

                            { Message.type === MessageType.Video &&
                                (
                                    <>
                                        <video
                                            controls style={{
                                            maxWidth: 350, maxHeight: 270
                                        }}>
                                            <source src={Message.content + token} type="video/mp4"/>
                                        </video>
                                    </>
                                )
                            }
                            {Message.type === MessageType.File &&
                                (
                                    <>
                                        <div
                                            data-pr-tooltip={toHCMTime(Message.createdAt)}
                                            data-pr-position={isMe === "me" ? 'left' : "right"}
                                            className={"message-content-file"}
                                            style={{
                                                zIndex: 20,
                                                margin: "-12px 0 0 0", // Kéo message chính lên trên reply một chút
                                                backgroundColor: Message.isSystem ? "transparent" : backMessColor,
                                                color: Message.isSystem ? textColorSystem : textColor,
                                                padding: 10,
                                                width: "fit-content",
                                                minWidth: 50,
                                                maxWidth: 400,
                                                borderRadius: 20,
                                                display: "flex",
                                                justifyContent: "center",
                                                fontSize: (Message.isSystem || Message.isDeleted) ? 12 : 16,
                                                fontStyle: (Message.isSystem || Message.isDeleted) ? "italic" : "normal",
                                                overflowWrap: "anywhere",
                                                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)", // Đổ bóng nhẹ để nổi bật hơn
                                            }}>
                                            <a href={`${Url}${Message.id}&token=${token}`}

                                               target={"_blank"} rel="noopener noreferrer"  style={{
                                                color: "pink",

                                                textDecoration: "underline !important",
                                                wordBreak: "break-word",
                                            }}>
                                                <span className="pi pi-file"> {Message.content}</span>
                                            </a>
                                        </div>
                                    </>
                                )
                            }

                            {!Message.isSystem && (
                                <div style={{marginTop: -12, display: "flex", flexDirection: "row"}}>
                                    <Button onClick={HandleReplyComment} className={"btn-more"} text
                                            icon={"pi pi-reply"}
                                            style={{display: "none", height: 30}}/>
                                    <Button onClick={handleSelectMessageForReaction} className={"btn-more"} text
                                            icon={"pi pi-face-smile"} style={{display: "none", height: 30}}/>

                                </div>
                            )}

                            {!Message.isSystem && showReaction && (
                                <div
                                    className="reactions"
                                    style={{
                                        height: "fit-content",
                                        // position: "absolute",
                                        // top: `${reactionPosition.top}px`,
                                        // left: `${reactionPosition.left}px`,
                                        zIndex: 1000,
                                        background: "transparent",
                                        borderRadius: "20px",
                                        padding: "8px 12px"
                                    }}
                                >
                                    {reactions.map((emoji, index) => (
                                        <span onClick={() => HandleReaction(emoji)} key={index} style={{
                                            fontSize: "20px",
                                            cursor: "pointer",
                                            backgroundColor: emoji === myReact ? textHintColor : "transparent",
                                            borderRadius: 50
                                        }}>
                            {emoji}
                            </span>
                                    ))}
                                    <Button style={{height: 20, width: 25}}
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            severity={"secondary"} text icon={"pi pi-plus-circle"}/>
                                    <Button style={{height: 20, width: 25}} onClick={() => {
                                        setShowReaction(false)
                                        setShowEmojiPicker(false)
                                    }} severity={"warning"} text icon={"pi pi-times-circle"}/>
                                    {showEmojiPicker && (
                                        <div style={{zIndex: 10}}>
                                            <EmojiPicker onEmojiClick={handleEmojiSelect}/>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                            {listReactShow?.length > 0 && (
                                <div  onClick={ShowReactions}>
                                    {listReactShow.map((r) =>
                                        <span key={r}>{r}</span>
                                    )}
                                </div>
                            )}
                    </div>

                </div>

            </div>
        </div>
    )
}
export default MessageCard;
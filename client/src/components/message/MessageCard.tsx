import React, {useContext, useRef, useState} from "react";
import {ThemeContext} from "../../ThemeContext.tsx";
import useStore from "../../store/useStore.tsx";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import {Menu} from "primereact/menu";
import {MenuItem} from "primereact/menuitem";
import EmojiPicker from "emoji-picker-react";

const MessageCard : React.FC<any> = ({ListMembers, Message, onSelectReaction}) => {
    const {userId, setId} = useStore()
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
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
        

    const HandleReplyComment = async()=>{

    }
    const HandleReaction = async(emoji) =>{
        console.log(emoji)
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
    console.log(Message)
    return(
        <>
            <div
                className={ "message message-" + (Message.isSystem ? "system" : isMe)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: isMe==="me" ? "row-reverse" : "row"
                }}
            >
                {!Message.isSystem ? <Avatar className={"mx-1"} size="normal" shape="circle" image={ListMembers[Message.senderId].imageUrl}/> : <></>}
                <p
                    style={{
                        backgroundColor: Message.isSystem ? "transparent" : backMessColor,
                        color: Message.isSystem ? "aqua" : textColor,
                        padding: 10,
                        width: "fit-content",
                        minWidth: 50,
                        maxWidth: 400,
                        borderRadius: 20,
                        display: "flex",
                        justifyContent: "center",
                        fontSize: (Message.isSystem || Message.isDeleted) ? 12 : 16,
                        fontStyle: (Message.isSystem || Message.isDeleted) ? "italic" : "normal",
                        overflowWrap: "anywhere"
                    }}
                >{Message.isDeleted ? "Message has been deleted!": Message.content}</p>

                <Button onClick={HandleReplyComment}  className={"btn-more"} text icon={"pi pi-reply"} style={{display: "none"}}/>
                {/*<Button onClick={(e) => onSelectReaction(Message, e)}     className={"btn-more"} text icon={"pi pi-face-smile"} style={{display: "none"}}/>*/}
                <Button onClick={handleSelectMessageForReaction}    className={"btn-more"} text icon={"pi pi-face-smile"} style={{display: "none"}}/>

                {showReaction && (
                    <div
                        className="reactions"
                        style={{
                            height: "fit-content",
                            // position: "absolute",
                            // top: `${reactionPosition.top}px`,
                            // left: `${reactionPosition.left}px`,
                            zIndex: 1000,
                            background: "#f0f0f0",
                            borderRadius: "20px",
                            padding: "8px 12px"
                        }}
                    >
                        {reactions.map((emoji, index) => (
                            <span onClick={()=>HandleReaction(emoji)} key={index} style={{ fontSize: "20px", cursor: "pointer" }}>
                            {emoji}
                            </span>
                        ))}
                        <Button style={{height: 20, width: 25}} onClick={() => setShowEmojiPicker(!showEmojiPicker)} severity={"secondary"} text icon={"pi pi-plus-circle"}/>
                        <Button style={{height: 20, width: 25}} onClick={() => setShowReaction(false)} severity={"warning"} text icon={"pi pi-times-circle"}/>
                        {/*<span*/}
                        {/*    style={{ fontSize: "20px", fontWeight: "bold", cursor: "pointer", padding: "3px 8px", borderRadius: "50%", background: "#ddd" }}*/}
                        {/*    */}
                        {/*>*/}
                        {/*    +*/}
                        {/*</span>*/}

                        {showEmojiPicker && (
                            <div style={{ position: "absolute", top: "40px", left: "0px", zIndex: 10 }}>
                                <EmojiPicker onEmojiClick={handleEmojiSelect} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}
export default MessageCard;
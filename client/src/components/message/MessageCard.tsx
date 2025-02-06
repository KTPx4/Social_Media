import React, {useContext} from "react";
import {ThemeContext} from "../../ThemeContext.tsx";
import useStore from "../../store/useStore.tsx";
import {Avatar} from "primereact/avatar";

const MessageCard : React.FC<any> = ({ListMembers, Message}) => {
    const {userId, setId} = useStore()
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const textColor = currentTheme.getText()
    const textHintColor = currentTheme.getHint()
    const captionColor = currentTheme.getCaption()
    const cardColor = currentTheme.getCard()
    const isMe = Message.senderId ===  userId ? "me" : "friend"
    const backMessColor = Message.senderId ===  userId ? "#4ba3e3" : cardColor

    return(
        <>
            <div
                className={ "message-" + (Message.isSystem ? "system" : isMe)}
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
                        padding: 7,
                        width: "fit-content",
                        minWidth: 50,
                        maxWidth: 400,
                        borderRadius: 30,
                        display: "flex",
                        justifyContent: "center",
                        fontStyle: Message.isSystem ? "italic" : "normal"
                    }}
                >{Message.content}</p>
            </div>
        </>
    )
}
export default MessageCard;
import React, {useContext, useEffect, useState} from "react";
import {Button} from "primereact/button";
import {IconField} from "primereact/iconfield";
import {InputText} from "primereact/inputtext";
import {InputIcon} from "primereact/inputicon";
import {ThemeContext} from "../../ThemeContext.tsx";
import useStore from "../../store/useStore.tsx";

const FooterRightContent : React.FC<any> = ({ListMembers, showIcon, SendLike, SendMessage, inputMessage, setInputMessage, setReplyMess, CallBackReply, }) =>{
    const {userId} = useStore()
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const keyTheme = currentTheme.getKey()
    const  cardColor = currentTheme.getCard()
    const [replyMessData, setReplyMessData] = useState(null)

    useEffect(() => {
        CallBackReply(HandleReplyMess)
    }, [ListMembers]);

    const HandleReplyMess = (Mess) =>{

        console.log("Reply mess: ", Mess)
        setReplyMessData(Mess)

    }

    const CancelReplyMess = () =>{
        setReplyMessData(null)
        setReplyMess(null)
    }
    const  HandleSendMess = ()=>{
        setReplyMessData(null)
        setReplyMess(null)
        SendMessage()
    }
    return(
        <>
            {replyMessData && ListMembers && (
                <>
                    <div style={{
                        width: "100%",
                        padding: 10,
                        backgroundColor: cardColor,

                        display:"flex",
                         flexDirection: "column"
                    }}>
                        <div style={{
                            display:"flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%"
                        }}>
                            <p style={{fontSize: 13, width: "70%"}}>Reply <span style={{
                                fontStyle: "italic",
                                fontSize: 13
                            }}>{replyMessData.senderId !== userId ? ListMembers[replyMessData.senderId].name : "me"}</span>
                            </p>
                            <Button onClick={CancelReplyMess} text rounded icon={"pi pi-times"}/>
                        </div>
                        <p style={{margin: 0, fontSize: 12, width: "80%"}}>{replyMessData.content}</p>
                    </div>
                </>
            )}


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
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
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
                                if (e.key === "Enter") {
                                  HandleSendMess()
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
        </>
    )
}
export default FooterRightContent;
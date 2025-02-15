import React, {useContext, useEffect, useRef, useState} from "react";
import {Button} from "primereact/button";
import {IconField} from "primereact/iconfield";
import {InputText} from "primereact/inputtext";
import {InputIcon} from "primereact/inputicon";
import {ThemeContext} from "../../ThemeContext.tsx";
import useStore from "../../store/useStore.tsx";
import {FileUpload} from "primereact/fileupload";
import {Toast} from "primereact/toast";
import apiClient from "../../utils/apiClient.tsx";
import {ProgressSpinner} from "primereact/progressspinner";

const MAX_SIZE_UPLOAD = 50*1024**1024

const FooterRightContent : React.FC<any> = ({CurrConvID, ListMembers, showIcon, SendLike, SendMessage, inputMessage, setInputMessage, setReplyMess, CallBackReply, }) =>{

    var urlServer =  import.meta.env.VITE_SERVER_URL || "https://localhost:7000";

    const {userId} = useStore()
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const keyTheme = currentTheme.getKey()
    const  cardColor = currentTheme.getCard()
    const [replyMessData, setReplyMessData] = useState(null)
    const toast = useRef<Toast>(null);
    const [waitSendFile, setWaitSendFile] = useState(false)


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
    const HandleUpload = async (event) =>{
        const file = event.files[0]; // Lấy file đầu tiên (nếu có)
        if (!file) {
            toast.current.show({ severity: 'warn', summary: 'Invalid', detail: 'Please select file' });
            return;
        }

        if(file.length > MAX_SIZE_UPLOAD)
        {
            toast.current.show({ severity: 'warn', summary: 'Invalid', detail: 'Please select file less than 50MB' });
            return;
        }
        setWaitSendFile(true)
        const formData = new FormData();
        formData.append("file", file); // Thêm file vào FormData

        try {
            const response = await apiClient.post(`/chat/conversation/${CurrConvID}/file`, formData);
            var status = response.status
            if(status === 200)
            {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'File Uploaded' });
                var data = response.data.data;
                console.log(data)
            }
            setWaitSendFile(false)
        } catch (error) {
            setWaitSendFile(false)
            toast.current.show({ severity: 'error', summary: 'Failed', detail: 'Upload failed' });
        }
    }
    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onError = () =>{
        toast.current.show({ severity: 'error', summary: 'Failed', detail: 'Upload failed' });

    }

    const URL_UPLOAD = `${urlServer}/api/chat/conversation/${CurrConvID}/file`

    const chooseOptions = { icon: 'pi pi-fw pi-file-plus', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-text' };

    return(
        <>
            <Toast ref={toast}></Toast>
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
                    {!waitSendFile && (
                        <FileUpload customUpload  chooseOptions={chooseOptions} mode="basic" name="file" uploadHandler={HandleUpload} auto  />
                    )}
                    {waitSendFile && (
                        <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="4" fill="transparent"
                                         animationDuration=".5s"/>
                    )}

                    {/*<Button text icon={"pi pi-file-plus"} size={"large"}/>*/}

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
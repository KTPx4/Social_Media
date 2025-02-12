import React, {useContext, useEffect, useRef, useState} from "react";
import {Button} from "primereact/button";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {InputText} from "primereact/inputtext";
import {ThemeContext} from "../../ThemeContext.tsx";
import ConversationCard from "./ConversationCard.tsx";
import apiClient from "../../utils/apiClient.tsx";
import {ProgressSpinner} from "primereact/progressspinner";
import {useWebSocketContext} from "../../store/WebSocketContext.tsx";
import CreateGroupChat from "./CreateGroupChat.tsx";


const LeftInfo : React.FC<any> = ({isLoading,ClickCallBack, userId, listConversation, setListConversation, ListMembers, CallBackUpdateLastMess, showModalCreate})=>{
    // @ts-ignore
    const { isConnected,  sendMessage, setNewMessages, subscribeToMessages } = useWebSocketContext();
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    // @ts-ignore
    const textColor = currentTheme.getText()
    const borderColor = currentTheme.getBorder()
    const backgroundColor = currentTheme.getBackground()
    const textHintColor = currentTheme.getHint()
    const keyTheme = currentTheme.getKey()

    const [listShowConv, setListShowConv] = useState([])
    const listShowConvRef = useRef(listShowConv); // Lưu trữ dữ liệu mới nhất
    const [isShowCreate, setShowCreate] = useState(false)
    useEffect(() => {
        if(listConversation)
        {
            listShowConvRef.current = listConversation; // Luôn lưu trữ dữ liệu mới nhất
            setListShowConv(listConversation);

        }
    }, [listConversation]);

    useEffect(() => {
        subscribeToMessages(handleNewMessage);
        CallBackUpdateLastMess(subscriptUpdateLastMess)
    }, []);

    const subscriptUpdateLastMess =  (newMess) => {
        if(newMess)
        {
            setListShowConv((prevList) => {
                // console.log("prev: ", prevList)
                var newList = prevList.map((c) => {
                    if (c.id === newMess.conversationId) {
                        c.time = Date.now();
                        c.lastMessage = newMess;
                        if (!c.isSelected) c.unRead = c.unRead + 1;
                    }
                    return c;
                });
                console.log(newList)
                if(newList.filter((c)=>c.id === newMess.conversationId).length < 1)
                {

                }
                return newList;
            });
        }
    }
    const handleNewMessage = (message) => {
        var type = message.type;
        if (type === "message") {
            var newMessage = message.message;
            if (newMessage) {
                var convId = message.conversationId;
                setListShowConv((prevList) => {
                    // console.log("prev: ", prevList)
                    var newList = prevList.map((c) => {
                        if (c.id === convId) {
                            c.time = Date.now();
                            c.lastMessage = newMessage;
                            if (!c.isSelected) c.unRead = c.unRead + 1;
                        }
                        return c;
                    });

                    return newList;
                });
            }
        }
    };


    const ClickConversationCard = async(Conversation : any)=>{
        var dt = listConversation.map((prev: any) => prev.id !== Conversation.id ? {...prev, isSelected: false} : {...prev, isSelected: true})
        // @ts-ignore
        setListConversation(dt)

        ClickCallBack(Conversation)

    }

    const HandleShowCreate = ()=>{
        setShowCreate(true)
    }
    const HandleCreateSuccess = (Conv)=>{
        var newConv = {
            ...Conv,
            time : Date.now(),
            unRead : 1,
            isSelected: false
        }
        setListConversation((prev) => [newConv, ...prev])
    }

    // @ts-ignore
    return(
        <div style={{
            borderRadius: 10,
            height: "99%",
            border: `1px solid ${borderColor}`
        }}>
            <CreateGroupChat isShow={isShowCreate} setIsShow={setShowCreate} CreateSuccessCall={HandleCreateSuccess}/>
            {/*Header*/}
            <div className={"header-info"} style={{
                // borderBottom: `1px solid ${borderColor}`,
                padding: 15
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <p style={{
                        fontSize: 25,
                        fontWeight: "bold",
                        fontStyle: "Roboto",
                        margin: 0
                    }}>Messages</p>

                    <Button
                        onClick={HandleShowCreate}
                        style={{
                        height: 35,
                        width: 35,
                        borderRadius: 10,
                        backgroundColor: "white",
                        border: "1px solid grey"
                    }}
                            icon={<img src="/svg/create.svg" alt="create" style={{width: 20, height: 20}}/>}
                    />
                </div>
                <div style={{
                    width: "100%", marginTop: 15, marginBottom: 0, padding: "0 15px"
                }}>
                    {/*<IconField  style={{}}>*/}
                    {/*    <InputText style={{*/}
                    {/*        width: "100%",*/}
                    {/*        borderRadius: 40,*/}
                    {/*        height: 35*/}
                    {/*    }} placeholder="Search name..."/>*/}
                    {/*    <InputIcon style={{marginRight: 15,}} className="pi pi-search"> </InputIcon>*/}

                    {/*</IconField>*/}
                </div>

            </div>

            {/*List Conversation*/}
            <div style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                padding:"10px 5px",
                overflow: "auto",
                height: "85%"
            }}>
                {isLoading && (
                    <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="4" fill="transparent"
                                     animationDuration=".5s"/>
                )}
                {listShowConv.map( (c : any) => {
                    return(
                            <ConversationCard key={c.id + c.isSelected + c.time} Conversation={c} ClickCallback={ClickConversationCard} userId={userId} ListMembers={ListMembers}/>
                    )
                })}
            </div>
        </div>
    )
}

export default LeftInfo;
import React, {useContext, useEffect, useRef, useState} from "react";
import LeftInfo from "../../components/message/LeftInfo.tsx";
import RightContent from "../../components/message/RightContent.tsx";
import useStore from "../../store/useStore.tsx";
import apiClient from "../../utils/apiClient.tsx";
import {useWebSocketContext} from "../../store/WebSocketContext.tsx";
import InfoChatDirect from "../../components/message/InfoChatDirect.tsx";
import InfoChatGroup from "../../components/message/InfoChatGroup.tsx";
import { IndexedDBService } from "../../store/IndexedDBService.ts";
import EmojiPicker from "emoji-picker-react";
import {Dialog} from "primereact/dialog";
import {ThemeContext} from "../../ThemeContext.tsx";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext"; // Import Emoji Picker

enum ConversationType {
    Direct = 0,
    Group = 1
}
const MessagePage : React.FC = () => {

    const { userId } = useStore();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
    const db = new IndexedDBService("ChatDB", "messages");
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const keyTheme = currentTheme.getKey()
    const textColor = currentTheme.getText()

    const [listConversation, setListConversation] = useState([]);
    const [currentConversation, setConversation] = useState(null);
    const [listMembers, setListMembers] = useState([]);



    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    const callBackRef = useRef(null);

    const [showModalCreate, setShowModalCreate] = useState(false);
    const [listSuggest , setListSuggestFriend] = useState([])
    const [opDicrectUser, setOpDicrectUser] = useState(null);
    var infoComponent = useRef<any>(null)

    useEffect(() => {
        loadSuggest()
        LoadFromLocal();
        LoadData();
    }, []);

    useEffect(() => {
        if(currentConversation)
        {

            if(currentConversation.type === ConversationType.Group)
            {
                infoComponent.current = (<InfoChatGroup
                    ListSuggest={listSuggest}
                    UpdateMemberSuccess={UpdateMemberSuccess}
                    ListMembers={listMembers}
                    ConvId={currentConversation?.id}
                    HandleCallBackInfo={HandleCallBackInfo}
                    Image={currentConversation?.imageUrl + token}
                    NameGroup={currentConversation?.name}/>)
            }
            else  if(opDicrectUser)
            {
                infoComponent.current = (
                    <InfoChatDirect DirectUser={opDicrectUser} ListMembers={listMembers}   Conversation={currentConversation} /> )
            }
        }
    }, [currentConversation, opDicrectUser]);

    const loadSuggest =async () =>{
        try{
            var rs = await  apiClient.get("/user/friends?page=1")
            var statusCode = rs.status
            if(statusCode === 200)
            {
                var data = rs.data.data
                setListSuggestFriend(data)
            }
        }
        catch (e)
        {
            console.log(e)
        }

    }
    const ClickConversation = async (Conversation: any) => {
        if (currentConversation && currentConversation.id === Conversation.id) return;
        setShowInfo(false)
        setListConversation((prev)=> {
            var newList = prev.map((c) => c.id === Conversation.id ? {...c, unRead: 0} : c)
            return newList
        })
        setConversation(Conversation);

        if(Conversation.type === ConversationType.Direct)
        {
            var members = Conversation.members
            var op = members.filter((i: any) => i.userId !==  userId)[0]
            await loadInfo(op.id ?? op.userId ?? "")
        }

        if(Conversation.unRead < 1) return
        try{
            var rs = await apiClient.post(`/chat/conversation/${Conversation.id}/seen`)

        }
        catch(error){
            console.log(error)
        }
    };
    const loadInfo = async (userid)=>{
        try{
            var rs = await  apiClient.get(`/user/search/${userid}`)
            var status = rs.status

            if(status === 200)
            {
                var data = rs.data.data
                setOpDicrectUser(data)
            }
        }
        catch (e)
        {
            console.log(e)
        }
    }
    const CloseInfo = () => {
        setShowInfo(false);
    };

    const LoadFromLocal = async () => {
        try {
            const saveConversation = await db.getItem<{ id: string; conversations: any }[]>("conversations");
            if (!saveConversation) return;

            var dict = {};
            var data = saveConversation?.conversations;

            data.forEach((d) => {
                dict[d.id] = d;
            });

            setListMembers(dict);
            data = data?.map((e: any) => {
                return { ...e, isSelected: false, time: Date.now() };
            });

            setListConversation(data);
        } catch (e) {
            console.log(e);
        }
    };

    const LoadData = async () => {
        try {
            var rs = await apiClient.get("/chat/conversation");

            var status = rs.status;
            if (status === 200) {
                var dict = {};
                var data = rs.data.data;
                await db.addItem({ id: "conversations", conversations: data });

                data.forEach((d) => {
                    dict[d.id] = d;
                });

                setListMembers(dict);
                data = data.map((e: any) => {
                    return { ...e, isSelected: false, time: Date.now() };
                });

                setListConversation(data);
            }
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    const HandleCallBackInfo = (type, data = null)=>{
        switch (type)
        {
            case "media":
                break

            case "file":
                break

            case "info":
                // update group
                var newList = listConversation.map(c => c.id === data.id  ?
                    {...c, imageUrl: data.imageUrl, name: data.name, time: Date.now()} : c)

                setListConversation([...newList])

                if(currentConversation.id === data.id)
                {
                    setConversation((prev) => {
                        return {...prev, imageUrl: (data.imageUrl ), name: data.name}
                    })

                }

                break;

            case "members":
                break

            case "report":
                break

            case "leave":
                if(currentConversation.id === data)
                {
                    setConversation(null)
                }
                setListConversation((prev) => {
                    var newList = prev.filter((c) => c.id !== data)
                    return newList
                })
                break
        }
    }
    const UpdateMemberSuccess = (data)=>{
         try{
             var members= data.members
             var newList = listConversation.map((prev)=> prev.id === data.id ? {...prev, members: members} : prev)

             setListConversation(newList)
             var newListMembers = listMembers
             newListMembers[data.id] = members
             setListMembers(newListMembers)
         }
         catch (e)
         {
             console.log(e)
         }
    }

    // const InfoContent = currentConversation === null ? null : (
    //     currentConversation.type === ConversationType.Direct ?
    //         <InfoChatDirect DirectUser={opDicrectUser} ListMembers={listMembers}   Conversation={currentConversation} /> :
    //         <InfoChatGroup
    //             ListSuggest={listSuggest}
    //             UpdateMemberSuccess={UpdateMemberSuccess}
    //             ListMembers={listMembers}
    //             ConvId={currentConversation?.id}
    //             HandleCallBackInfo={HandleCallBackInfo}
    //             Image={currentConversation?.imageUrl + token}
    //             NameGroup={currentConversation?.name}/>
    // );

    const HandleChangeLastMess = (newMess)=>{
        if(callBackRef?.current)
        {
            const func = callBackRef.current
            func(newMess)
        }
    }

    const CallBackUpdateLastMess = (callBack)=>{
        callBackRef.current = callBack
    }




    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row" }}>

            <div className="left-info" style={{ height: "100vh", width: "25%", minWidth: 250, backgroundColor: "transparent" }}>
                <LeftInfo key={Date.now()}
                          showModalCreate={()=>setShowModalCreate(true)}
                          CallBackUpdateLastMess={CallBackUpdateLastMess}
                          isLoading={isLoading}
                          ClickCallBack={ClickConversation}
                          userId={userId}
                          listConversation={listConversation}
                          setListConversation={setListConversation}
                          ListMembers={listMembers}
                          setListMembers={setListMembers}
                />
            </div>

            <div className={"right-message"} style={{ height: "100%", width: showInfo ? "50%" : "75%", backgroundColor: "transparent" }}>
                <RightContent
                    DirectUser={opDicrectUser}
                    key={currentConversation?.id + Date.now()}
                    DbContext={db}
                    CurrentConversation={currentConversation}
                    userId={userId}
                    listConversation={listConversation}
                    setListConversation={setListConversation}
                    showInfo={() => setShowInfo(!showInfo)}
                    ListMembers={listMembers}
                    HandleChangeLastMess={HandleChangeLastMess}

                />
            </div>

            <div className={"right-setting"} style={{ height: "100%", width: showInfo ? "25%" : "0%", backgroundColor: "transparent" }}>
                {showInfo && (infoComponent.current)}
            </div>

            {/* 🎉 Hiển thị Emoji Picker ngoài cùng */}
            {/* Hiển thị danh sách reactions */}


        </div>
    );
};

export default MessagePage;

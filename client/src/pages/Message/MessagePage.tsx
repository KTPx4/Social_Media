import React, {useEffect, useRef, useState} from "react";
import LeftInfo from "../../components/message/LeftInfo.tsx";
import RightContent from "../../components/message/RightContent.tsx";
import useStore from "../../store/useStore.tsx";
import apiClient from "../../utils/apiClient.tsx";
import {useWebSocketContext} from "../../store/WebSocketContext.tsx";
import InfoChatDirect from "../../components/message/InfoChatDirect.tsx";
import InfoChatGroup from "../../components/message/InfoChatGroup.tsx";
import { IndexedDBService } from "../../store/IndexedDBService.ts";
import EmojiPicker from "emoji-picker-react"; // Import Emoji Picker

enum ConversationType {
    Direct = 0,
    Group = 1
}

const MessagePage : React.FC = () => {
    const { userId } = useStore();
    const db = new IndexedDBService("ChatDB", "messages");

    const [listConversation, setListConversation] = useState([]);
    const [currentConversation, setConversation] = useState(null);
    const [listMembers, setListMembers] = useState([]);



    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    const callBackRef = useRef(null);

    const [showModalCreate, setShowModalCreate] = useState(false);



    useEffect(() => {
        LoadFromLocal();
        LoadData();
    }, []);

    const ClickConversation = async (Conversation: any) => {
        if (currentConversation && currentConversation.id === Conversation.id) return;
        setListConversation((prev)=> {
            var newList = prev.map((c) => c.id === Conversation.id ? {...c, unRead: 0} : c)
            return newList
        })
        setConversation(Conversation);
        if(Conversation.unRead < 1) return
        try{
            var rs = await apiClient.post(`/chat/conversation/${Conversation.id}/seen`)

        }
        catch(error){
            console.log(error)
        }
    };

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
            console.log("get conversation: ", rs.data.data);
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

    const InfoContent = currentConversation === null ? null : (
        currentConversation.type === ConversationType.Direct ? <InfoChatDirect /> : <InfoChatGroup />
    );
    const HandleChangeLastMess = (newMess)=>{
        console.log(newMess)
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
                <LeftInfo showModalCreate={()=>setShowModalCreate(true)} CallBackUpdateLastMess={CallBackUpdateLastMess} isLoading={isLoading} ClickCallBack={ClickConversation} userId={userId} listConversation={listConversation} setListConversation={setListConversation} ListMembers={listMembers} />
            </div>

            <div className={"right-message"} style={{ height: "100%", width: showInfo ? "50%" : "75%", backgroundColor: "transparent" }}>
                <RightContent
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
                {showInfo && InfoContent}
            </div>

            {/* 🎉 Hiển thị Emoji Picker ngoài cùng */}
            {/* Hiển thị danh sách reactions */}


        </div>
    );
};

export default MessagePage;

import React, {useEffect, useState} from "react";
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

    // @ts-ignore
    const { isConnected, messages, sendMessage, setNewMessages } = useWebSocketContext();

    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    // 🎉 State quản lý Reaction Picker
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
// Emoji reactions mặc định
    const defaultReactions = ["👍", "❤️", "😆", "😢", "🙏", "👎", "😡"];
    const [reactions, setReactions] = useState<string[]>(defaultReactions);
    const [reactionPosition, setReactionPosition] = useState<{ top: number, left: number } | null>(null);



    useEffect(() => {
        if (messages) {
            var convId = messages.conversationId;
            var newList = listConversation.map((c) => {
                if (c.id === convId) {
                    c.time = Date.now();
                    c.lastMessage = messages.message;
                    if (!currentConversation || currentConversation.id !== convId) c.unRead = c.unRead + 1;
                }
                return c;
            });
            setListConversation(newList);
        }
    }, [messages]);

    useEffect(() => {
        LoadFromLocal();
        LoadData();
    }, []);

    const ClickConversation = async (Conversation: any) => {
        if (currentConversation && currentConversation.id === Conversation.id) return;
        setConversation(Conversation);
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

    // 🎉 Khi chọn emoji, gửi vào tin nhắn
    const handleEmojiSelect = (emoji: any) => {
        if (!reactions.includes(emoji.emoji)) {
            // setReactions([...reactions, emoji.emoji]); // Thêm vào danh sách reactions
            var  newReact = reactions.map((e, index) => index === (reactions.length -1) ? emoji.emoji : e)
            setReactions(newReact)
        }

        setShowEmojiPicker(false); // Ẩn picker
    };
    const handleSelectMessageForReaction = (message: any, event: React.MouseEvent) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setSelectedMessage(message);
        setReactionPosition({
            top: rect.bottom + window.scrollY, // Lấy vị trí phía dưới tin nhắn
            left: rect.left + window.scrollX   // Căn chỉnh ngang theo tin nhắn
        });

    };
    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row" }}>
            <div className="left-info" style={{ height: "100vh", width: "25%", minWidth: 250, backgroundColor: "transparent" }}>
                <LeftInfo isLoading={isLoading} ClickCallBack={ClickConversation} userId={userId} listConversation={listConversation} setListConversation={setListConversation} ListMembers={listMembers} />
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
                    // onSelectMessageForReaction={handleSelectMessageForReaction} // 📌 Truyền hàm callback xuống RightContent
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

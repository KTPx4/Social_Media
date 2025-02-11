import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { HubConnectionBuilder, HubConnection, LogLevel } from "@microsoft/signalr";
import useStore from "./useStore.tsx";

// Định nghĩa kiểu dữ liệu cho Context
interface WebSocketContextProps {
    isConnected: boolean;
    // messages: { sender: string; message: string }[];
    // reactMessage: any;
    subscribeToMessages: any;
    sendMessage: (senderId: string, receiverUserId: string, message: string, type: number , replyMessageId: any) => any;
    setNewMessages: any;
    sendDirectMessage: any;
    sendReactMessage: any;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

interface WebSocketProviderProps {
    url: string;
    children: React.ReactNode;
}
enum MessageType
{
    Text = 0, Image = 1, Video = 2, File = 3
}
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ url, children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
    const [reactMessage, setReactMessage] = useState<{ sender: string; message: string }[]>([]);
    const connectionRef = useRef<HubConnection | null>(null);
    const reconnectTimeout = useRef<NodeJS.Timeout | null>(null); // Lưu timeout để reconnect
    const {userId} = useStore()

    const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";

    const messageListeners = useRef<((message: any) => void)[]>([]);
    const messagesRef = useRef<{ sender: string; message: string }[]>([]);
    const [, forceRender] = useState(0); // State ảo để trigger render khi cần thiết
    const connectWebSocket = () => {
        if (!token || connectionRef.current) return; // Nếu không có token hoặc đã có kết nối thì không tạo mới

        console.log("🔄 Connecting to WebSocket...");

        const connection = new HubConnectionBuilder()
            .withUrl(url, {
                accessTokenFactory: () => token, // Truyền JWT vào Header
            })
            .configureLogging(LogLevel.Information)
            .build();

        connectionRef.current = connection;

        connection
            .start()
            .then(() => {
                console.log("✅ Connected to WebSocket");
                setIsConnected(true);

                // Lắng nghe tin nhắn từ server
                connection.on("ReceiveMessage", (sender: string, message: string) => {
                    // console.log("Get message: ", { sender, conversationId: message.conversationId, message })
                    const newMessage = { type: "message", sender, conversationId: message.conversationId, message };
                    // @ts-ignore
                    // setMessages({ sender, conversationId: message.conversationId, message });
                    messagesRef.current = newMessage;

                    // ✅ Gọi tất cả listener đã đăng ký
                    messageListeners.current.forEach((callback) => callback(newMessage));

                });

                connection.on("ReactMessage", (sender: string, message: string) => {
                    // console.log("Get raction: ", { sender, conversationId: message.conversationId, message })
                    // @ts-ignore
                    // setReactMessage({ sender, conversationId: message.conversationId, message });
                    const newMessage = { type: "react", sender, conversationId: message.conversationId, message };
                    messageListeners.current.forEach((callback) => callback(newMessage));

                });


                // Xóa timeout nếu kết nối thành công
                if (reconnectTimeout.current) {
                    clearTimeout(reconnectTimeout.current);
                    reconnectTimeout.current = null;
                }
            })
            .catch((err) => {
                console.error("❌ WebSocket connection error:", err);
                retryConnection(); // Thử kết nối lại sau 10 giây nếu lỗi
            });

        // Sự kiện khi kết nối bị ngắt
        connection.onclose(() => {
            console.warn("⚠️ WebSocket disconnected");
            setIsConnected(false);
            retryConnection(); // Thử kết nối lại nếu bị mất kết nối
        });
    };

    const subscribeToMessages = (callback: (message: any) => void) => {
        messageListeners.current.push(callback);
    };
    const retryConnection = () => {
        if (reconnectTimeout.current) return; // Nếu đã có timeout thì không tạo mới

        reconnectTimeout.current = setTimeout(() => {
            console.log("⏳ Retrying WebSocket connection...");
            connectWebSocket();
        }, 10000); // Thử lại sau 10 giây
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            connectionRef.current?.stop();
        };
    }, [url, token]);

    useEffect(() => {
        if(isConnected)
        {
            // sendMessage("21882161-6b64-4f66-2600-08dd3cdbf3c9", "Hello")
        }
    }, [isConnected]);

    const sendMessage = async (senderId: string, receiverUserId: string, message: string, type: number, replyMessageId: any = null) => {

        if (connectionRef.current && isConnected && userId && receiverUserId !== userId) {
            try {

                var body ={
                    ConversationId: receiverUserId,
                    ReplyMessageId: replyMessageId,
                    Content: message,
                    SenderId: senderId,
                    Type: type
                }
                var rs = await connectionRef.current.invoke("SendMessage", body);
                return rs
            } catch (err) {
                console.error("❌ SendMessage failed:", err);
                return null
            }
        } else {
            console.error("⚠️ Can not send message");
            return null
        }
    };
    const sendDirectMessage = async (senderId: string, receiverUserId: string, message: string, type: number = MessageType.Text, replyMessageId: any = null) => {

        if (connectionRef.current && isConnected && userId && receiverUserId !== userId) {
            try {
                var body ={
                    ConversationId: receiverUserId,
                    ReplyMessageId: replyMessageId,
                    Content: message,
                    SenderId: senderId,
                    Type: type
                }
                var rs = await connectionRef.current.invoke("SendDirectMessage", body);
                return rs
            } catch (err) {
                console.error("❌ SendMessage failed:", err);
                return null
            }
        } else {
            console.error("⚠️ Can not send message");
            return null
        }
    };
    const sendReactMessage = async (senderId: string, messageId: string, react: string) => {

        if (connectionRef.current && isConnected && userId) {
            try {
                var body ={
                    SenderId: senderId,
                    MessageId: messageId,
                    React: react,
                }
                var rs = await connectionRef.current.invoke("SendReactMessage", body);
                return rs
            } catch (err) {
                console.error("❌ SendMessage failed:", err);
                return null
            }
        } else {
            console.error("⚠️ Can not send message");
            return null
        }
    };
    return (
        <WebSocketContext.Provider value={{ isConnected,  subscribeToMessages , sendMessage, sendDirectMessage , setNewMessages:{setMessages} , sendReactMessage}}>
            {children}
        </WebSocketContext.Provider>
    );
};

// Custom Hook để sử dụng WebSocket
export const useWebSocketContext = (): WebSocketContextProps => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocketContext must be used within a WebSocketProvider");
    }
    return context;
};

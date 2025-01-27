import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface WebSocketContextProps {
    isConnected: boolean;
    messages: string[];
    sendMessage: (message: string) => void;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

interface WebSocketProviderProps {
    url: string;
    children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ url, children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const ws = useRef<WebSocket | null>(null);

    var token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";

    const connect = () => {
        if (ws.current || !token) return;

        // Thêm token vào URL (query parameter)
        const fullUrl = `${url}?token=${token}`;

        ws.current = new WebSocket(fullUrl);

        ws.current.onopen = () => {
            console.log("WebSocket connected");
            setIsConnected(true);
        };

        ws.current.onmessage = (event) => {
            console.log("Message received:", event.data);
            setMessages((prev) => [...prev, event.data]);
        };

        ws.current.onclose = () => {
            console.log("WebSocket disconnected");
            setIsConnected(false);

            // Tự động kết nối lại
            setTimeout(connect, 10000);
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
            ws.current?.close();
            ws.current = null;
        };
    };

    const sendMessage = (message: string) => {
        if (ws.current && isConnected) {
            ws.current.send(message);
        } else {
            console.error("WebSocket is not connected");
        }
    };

    useEffect(() => {
        connect();

        return () => {
            ws.current?.close();
            ws.current = null;
        };
    }, [url, token]); // Kết nối lại nếu token thay đổi

    return (
        <WebSocketContext.Provider value={{ isConnected, messages, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = (): WebSocketContextProps => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocketContext must be used within a WebSocketProvider");
    }
    return context;
};

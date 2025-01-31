// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "primeflex/primeflex.css";
import {WebSocketProvider} from "./store/WebSocketContext.tsx";

var url =  import.meta.env.VITE_SERVER_URL || "https://localhost:7000";

createRoot(document.getElementById("root")!).render(
    <WebSocketProvider url={url +"/chatHub"} >
        <App />
    </WebSocketProvider>
  // <StrictMode>
  // </StrictMode>
);

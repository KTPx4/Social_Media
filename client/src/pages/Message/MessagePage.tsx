import React, {useState} from "react";
import LeftInfo from "../../components/message/LeftInfo.tsx";
import RightContent from "../../components/message/RightContent.tsx";
import useStore from "../../store/useStore.tsx";


const MessagePage : React.FC = () =>{
    const {userId} = useStore()

    const [currentConversation, setConversation] = useState(null)
    const ClickConversation = async (Conversation) =>{
        setConversation(Conversation)
    }

    return(
        <div style={{
            width: "100%", height: "100%",
            display:"flex",
            flexDirection: "row",

        }}>
            <div className="left-info" style={{
                height: "100vh",
                width:"25%",
                minWidth: 250,
                backgroundColor: "transparent",
            }}>
                <LeftInfo ClickCallBack={ClickConversation} userId={userId}/>
            </div>

            <div className={"right-message"} style={{
                height: "100%",
                width: "50%",
                backgroundColor: "transparent"
            }}>
                <RightContent CurrentConversation={currentConversation} userId={userId}/>
            </div>

            <div className={"right-setting"} style={{
                height: "100%",
                width: "25%",
                backgroundColor: "transparent"
            }}>

            </div>
        </div>
    )
}

export  default  MessagePage;
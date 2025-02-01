import React from "react";
import LeftInfo from "../../components/message/LeftInfo.tsx";


const MessagePage : React.FC = () =>{

    return(
        <div style={{
            width: "100%", height: "100%",
            display:"flex",
            flexDirection: "row"
        }}>
            <div className="left-info" style={{
                height: "100vh",
                width:"25%",
                backgroundColor: "transparent",
            }}>
                <LeftInfo />
            </div>

            <div className={"right-message"} style={{
                height: "100%",
                width: "50%",
                backgroundColor: "transparent"
            }}>

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
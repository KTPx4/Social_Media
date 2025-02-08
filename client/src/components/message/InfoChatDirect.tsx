import React from "react";
import {Avatar} from "primereact/avatar";

const  InfoChatDirect : React.FC = () =>{
    return(
        <div style={{
            display: "flex",
            flexDirection: "column"
        }}>
            <Avatar style={{
                alignItems: "center",
            }} shape={"circle"} size={"large"} />
            <h1>hi</h1>
        </div>
    )
}
export default InfoChatDirect
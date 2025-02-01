import React, {useContext} from "react";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import {ThemeContext} from "../../ThemeContext.tsx";
interface CardProps{
    Conversation: any;

}
const ConversationCard : React.FC<CardProps> = ({Conversation}) => {
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const textColor = currentTheme.getText()
    const textHintColor = currentTheme.getHint()
    const captionColor = currentTheme.getCaption()
    const cardColor = currentTheme.getCard()

    return(
        <>
            <div style={{
                marginTop: 3,
                // backgroundColor: cardColor,
                padding: "10px 0",
                display: "flex",
                alignItems: "center", // Căn giữa theo chiều dọc
                gap: "10px" // Tạo khoảng cách giữa Avatar và nội dung
            }}>

                <Avatar image={""} size="large" shape="circle" className="p-mr-2"/>

                <div style={{flexGrow: 1, width:"60%"}}>
                    <span style={{fontWeight: "bold", color: textColor}}>123456</span>
                    <div style={{marginTop: 5,display: "flex", alignItems: "center", width: "100%"}}>
                        <p style={{
                            margin: 0,
                            flexGrow: 1,
                            fontSize: 12,
                            color: textHintColor,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            You: Hello xin chao ten toi la Phaaaaaaaaaaaaaaaaa
                        </p>

                        <p style={{ margin: 0,fontSize: 12, color: textHintColor, marginLeft: "10px", whiteSpace: "nowrap"}}>
                            50p
                        </p>
                    </div>
                </div>

                <Button icon="pi pi-ellipsis-h" className="p-button-text"/>
            </div>

        </>
    )
}
export default ConversationCard
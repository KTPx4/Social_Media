import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "../../ThemeContext.tsx";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import {IconField} from "primereact/iconfield";
import {InputText} from "primereact/inputtext";
import {InputIcon} from "primereact/inputicon";
import {InputTextarea} from "primereact/inputtextarea";


enum ConversationType {
    Direct = 0,
    Group = 1
}


const RightContent : React.FC<any> = ({CurrentConversation, userId})=>{
    const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";


    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const textColor = currentTheme.getText()
    const textHintColor = currentTheme.getHint()
    const captionColor = currentTheme.getCaption()
    const  cardColor = currentTheme.getCard()
    const borderColor = currentTheme.getBorder()

    const [nameChat, setNameChat] = useState(null);
    const [oponentChat, setOponentChat] = useState(null);
    const [imgGroup, setImgGroup] = useState(null);


    useEffect(() => {
        if(CurrentConversation)
        {
            setNameChat(CurrentConversation.name)

            if(CurrentConversation.type === ConversationType.Group)
            {
                setImgGroup(CurrentConversation.imageUrl + token)
            }
            else if(CurrentConversation.type === ConversationType.Direct)
            {
                var members = CurrentConversation.members
                var op = members.filter((i: any) => i.userId !==  userId)[0]
                setOponentChat(op)
                setNameChat(op.name)
                setImgGroup(op.imageUrl)
            }
        }

    }, [CurrentConversation]);

    const showIcon = ()=>{

    }

    if(!CurrentConversation){
        return(<></>)
    }

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            padding: "0",
            justifyContent: "space-between"
        }}>
            {/*Header*/}
            <div className="header-content" style={{
                top: 0,
                padding: 10,
                height: "10%",
                width: "100%",
                backgroundColor: "transparent",
                borderBottom: `1px solid ${borderColor}`,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <Avatar style={{minWidth: 50, minHeight: 50}} image={imgGroup} size="normal" shape="circle"
                            className="p-mr-2"/>
                    <p style={{
                        margin: "0px 9px",
                        fontSize: 20
                    }}>{nameChat}</p>
                </div>
                <div>
                    <Button text icon={"pi pi-phone"}/>
                    <Button text icon={"pi pi-ellipsis-h"}/>

                </div>

            </div>

            {/*Content*/}
            <div className="body-content" style={{
                height: "80%",
                padding: 10,
                backgroundColor: "transparent",
                // borderBottom: `1px solid ${borderColor}`,
            }}>
                <h1>Body</h1>
            </div>

            {/*footer*/}
            <div className="footer-content" style={{
                // borderRadius: 5,
                backgroundColor: cardColor,
                display: "flex",
                flexDirection: "column-reverse", // Giúp input mở rộng lên trên
                alignItems: "center",
                height: "auto",
                minHeight: "40px",
                // maxHeight: "150px",
                paddingTop: 10,
                marginBottom: 7,
            }}>
                <div>
                </div>
                <div style={{
                    width:"100%",
                    display: "flex",
                    flexDirection:"row",
                    justifyContent: "space-evenly"
                }}>
                    <Button text icon={"pi pi-file-plus"} size={"large"}/>

                    <IconField style={{
                        width: "80%",
                        display: "flex",
                        alignItems: "center",
                    }}>
                        <InputTextarea
                            autoResize
                            rows={1}
                            style={{
                                width: "100%",
                                borderRadius: 15,
                                // marginTop: 10,
                                padding: "10px",
                                border: "1px solid #ccc",
                                maxHeight: "100px",
                                overflow: "auto",
                                resize: "none",
                            }}
                            placeholder="Send message"
                        />
                        <InputIcon onClick={showIcon} style={{marginRight: 15}} className="pi pi-search"/>
                    </IconField>

                    <Button text icon={"pi pi-thumbs-up-fill"} size={"large"}/>

                </div>
            </div>
        </div>
    )
}
export default RightContent;
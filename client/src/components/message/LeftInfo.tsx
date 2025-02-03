import React, {useContext, useEffect, useState} from "react";
import {Button} from "primereact/button";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {InputText} from "primereact/inputtext";
import {ThemeContext} from "../../ThemeContext.tsx";
import ConversationCard from "./ConversationCard.tsx";
import apiClient from "../../utils/apiClient.tsx";


const LeftInfo : React.FC<any> = ({ClickCallBack, userId})=>{
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    // @ts-ignore
    const textColor = currentTheme.getText()
    const borderColor = currentTheme.getBorder()
    const backgroundColor = currentTheme.getBackground()
    const textHintColor = currentTheme.getHint()
    const keyTheme = currentTheme.getKey()

    // data
    const [listConversation, setListConversation] = useState([])

    useEffect(() => {
        LoadData()
    }, []);

    const LoadData = async()=>{
        try{
            var rs = await apiClient.get("/chat/conversation")
            console.log(rs)
            var status = rs.status
            if(status === 200)
            {
                var data = rs.data.data
                data = data.map( (e : any) =>{
                    return {...e, isSelected: false}
                })
                setListConversation(data)
            }
        }
        catch (err)
        {
            console.log(err)
        }
    }

    const ClickConversationCard = async(Conversation : any)=>{
        var dt = listConversation.map((prev: any) => prev.id !== Conversation.id ? prev : {...prev, isSelected: true})
        // @ts-ignore
        setListConversation(dt)

        ClickCallBack(Conversation)

    }

    // @ts-ignore
    return(
        <div style={{
            borderRadius: 10,
            height: "99%",
            border: `1px solid ${borderColor}`
        }}>
            {/*Header*/}
            <div className={"header-info"} style={{
                // borderBottom: `1px solid ${borderColor}`,
                padding: 15
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <p style={{
                        fontSize: 25,
                        fontWeight: "bold",
                        fontStyle: "Roboto",
                        margin: 0
                    }}>Messages</p>

                    <Button style={{
                        height: 35,
                        width: 35,
                        borderRadius: 10,
                        backgroundColor: "white",
                        border: "1px solid grey"
                    }}
                            icon={<img src="/svg/create.svg" alt="create" style={{width: 20, height: 20}}/>}
                    />
                </div>
                <div style={{
                    width: "100%", marginTop: 15, marginBottom: 0, padding: "0 15px"
                }}>
                    <IconField  style={{}}>
                        <InputText style={{
                            width: "100%",
                            borderRadius: 40,
                            height: 35
                        }} placeholder="Search name..."/>
                        <InputIcon style={{marginRight: 15,}} className="pi pi-search"> </InputIcon>

                    </IconField>
                </div>

            </div>

            {/*List Conversation*/}
            <div style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                padding:"10px 5px",
                overflow: "auto",
                height: "85%"
            }}>

                {listConversation.map( (c : any) => {
                    return(
                        <>
                            <ConversationCard key={c.id + c.isSelected} Conversation={c} ClickCallback={ClickConversationCard} userId={userId}/>
                        </>
                    )
                })}
            </div>
        </div>
    )
}

export default LeftInfo;
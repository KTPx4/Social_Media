import React, {useContext} from "react";
import {Button} from "primereact/button";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {InputText} from "primereact/inputtext";
import {ThemeContext} from "../../ThemeContext.tsx";
import ConversationCard from "./ConversationCard.tsx";


const LeftInfo : React.FC = ()=>{
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


    // @ts-ignore
    return(
        <>
            {/*Header*/}
            <div className={"header-info"} style={{
                borderBottom: `1px solid ${borderColor}`,
                padding: 10
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

                {[...Array(10)].map((_, index) => (
                    <ConversationCard key={index} />
                ))}
            </div>
        </>
    )
}

export default LeftInfo;
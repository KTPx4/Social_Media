import React, {useContext} from "react";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import {PanelMenu} from "primereact/panelmenu";
import {MenuItem} from "primereact/menuitem";
import {ThemeContext} from "../../ThemeContext.tsx";

const  InfoChatGroup : React.FC = () =>{
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const  cardColor = currentTheme.getCard()
    const keyTheme = currentTheme.getKey()
    const textHintColor = currentTheme.getHint()

    const items: MenuItem[] = [
        {
            label: 'Media, File',
            icon: 'pi pi-file',
            items: [
                {
                    label: 'Media',
                    icon: 'pi pi-image',

                },
                {
                    label: 'File',
                    icon: 'pi pi-file',
                    
                }
            ]
        },
        {
            label: 'Customize chat',
            icon: 'pi pi-cloud',
            items: [
                {
                    label: 'Edit name',
                    icon: <img src="/svg/text_icon.svg" alt="create" style={{width: 20, height: 20, marginRight: 5}}/>
                },
                {
                    label: 'Change picture',
                    icon: 'pi pi-image'
                },
                {
                    label: 'View members',
                    icon: 'pi pi-users'
                }
            ]
        },
        {
            label: 'Privacy',
            icon: 'pi pi-desktop',
            items: [
                {
                    label: 'Report',
                    icon: 'pi pi-exclamation-triangle'
                },
                {
                    label: 'Leave',
                    icon: 'pi pi-sign-out'
                }
            ]
        }
    ];

    return(
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems:"center",
            padding: 10,
            marginTop: 10
        }}>
            <Avatar style={{
                alignSelf: "center",
                minHeight: 70,
                minWidth: 70
            }} shape={"circle"} size={"large"} />
            {/*name*/}
            <h1 style={{  width: "fit-content", maxWidth: 250, textOverflow: "ellipsis",overflow: "hidden",}}>Namedddddddddddddddddddddddddddddddddddddddddd</h1>

            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent:"center"
            }}>
                <div style={{marginRight: 20, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
                    <Button style={{margin: 0}} text icon={"pi pi-bell"} />
                    <p style={{margin: 0}}>Notification</p>
                </div>
                <div style={{marginRight: 10, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
                    <Button text icon={"pi pi-search"}/>
                    <p style={{margin: 0}}>Search</p>
                </div>
            </div>

            <PanelMenu  style={{marginTop: 10, backgroundColor: "transparent", width: "100% !important"}} model={items} className={`w-full md:w-20rem ${keyTheme}`} />

        </div>
    )
}
export default InfoChatGroup
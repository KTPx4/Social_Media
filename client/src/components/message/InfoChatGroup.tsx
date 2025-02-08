import React from "react";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import {PanelMenu} from "primereact/panelmenu";
import {MenuItem} from "primereact/menuitem";

const  InfoChatGroup : React.FC = () =>{
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
            label: 'Cloud',
            icon: 'pi pi-cloud',
            items: [
                {
                    label: 'Upload',
                    icon: 'pi pi-cloud-upload'
                },
                {
                    label: 'Download',
                    icon: 'pi pi-cloud-download'
                },
                {
                    label: 'Sync',
                    icon: 'pi pi-refresh'
                }
            ]
        },
        {
            label: 'Devices',
            icon: 'pi pi-desktop',
            items: [
                {
                    label: 'Phone',
                    icon: 'pi pi-mobile'
                },
                {
                    label: 'Desktop',
                    icon: 'pi pi-desktop'
                },
                {
                    label: 'Tablet',
                    icon: 'pi pi-tablet'
                }
            ]
        }
    ];

    return(
        <div style={{
            display: "flex",
            flexDirection: "column",
            padding: 10,
            marginTop: 10
        }}>
            <Avatar style={{
                alignSelf: "center",
                minHeight: 70,
                minWidth: 70
            }} shape={"circle"} size={"large"} />
            {/*name*/}
            <h1 style={{alignSelf: "center", width: "fit-content", maxWidth: 250, textOverflow: "ellipsis",overflow: "hidden",}}>Namedddddddddddddddddddddddddddddddddddddddddd</h1>

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

            <PanelMenu model={items} className="w-full md:w-20rem" />

        </div>
    )
}
export default InfoChatGroup
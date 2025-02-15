import React, {useContext, useEffect, useRef, useState} from "react";
import {Avatar} from "primereact/avatar";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import FriendCard from "./FriendCard.tsx";
import {PanelMenu} from "primereact/panelmenu";
import useStore from "../../store/useStore.tsx";
import {ThemeContext} from "../../ThemeContext.tsx";
import {MenuItem} from "primereact/menuitem";
import apiClient from "../../utils/apiClient.tsx";
import {Toast} from "primereact/toast";

const FriendStatus = {
    Normal: 0, Prevented : 1, Obstructed :2
}
const  InfoChatDirect : React.FC<any> = ({DirectUser, Conversation, ListMembers}) =>{

    const {userId} = useStore()
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const  cardColor = currentTheme.getCard()
    const keyTheme = currentTheme.getKey()
    const textHintColor = currentTheme.getHint()
    const textColor = currentTheme.getText()

    const [imgUser, setImgUser] = useState("")
    const [nameUser, setNameUser] = useState("")
    const [oponentUser, setOponentUser] = useState({})
    const [infoUser, setInfoUser] = useState(DirectUser)
    const [items, setMenuItem] = useState([])
    const toast = useRef<Toast>(null);

    useEffect(() => {
        if(ListMembers && Conversation)
        {
            var members = Conversation.members ?? []
            var op = members.filter((i: any) => i.userId !==  userId)[0]
            setOponentUser(op ?? {})
            setImgUser(op?.imageUrl ?? "")
            setNameUser(op?.name ?? "")
            // loadInfo(op.userId ?? op.id ?? "")
        }
        if(DirectUser)
        {

            setInfoUser(DirectUser)
            changeMenu(DirectUser)
        }
    }, [Conversation, ListMembers, DirectUser]);

    const changeMenu = (User)=>{
        var newMenu = [
            {
                label: 'Media, File',
                // icon: 'pi pi-file',
                items: [
                    {
                        label: 'Media',
                        icon: 'pi pi-image',
                        command: handleShowMediaClick
                    },
                    {
                        label: 'File',
                        icon: 'pi pi-file',
                        command: handleShowFileClick
                    }
                ]
            },
            // {
            //     label: 'Customize chat',
            //     // icon: 'pi pi-cloud',
            //     items: [
            //         {
            //             label: 'Edit info',
            //             icon: <img src="/svg/text_icon.svg" alt="create" style={{width: 20, height: 20, marginRight: 5}}/>,
            //             command: handleChangeInfoClick
            //         },
            //         {
            //             label: 'View members',
            //             icon: 'pi pi-users',
            //             command: handleViewMembersClick
            //         }
            //     ]
            // },
            {
                label: 'Privacy',
                // icon: 'pi pi-desktop',
                items: [

                    {
                        label: User?.friendStatus === FriendStatus.Obstructed ? 'Obstructed' : (User?.friendStatus === FriendStatus.Prevented ? "Unblock" : "Block"),
                        icon: `pi ${User?.friendStatus === FriendStatus.Obstructed ? 'pi-times' : (User?.friendStatus === FriendStatus.Prevented ? "pi-unlock" : "pi-ban")}`,
                        command: HandleStatus
                    },
                    {
                        label: 'Report',
                        icon: 'pi pi-exclamation-triangle',
                        // command: handleReportClick
                    },
                ]
            }
        ]
        setMenuItem(newMenu)
    }

    const handleShowFileClick = () =>{

    }
    const handleShowMediaClick = () =>{

    }
    const HandleStatus =  async() =>{
        //   friendStatus == FriendStatus.Normal
        var id = infoUser?.id
        if(!id) return
        if(infoUser.friendStatus == FriendStatus.Obstructed) return
        var newInfo= infoUser ?? {}
        var rs = null

        try{
            if(infoUser.friendStatus != FriendStatus.Normal)
            {
                rs = await apiClient.delete(`/user/profile/${id}/ban`)
            }
            else{
                rs = await apiClient.post(`/user/profile/${id}/ban`)
            }
            var status = rs?.status
            if(status === 200 || status === 204)
            {
                newInfo.friendStatus = (infoUser.friendStatus == FriendStatus.Normal ? FriendStatus.Prevented : FriendStatus.Normal)
                setInfoUser(newInfo)
                changeMenu(newInfo)

            }
            else{
                toast.current?.show({severity:'error', summary: 'Error', detail:'Error when action status', life: 3000});
            }
        }
        catch (e)
        {
            console.log(e)
            toast.current?.show({severity:'error', summary: 'Error', detail:'Error when action status', life: 3000});

        }
    }

    return(
        <div style={{
            display: "flex",
            flexDirection: "column"
        }}>
            <Toast ref={toast} />

            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 10,
                marginTop: 10
            }}>

                <Avatar
                    image={imgUser}
                    style={{
                        alignSelf: "center",
                        minHeight: 70,
                        minWidth: 70
                    }} shape={"circle"} size={"large"}/>
                {/*name*/}
                <h1 style={{
                    width: "fit-content",
                    maxWidth: 250,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                }}>{nameUser}</h1>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center"
                }}>
                    <div style={{
                        marginRight: 20,
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <Button style={{margin: 0}} text icon={"pi pi-bell"}/>
                        <p style={{margin: 0}}>Notification</p>
                    </div>
                    <div style={{
                        marginRight: 10,
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <Button text icon={"pi pi-search"}/>
                        <p style={{margin: 0}}>Search</p>
                    </div>
                </div>

                <PanelMenu multiple style={{marginTop: 10, backgroundColor: "transparent", width: "100% !important"}}
                           model={items} className={`w-full md:w-20rem ${keyTheme}`}/>

            </div>
        </div>
    )
}
export default InfoChatDirect
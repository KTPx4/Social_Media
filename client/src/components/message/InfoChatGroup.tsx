import React, {useContext, useEffect, useState} from "react";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import {PanelMenu} from "primereact/panelmenu";
import {MenuItem, MenuItemCommandEvent} from "primereact/menuitem";
import {ThemeContext} from "../../ThemeContext.tsx";
import {InputText} from "primereact/inputtext";
import {Dialog} from "primereact/dialog";
import apiClient from "../../utils/apiClient.tsx";
import FriendCard from "./FriendCard.tsx";
import useStore from "../../store/useStore.tsx";

const maxSize = 10 * 1024 * 1024
const  ConversationRole=
{
    None :0, Member :1, Leader :2, Deputy : 3
}
const  InfoChatGroup  = ({ListSuggest, ConvId, Image, NameGroup, HandleCallBackInfo, ListMembers, UpdateMemberSuccess}) =>{
    const {userId} = useStore()
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const  cardColor = currentTheme.getCard()
    const keyTheme = currentTheme.getKey()
    const textHintColor = currentTheme.getHint()
    const textColor = currentTheme.getText()

    const [listSuggestFriend, setListSuggestFriend] = useState([]);

    const [listAdded , setListAdded] = useState( []);

    const [showEditInfo, setShowEditInfo] = useState(false);

    const [groupAvatar, setGroupAvatar] = useState(null); // File được chọn
    const [inputNameGroup, setInputName] = useState(NameGroup)
    const [showMember,setShowMember] = useState(false);
    const [canEdit, setCanEdit] = useState(false);

    const [confirmLeave, setConfirmOut] = useState(false);

    useEffect(() => {
        if(ConvId  && ListMembers)
        {
            var conversation = ListMembers[ConvId]
            var listMem = conversation.members ?? []

            var me  = listMem.filter(m=> m.userId === userId)[0]

            if(me.role === ConversationRole.Leader || me.role === ConversationRole.Deputy)
            {

                setCanEdit(true)
            }


            setListAdded(listMem)
        }
    }, [ConvId]);
    useEffect(() => {
        if(ListSuggest)
        {
            // var listAdd = listAdd.map(m => m.userId)
            // data= data.filter(f => !listAdd.includes(f.id))
            // data = data.map(d => {
            //     return {...d, userId: d.userId}
            // })
            var listAdd = listAdded.map(m => m.userId)
            var data= ListSuggest.filter(f => !listAdd.includes(f.id))
            data = data.map(d => {
                    return {...d, userId: d.id}
            })
            setListSuggestFriend(data)
        }
    }, [ListSuggest, listAdded]);

    const handleShowFileClick = () =>{
        HandleCallBackInfo("file")
    }
    const handleShowMediaClick = () =>{
        HandleCallBackInfo("media")
    }

    const handleChangeInfoClick = ()=>{
        setShowEditInfo(true)
    }
    const handleViewMembersClick = ()=>{
        // HandleCallBackInfo("members")

        setShowMember(true)

    }
    const handleReportClick = ()=>{
        HandleCallBackInfo("report")

    }
    const handleLeaveClick = async()=>{
        try{
            var rs = await apiClient.post(`/chat/conversation/${ConvId}/leave`)
            var status = rs.status
            if(status === 200 || status === 204)
            {
                HandleCallBackInfo("leave", ConvId)
            }
        }
        catch (e)
        {
            alert("Error when leave group. Try again!")
            console.log(e)
        }
        setConfirmOut(false)

        // HandleCallBackInfo("leave")
    }

    const HandleChangeInfos = async () =>{
        if(!inputNameGroup || !inputNameGroup.trim())
        {
            alert("Please input name");
        }
        const formData = new FormData();
        formData.append('Name', inputNameGroup.trim());

        if(groupAvatar)
        {
            formData.append('Image', groupAvatar);
        }
        try{
            var rs = await apiClient.put(`/chat/conversation/${ConvId}/info`, formData)
            var status = rs.status
            if(status === 200 || status === 204)
            {
                var newConv = rs.data.data
                setShowEditInfo(false)
                HandleCallBackInfo("info", newConv)

            }
        }
        catch(error){

        }
    }


    const items: MenuItem[] = [
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
        {
            label: 'Customize chat',
            // icon: 'pi pi-cloud',
            items: [
                {
                    label: 'Edit info',
                    icon: <img src="/svg/text_icon.svg" alt="create" style={{width: 20, height: 20, marginRight: 5}}/>,
                    command: handleChangeInfoClick
                },
                {
                    label: 'View members',
                    icon: 'pi pi-users',
                    command: handleViewMembersClick
                }
            ]
        },
        {
            label: 'Privacy',
            // icon: 'pi pi-desktop',
            items: [
                {
                    label: 'Report',
                    icon: 'pi pi-exclamation-triangle',
                    command: handleReportClick
                },
                {
                    label: 'Leave',
                    icon: 'pi pi-sign-out',
                    command:  ()=>setConfirmOut(true)
                }
            ]
        }
    ];

    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

            if (!allowedTypes.includes(file.type)) {
                alert("Only access image (JPEG, PNG, GIF, WEBP)!");
                return;
            }

            if (file.size > maxSize) {
                alert("Image must less than 10mb");
                return;
            }

            setGroupAvatar(file);
        }
    };

    const HandleAddFriend = (Friend, isAdd) =>{
        if(isAdd) // remove members
        {
            setListSuggestFriend(prev=> [...prev, Friend]);
            setListAdded((prev) => prev.filter(f=> f.userId !== Friend.userId))
        }
        else{  // ADD to members
            setListAdded(prev => [...prev, Friend])
            setListSuggestFriend( (prev) => prev.filter((f)=>f.userId !== Friend.userId))
        }
    }
    const SaveEditMembers = async() =>{
        try{
            const formData = new FormData();
            listAdded.map((f) => {
                formData.append("Members", f.userId)
            })

            const rs = await apiClient.put(`/chat/conversation/${ConvId}/members`, formData);

            var status = rs.status

            if(status === 200 || status === 204)
            {
                setShowMember(false)
                var data = rs.data.data
                UpdateMemberSuccess(data)
            }
        }
        catch (e)
        {
            console.log(e)
        }

    }
    return(
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems:"center",
            padding: 10,
            marginTop: 10
        }}>
            <Dialog header={"Leave group"} className={keyTheme} visible={confirmLeave} onHide={()=> setConfirmOut(false)}>
                <div style={{
                    width: 200
                }}>
                    <h2>Do you want leave group?</h2>
                    <div style={{width: "100%", display:"flex", justifyContent:"center"}}>
                        <Button onClick={handleLeaveClick} text severity={"danger"} label={"Yes"}/>
                        <Button onClick={()=> setConfirmOut(false)} text severity={"secondary"} label={"Cancel"}/>
                    </div>
                </div>
            </Dialog>
            <Dialog
                className={keyTheme}
                visible={showEditInfo} onHide={()=>setShowEditInfo(false)}
                header={"Edit info"}
            >
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 300

                }}>
                    <div>
                        <input className="file-input" type="file" accept="image/jpg,image/jpeg,image/png"
                               onChange={handleAvatarChange}/>

                        {!groupAvatar && (
                            <Avatar
                                image={Image}
                                onClick={() => document.querySelector('.file-input')?.click()}
                                style={{
                                    width: 60,
                                    height: 60
                                }}
                                shape={"circle"} size={"large"}/>
                        )}
                    </div>
                    {groupAvatar && (
                        <div className="avatar-preview">
                            <Avatar
                                shape={"circle"}
                                onClick={() => document.querySelector('.file-input')?.click()}
                                image={URL.createObjectURL(groupAvatar)}
                                title="Group Avatar Preview"
                                style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%'}}
                            />
                        </div>
                    )}
                    <InputText
                        placeholder={"Enter group name"}
                        maxLength={20}
                        style={{
                            margin:"10px 0",
                            width: "100%",
                            textAlign: "center",
                            backgroundColor:"transparent",
                            border: "none",
                            boxShadow:"none",
                            color: textColor,
                        }}
                        value={inputNameGroup}
                        onChange={(e) => setInputName(e.target.value)}
                    />

                    <Button onClick={HandleChangeInfos} style={{marginTop: 10}} outlined rounded label={"Save"}/>
                </div>
            </Dialog>

            <Dialog
                className={keyTheme}
                visible={showMember} onHide={()=>setShowMember(false)}
                header={"Edit info"}
                >
                {/*list friend*/}

                <div  style={{
                    width: 400,
                    height: 300,
                    display: "flex",
                    flexDirection: "row"
                }}>
                    {/*suggest*/}
                    {canEdit && (
                            <div style={{
                                width: "50%",
                                overflow: "auto",
                                display: "flex",
                                flexDirection: "column",
                                padding: 10
                            }}>
                                <h2>Suggest</h2>
                                <div style={{overflow: "auto"}}>
                                    {listSuggestFriend?.map((f) => {
                                        return (
                                            <FriendCard canRemove={canEdit} isAdd={false} key={f.userId} Friend={f}
                                                        Name={f.name} Profile={f.userProfile} Image={f.imageUrl}
                                                        ClickAdd={HandleAddFriend}/>
                                        )
                                    })}
                                </div>
                            </div>
                        )

                    }


                    {/*list added*/}
                    <div style={{
                        width: canEdit ? "50%" : "100%",
                        display: "flex",
                        flexDirection: "column",
                        padding: 10
                    }}>
                        <h2>Members</h2>
                        <div style={{overflow: "auto"}}>
                            {listAdded && listAdded.map((f) => {

                                var role = f.role === ConversationRole.Leader ? "Leader" :
                                    (f.role === ConversationRole.Deputy ? "Deputy" : "Member")
                                return (
                                    <FriendCard Role={role} canRemove={canEdit} isAdd={true} key={f.userId} Friend={f} Name={f.name} Profile={f.userProfile} Image={f.imageUrl}
                                                ClickAdd={HandleAddFriend}/>
                                    )
                            }
                        )}
                        </div>
                    </div>
                </div>
                <div style={{
                    display:"flex",
                    flexDirection:"row-reverse"
                }}>
                    <Button onClick={SaveEditMembers} label={"Save"} text severity={"info"} outlined/>
                </div>
            </Dialog>

           <Avatar
                image={Image}
                style={{
                alignSelf: "center",
                minHeight: 70,
                minWidth: 70
            }} shape={"circle"} size={"large"} />
            {/*name*/}
            <h1 style={{  width: "fit-content", maxWidth: 250, textOverflow: "ellipsis",overflow: "hidden",}}>{NameGroup}</h1>

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

            <PanelMenu multiple style={{marginTop: 10, backgroundColor: "transparent", width: "100% !important"}} model={items} className={`w-full md:w-20rem ${keyTheme}`} />

        </div>
    )
}
export default InfoChatGroup
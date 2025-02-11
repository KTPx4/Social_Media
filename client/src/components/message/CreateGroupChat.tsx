import React, {useState, useEffect, useContext} from 'react';
import {Dialog} from "primereact/dialog";
import {ThemeContext} from "../../ThemeContext.tsx";
import {Avatar} from "primereact/avatar";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import apiClient from "../../utils/apiClient.tsx";
import FriendCard from "./FriendCard.tsx";
import {ProgressSpinner} from "primereact/progressspinner";

const CreateGroupChat : React.FC<any> = ({isShow, setIsShow, CreateSuccessCall}) => {

    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const keyTheme = currentTheme.getKey()
    const  cardColor = currentTheme.getCard()
    const borderColor = currentTheme.getBorder()
    const textColor = currentTheme.getText()

    // State cho thông tin nhóm chat
    const [groupName, setGroupName] = useState('');
    const [groupAvatar, setGroupAvatar] = useState(null); // File được chọn

    const [listSuggestFriend, setListSuggestFriend] = useState([]);
    const [listAdded , setListAdded] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        loadListFriend()
    }, []);

    const loadListFriend = async() =>{
        try{
            var rs = await  apiClient.get("/user/friends?page=1")
            var statusCode = rs.status
            if(statusCode === 200)
            {
                var data = rs.data.data
                setListSuggestFriend(data)
            }
        }
        catch (e)
        {
            console.log(e)
        }
    }

    // Xử lý chọn file avatar nhóm
    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setGroupAvatar(e.target.files[0]);
        }
    };

    // Xử lý submit form để tạo group chat
    const handleSubmit = async(e) => {
        e.preventDefault();

        // Kiểm tra các thông tin cần thiết
        if (!groupName.trim()) {
            alert("Please enter a group name");
            return;
        }
        if (!groupAvatar) {
            alert("Please upload a group avatar");
            return;
        }
        if(listAdded.length < 1)
        {
            alert("Please add members");
            return;
        }

        // Tạo FormData để gửi file và các trường khác lên API
        const formData = new FormData();
        formData.append('Name', groupName);
        formData.append('Image', groupAvatar);
        listAdded.map((f) => {
            formData.append("Members", f.id)
        })
        // Lưu danh sách thành viên dưới dạng JSON (chỉ gửi các id)

        try {
            const rs = await apiClient.post('/chat/group', formData);
            console.log(rs)
            var status = rs.status
            if(status === 200)
            {
                var newConv = rs.data.data
                CreateSuccessCall(newConv)
                setIsShow(false)
            }
            else{
                alert("Cant create group. Try again!")
            }
        } catch (error) {
            console.error('Error creating group chat:', error);
            alert('Error creating group chat');
        }
    };

    const HandleAddFriend = (Friend, isAdd) =>{
        if(isAdd) // remove members
        {
            setListSuggestFriend(prev=> [...prev, Friend]);
            setListAdded((prev) => prev.filter(f=> f.id !== Friend.id))
        }
        else{  // ADD to members
            setListAdded(prev => [...prev, Friend])
            setListSuggestFriend( (prev) => prev.filter((f)=>f.id !== Friend.id))
        }
    }

    return (
        <Dialog
            className={keyTheme}
            header={"Create group"}
            visible={isShow}
            onHide={() => setIsShow(false)}>
            <div className="create-group-chat">
                <form onSubmit={handleSubmit}>
                    {/* Upload Avatar */}
                    <div className="form-group" style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems:"center",
                        width: "100%",
                        marginBottom: 10
                    }}>
                            <div>
                                <input className="file-input" type="file" accept="image/jpg,image/jpeg,image/png"
                                       onChange={handleAvatarChange}/>

                            {!groupAvatar && (
                                <Avatar onClick={() => document.querySelector('.file-input')?.click()}
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
                    </div>

                    {/* Nhập tên nhóm */}
                    <div className="form-group">

                        <InputText
                            placeholder={"Enter group name"}
                            maxLength={20}
                            style={{
                                width: "100%",
                                backgroundColor:"transparent",
                                border: "none",
                                boxShadow:"none",
                                color: textColor,
                                textAlign: "center",
                            }}
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}

                            required
                        />
                    </div>

                    {/*list friend*/}

                    <div  style={{
                        width: 400,
                        height: 300,
                        display: "flex",
                        flexDirection: "row"
                    }}>
                        {/*suggest*/}
                        <div style={{
                            width: "50%",
                            overflow: "auto",
                            display: "flex",
                            flexDirection: "column",
                            padding: 10
                        }}>
                            <h2>Suggest</h2>
                            <div style={{overflow: "auto"}}>
                                {listSuggestFriend.map((f) => (
                                    <FriendCard isAdd={false} key={f.id} Friend={f} Name={f.name} Profile={f.userProfile} Image={f.imageUrl}
                                                ClickAdd={HandleAddFriend}/>
                                ))}
                            </div>
                        </div>

                        {/*list added*/}
                        <div style={{
                            width: "50%",
                            display: "flex",
                            flexDirection: "column",
                            padding: 10
                        }}>
                            <h2>Members</h2>
                            <div style={{overflow: "auto"}}>
                                {listAdded.map((f) => (
                                    <FriendCard isAdd={true} key={f.id} Friend={f} Name={f.name} Profile={f.userProfile} Image={f.imageUrl}
                                                ClickAdd={HandleAddFriend}/>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="form-group" style={{
                        width: "100%",
                        display:"flex",
                        justifyContent: "center"
                    }}>
                        {!isLoading && (
                            <Button outlined severity={"secondary"}  type="submit">Create</Button>
                        )}
                        {isLoading && (
                            <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="4" fill="transparent"
                                             animationDuration=".5s"/>
                        )}
                    </div>
                </form>
            </div>
        </Dialog>
    );
};

export default CreateGroupChat;

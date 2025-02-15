import React, {useContext, useEffect, useRef, useState} from "react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";

// @ts-ignore
import { Galleria } from "primereact/galleria";
import { InputText } from "primereact/inputtext";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {ThemeContext} from "../../ThemeContext.tsx";
import {TieredMenu} from "primereact/tieredmenu"; // Import cả font-weight mặc định của Roboto
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import {Toast} from "primereact/toast";
import apiClient from "../../utils/apiClient.tsx";
import useStore from "../../store/useStore.tsx";
import {convertToHoChiMinhTime, toHCMTime} from "../../utils/Convertor.tsx";
import EditPostModal from "./EditPostModal.tsx";
import HistoryUpdate from "./HistoryUpdate.tsx";
import historyUpdate from "./HistoryUpdate.tsx";
import {Image} from "primereact/image";
import {Dialog} from "primereact/dialog";
import {Dropdown} from "primereact/dropdown";
import {useNavigate} from "react-router-dom";
interface PostCardProps {
    post: any,
    isHideComment: boolean,
    isShare: boolean
}
const PostType = {
    Post: 0,
    Share: 1
}

const PostCard: React.FC<PostCardProps> = ({post, isHideComment= false, isShare= false}) => {
    // @ts-ignore
    const [Post, setPost] = useState(post)
    const {userId, setId, myAccount} = useStore()
    const navigate = useNavigate()
    // var {id ,authorId,  createdAt, authorProfile, authorImg, content, listMedia} = Post


    //
    const [isLike, setIsLike] = useState<boolean>(post?.isLike ?? false);
    const [isSave, setIsSave] = useState<boolean>(post?.isSave?? false);
    const [countLike, setCountLike]= useState<number>(post?.sumLike?? 0)
    const [countComment, setCountComment]= useState<number>(post?.sumComment ?? 0)

    {/*<PostCard
    isHideComment={true}*/}


    const [isExpanded, setIsExpanded] = useState(false);
    const toast = useRef<Toast>(null);

    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const textColor = currentTheme.getText()
    const textHintColor = currentTheme.getHint()
    const captionColor = currentTheme.getCaption()
    const keyTheme = currentTheme.getKey()
    const borderColor = currentTheme.getBorder()
    const cardColor = currentTheme.getCard()

    var token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";

    const [listInfoMedia, setListInfoMedia] = useState([])

    const cachedBlobs = useRef<Record<number, string>>({}); // Lưu blob URLs của media
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // Trạng thái tải media
    const [isWaitRequest, setIsWaitRequest] = useState(false); // Trạng thái tải media
    const [parentVisible, setParentVisible] = useState(false);
    const [visibleHistory, setVisibleHistory] = useState(false);
    const [listPostHistory, setHistory] = useState([])

    const [visible, setVisible] = useState(false);
    const [inputShareCaption, setInputShareCaption] = useState("")
    const listStatus = [
        { name: 'Public', code: '0' },
        { name: 'Private', code: '1' },
        { name: 'Friend', code: '2' }
    ];
    const [selectStatus, setSelectStatus] = useState(listStatus[0]);

    const [postShare, setPostShare] = useState(null)

    useEffect(() => {
        const loadPostShare = async (shareId) =>{
            console.log("run")
            try{
                var rs = await  apiClient.get(`/post/${shareId}`)
                console.log("rsrun:", rs)
                var statusCode = rs.status
                if(statusCode === 200)
                {
                    var data = rs.data.data
                    setPostShare(data)
                }
            }
            catch(e)
            {
                console.log(e)
            }
        }
        if(Post)
        {
            setListInfoMedia(Post.listMedia.map((media: { mediaUrl: any; contentType: any; isDeleted: any;}) =>  {
                return {mediaUrl: media.mediaUrl + token, contentType: media.contentType, isDeleted: media.isDeleted}
            }))
            if(Post.type == PostType.Share && Post.postShareId)
            {
                console.log("--", Post.postShareId)
                loadPostShare(Post.postShareId)
            }
        }
    }, [Post]);

    // @ts-ignore
    const isOwn = Post?.authorId === userId

    const menu = useRef(null);
    var items = []

    if(Post?.sumEdit > 0 )
    {
        items = [...items, {
            label: 'View history edit',
            icon: 'pi pi-history',
            command: () =>{
                loadHistory()
            }
        }]
    }

    items = [ ...items,
        !isOwn ? {
            label: 'Report',
            icon: 'pi pi-exclamation-triangle',
            command: () =>{

            }
        } : {
            label: 'Edit',
            icon: 'pi pi-pen-to-square',
            command: () =>{
                setModalVisible(true)
            }
        },
    ];

    if(Post?.authorId === userId)
    {
        items = [...items, {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () =>{
                deletePost()
            }
        }]
    }
    /// navigate profile

////// load history
    const loadHistory = async() =>{
        try{
            var rs = await  apiClient.get(`/post/${Post?.id}/history`)
            console.log("history:",rs)
            var statusCode = rs.status
            if(statusCode === 200)
            {
                var data = rs.data.data
                setHistory(data)
                setVisibleHistory(true)
            }
        }
        catch(e)
        {
            console.log(e)
        }
    }

///////////////delete post
    const handleParentAccept = async () => {
        console.log("Parent accepted");
        var rs = await apiClient.delete(`/post/${Post.id}`)
        var statusCode = rs.status
        if(statusCode == 200)
        {
            toast.current?.show({ severity: 'success', summary: 'Delete', detail: 'Delete post success!', life: 3000 });
            setTimeout(()=>{
                window.location.href = "/home";
            }, 500)
        }
        else{
            var mess = rs.data?.message || "Delete failed"
            toast.current?.show({ severity: 'error', summary: 'Delete', detail: mess, life: 3000 });
        }
        setParentVisible(false);
    };

    const deletePost = () =>{
        console.log("postid-:",Post.id)
        setParentVisible(true);

    }

    const toProfile = ()=>{
        if(Post.authorProfile === myAccount.userProfile)
        {
            navigate(`/home/profile`)
        }
        else{
            navigate(`/home/profile/${Post.authorProfile}`)
        }
    }

//////////////// like/unlike post
    const actionPost = async( ) =>{
        if(isWaitRequest)
        {
            return;
        }
        setIsWaitRequest(true)
        setCountLike(countLike + (isLike ? -1 : + 1) ) // before click like button
        setIsLike(!isLike)

    }
    useEffect(() => {
        if(!isWaitRequest) return;
        const actionToPost = async()=>{
            var rs = null
            try{
                if(isLike)
                {
                    rs = await apiClient.post(`/post/${Post.id}/like`)
                }else{
                    rs = await apiClient.post(`/post/${Post.id}/unlike`)
                }
                setIsWaitRequest(false);
                var statusCode = rs.status
                if( statusCode === 200 || statusCode === 204)
                {
                    // toast.current?.show({ severity: 'success', summary: `${isLike ? "Like" : "Unlike"} post`, detail: `You has been like post`, life: 3000 });
                }
            }
            catch (e)
            {
                setIsWaitRequest(false);
                setCountLike(countLike + (!isLike ? +1 : -1) )    // restore state change before click button  if err
                setIsLike(!isLike)
                toast.current?.show({ severity: 'error', summary: `${isLike ? "Like" : "Unlike"} post`, detail: 'Error when action post', life: 3000 });
                console.log("error when send action post" , e)
            }

        }
        actionToPost()
    }, [isLike, isWaitRequest]);

//////////////// save
    useEffect(() => {
        if(!isWaitRequest) return;
        const actionToPost = async()=>{
            var rs = null
            try{
                if(isSave)
                {
                    rs = await apiClient.post(`/post/${Post.id}/save`)
                }else{
                    rs = await apiClient.post(`/post/${Post.id}/unsave`)
                }
                setIsWaitRequest(false);
                var statusCode = rs.status
                if( statusCode === 200 || statusCode === 204)
                {
                    // toast.current?.show({ severity: 'success', summary: `${isLike ? "Like" : "Unlike"} post`, detail: `You has been like post`, life: 3000 });
                }
            }
            catch (e)
            {
                setIsWaitRequest(false);
                setIsSave(!isSave)
                toast.current?.show({ severity: 'error', summary: `${isLike ? "Save" : "UnSave"} post`, detail: 'Error when action post', life: 3000 });
                console.log("error when send action post" , e)
            }

        }
        actionToPost()
    }, [isSave, isWaitRequest]);
    const savePost = async() =>{
        if(isWaitRequest)
        {
            return;
        }
        setIsWaitRequest(true)
        // setCountLike(countLike + (isLike ? -1 : + 1) ) // before click like button
        setIsSave(!isSave)
    }
////////////////send
    const sharePost = async()=>{
        try{
            var body ={
                Content: inputShareCaption,
                Status: selectStatus
            }
            var rs = await  apiClient.post(`/post/${Post.id}/share`, body)
            var status = rs.status
            if(status === 200)
            {
                toast.current?.show({ severity: 'info', summary: 'Info', detail: 'Share success' });
            }
        }
        catch(e)
        {
            console.log(e)
        }
    }
//////////////// open modal
    const openModalPost = async()=>{

    }
/////// edit post
    const [modalVisible, setModalVisible] = useState(false);



    const handleSave = async (formData: any) => {
        try{
            var rs = await apiClient.put(`/post/${Post.id}`, formData)
            console.log(rs)
            var statusCode = rs.status
            if(statusCode === 200 )
            {
                var data = rs.data.data
                toast.current?.show({ severity: 'success', summary: 'Edit post success' })
                setPost((prev : any) => {
                    return {...prev, content: data.content, listMedia: data.listMedia, status: data.status}
                })
            }

        }
        catch (e)
        {
            console.log(e)
        }
        setModalVisible(false)
    };

    const toggleCaption = () => {
        setIsExpanded(!isExpanded);
    };

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % listInfoMedia.length);
        setIsLoading(true); // Đặt lại trạng thái loading khi chuyển sang media khác
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + listInfoMedia.length) % listInfoMedia.length);
        setIsLoading(true); // Đặt lại trạng thái loading khi chuyển sang media khác
    };

    // @ts-ignore
    var InputComponent = <></>
    var ButtonComment= <></>

    if(!isHideComment)
    {
        ButtonComment = (<>
            <Button onClick={openModalPost} icon="pi pi-comment" className="p-button-rounded p-button-text"/>
        </>)
        InputComponent =
            (
                <IconField>
                    <InputText placeholder="Add a comment..." className="input-comment p-inputtext-sm p-mr-2 border-none border-bottom-1"
                                             style={{backgroundColor: "transparent", width: "100%", color: textHintColor}}/>
                    <InputIcon className="pi pi-check" onClick={()=>{}}/>
                </IconField>
            )
    }

    const handleMediaLoad = (index: number, blobUrl: string) => {
        cachedBlobs.current[index] = blobUrl; // Lưu blob URL vào cache
        setIsLoading(false);
    };

    // Render media (ảnh hoặc video)
    const renderMedia = () => {
        const media = listInfoMedia[currentIndex];
        // console.log("MediaL ", media)
        if(media && media.isDeleted) {
            return (
                <div
                    style={{
                        padding: 50,
                        height: "150px",
                        backgroundColor: "grey",
                        maxWidth: 500,
                        objectFit: "cover",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <p style={{color: "white"}}>This image can not display!</p>

                </div>
            )
        }
        if (media && cachedBlobs.current[currentIndex]) {
            if (media?.contentType.startsWith("image")) {
                return (
                    <Image
                        preview
                        src={cachedBlobs.current[currentIndex]}
                        alt={`Post Image ${currentIndex + 1}`}
                        style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: 500,
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                );
            } else {
                return (
                    <video
                        style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: 500,
                            objectFit: "cover",
                        }}
                        controls
                        autoPlay
                        muted
                    >
                        <source src={cachedBlobs.current[currentIndex]} type={media?.contentType} />
                    </video>
                );
            }
        } else {
            const fetchBlob = async () => {
                try {
                    const response = await fetch(media.mediaUrl);
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    handleMediaLoad(currentIndex, blobUrl);
                } catch (error) {
                    // console.error("Error loading media:", error);
                }
            };
            fetchBlob();

            return (
                <div
                    style={{
                        width: "400px",
                        height: "200px",
                        backgroundColor: "grey",
                        maxWidth: 500,
                        objectFit: "cover",
                        display: "block",
                    }}
                />
            );
        }
    };
    if(post?.type == PostType.Share && post.postShareId && !postShare) return <></>
    if(post?.type == PostType.Share)
    {
        return (
            <>
                <HistoryUpdate toast={toast} listPost={listPostHistory} visible={visibleHistory}
                               onHide={() => setVisibleHistory(false)}/>
                <EditPostModal
                    isShare={true}
                    visible={modalVisible}
                    onHide={() => setModalVisible(false)}
                    post={Post}
                    onSave={handleSave}
                    toast={toast}
                />
                <ConfirmDialog
                    className={keyTheme}
                    visible={parentVisible}
                    onHide={() => setParentVisible(false)}
                    message="Are you sure???"
                    header="Delete Post?"
                    icon="pi pi-exclamation-triangle"
                    accept={handleParentAccept}
                />
                <Toast ref={toast}/>

                <div className="p-card p-mb-3 p-shadow-4" style={{
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    width: "100%",
                    maxWidth: "500px",
                    padding: 10,
                    marginTop: 10
                }}>
                    {/* Header */}
                    <div className="post-header mx-2 my-3">
                        <div className="post-header-profile">
                            <Avatar onClick={toProfile} image={Post.authorImg} size="large" shape="circle" className="p-mr-2"/>
                            <div style={{marginLeft: 5}}>
                                <small onClick={toProfile} className="p-m-0 font-bold"
                                       style={{color: textColor}}>{Post.authorProfile}</small>
                                <br></br>
                                <small title={toHCMTime(Post.createdAt)} className="p-text-secondary" style={{
                                    fontSize: 12,
                                    color: textHintColor
                                }}>{convertToHoChiMinhTime(Post.createdAt) + " ago"}</small>
                            </div>
                        </div>
                        <TieredMenu model={items} popup ref={menu} breakpoint="767px"/>
                        <Button icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text"
                                style={{color: textColor}}
                            // @ts-ignore
                                onClick={(e) => menu.current.toggle(e)}
                        />
                    </div>

                    {/* Caption */}
                    <div className="p-px-3 p-pb-2">
                        <p
                            style={{
                                whiteSpace: isExpanded ? "normal" : "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                marginBottom: "5px",
                                color: captionColor
                            }}
                        >

                            {Post.content}
                        </p>
                        {Post.content.length > 50 && (
                            <button
                                onClick={toggleCaption}
                                style={{
                                    margin: 3,
                                    padding: 0,
                                    border: "none",
                                    background: "transparent",
                                    color: textHintColor,
                                    cursor: "pointer",
                                    fontSize: "14px",
                                }}
                            >
                                {isExpanded ? "hide" : "more"}
                            </button>
                        )}
                    </div>

                    {/*Content post share*/}
                    <div style={{

                        borderRadius: 10,
                        border: `1px solid ${borderColor}`
                    }}>
                        {!post.postShareId && (
                            <p style={{padding: 10}}>
                                This post not exists
                            </p>
                        )}
                        {post.postShareId !== null &&(
                            <PostCard isShare={true}  post={postShare} isHideComment={true}/>
                        )}
                    </div>

                    {/*Info*/}
                    <div>
                        <p style={{
                            color: textHintColor,
                            fontSize: 12,
                            fontStyle: "italic"
                        }}>{countLike} likes, {countComment} comments</p>
                    </div>
                    {/* Actions */}
                    <div className="p-d-flex p-ai-center p-jc-between p-p-3">
                        <div>
                            <Button onClick={actionPost} title={isLike ? "Unlike" : "Like"}
                                    icon={`pi ${isLike ? "pi-heart-fill" : "pi-heart"} `}
                                    className="p-button-rounded p-button-text p-mr-2"/>
                            {ButtonComment}


                            <Button onClick={savePost} title={"Save"}
                                    icon={`pi ${isSave ? "pi-bookmark-fill" : "pi-bookmark"}`}
                                    className="p-button-rounded p-button-text"/>
                        </div>
                        {InputComponent}

                    </div>
                </div>
            </>
        )
    } else {

        return (
            <HelmetProvider>
                <Helmet>
                    <link rel="stylesheet" href="/css/component/PostCard.css"/>
                </Helmet>
                {/* Modal Confirm */}

                <div>
                    <Dialog
                        className={keyTheme}
                        header="Share"
                        visible={visible}
                        onHide={() => setVisible(false)}
                        style={{width: "350px"}}
                        footer={
                            <div>
                                {/*<Button label="" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text"/>*/}
                                <Button
                                    label="share"
                                    icon="pi pi-share-alt"
                                    onClick={sharePost}
                                    autoFocus
                                />
                            </div>
                        }
                    >
                        <div style={{marginTop: 5}}>
                            <Dropdown style={{
                                background: cardColor,
                                border: `1px solid ${borderColor}`,
                                maxWidth: 125,
                                marginBottom: 10
                            }} value={selectStatus} onChange={(e) => setSelectStatus(e.value)} options={listStatus}
                                      optionLabel="name"
                                      placeholder="Select status post" className="w-full md:w-14rem"/>

                            <InputText onChange={(e) => setInputShareCaption(e.target.value)} style={{
                                width: "100%",
                                border: "none",
                                background: "transparent",
                                boxShadow: "none",
                                color: textHintColor
                            }} placeholder={"Write caption..."}/>

                        </div>
                    </Dialog>
                </div>
                <HistoryUpdate toast={toast} listPost={listPostHistory} visible={visibleHistory}
                               onHide={() => setVisibleHistory(false)}/>
                <EditPostModal
                    visible={modalVisible}
                    onHide={() => setModalVisible(false)}
                    post={Post}
                    onSave={handleSave}
                    toast={toast}
                />
                <ConfirmDialog
                    className={keyTheme}
                    visible={parentVisible}
                    onHide={() => setParentVisible(false)}
                    message="Are you sure???"
                    header="Delete Post?"
                    icon="pi pi-exclamation-triangle"
                    accept={handleParentAccept}
                />
                <Toast ref={toast}/>
                <div className="p-card p-mb-3 p-shadow-4" style={{
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    width: "100%",
                    maxWidth: "500px",
                    padding: 10,
                    marginTop: 10
                }}>
                    {/* Header */}
                    <div className="post-header mx-2 my-3">
                        <div className="post-header-profile">


                            <Avatar onClick={toProfile} image={Post?.authorImg} size="large" shape="circle" className="p-mr-2"/>
                            <div style={{marginLeft: 5}}>
                                <small onClick={toProfile} className="p-m-0 font-bold"
                                       style={{color: textColor}}>{Post?.authorProfile ?? ""}</small>
                                <br></br>
                                <small title={toHCMTime(Post?.createdAt)} className="p-text-secondary" style={{
                                    fontSize: 12,
                                    color: textHintColor
                                }}>{convertToHoChiMinhTime(Post?.createdAt) + " ago"}</small>
                            </div>
                        </div>
                        <TieredMenu model={items} popup ref={menu} breakpoint="767px"/>
                        <Button icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text"
                                style={{color: textColor}}
                            // @ts-ignore
                                onClick={(e) => menu.current.toggle(e)}
                        />
                    </div>

                    {/* Caption */}
                    <div className="p-px-3 p-pb-2">
                        <p
                            style={{
                                whiteSpace: isExpanded ? "normal" : "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                marginBottom: "5px",
                                color: captionColor
                            }}
                        >

                            {Post?.content}
                        </p>
                        {Post?.content?.length > 50 && (
                            <button
                                onClick={toggleCaption}
                                style={{
                                    margin: 3,
                                    padding: 0,
                                    border: "none",
                                    background: "transparent",
                                    color: textHintColor,
                                    cursor: "pointer",
                                    fontSize: "14px",
                                }}
                            >
                                {isExpanded ? "hide" : "more"}
                            </button>
                        )}
                    </div>

                    {/*Image*/}
                    <div style={{position: "relative", width: "100%", maxWidth: "500px"}}>
                        {/* Image */}
                        {renderMedia()}

                        {/* Previous Button */}
                        {listInfoMedia.length > 1 &&
                            <button
                                onClick={prevImage}
                                style={{
                                    position: "absolute",
                                    left: "5px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    zIndex: 10,
                                    background: "transparent",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50%",
                                    padding: "0.5rem",
                                    cursor: "pointer",
                                }}
                            >
                                <i className="pi pi-angle-left" style={{fontSize: "1.5rem"}}></i>
                            </button>
                        }
                        {/* Next Button */}
                        {listInfoMedia.length > 1 &&
                            <button
                                onClick={nextImage}
                                style={{
                                    position: "absolute",
                                    right: "5px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    zIndex: 10,
                                    background: "transparent",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50%",
                                    padding: "0.5rem",
                                    cursor: "pointer",
                                }}
                            >
                            <i className="pi pi-angle-right" style={{fontSize: "1.5rem"}}></i>
                            </button>
                        }

                        {/* Indicators */}
                        {listInfoMedia.length > 1 &&
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "10px",
                                    width: "100%",
                                    textAlign: "center",
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                }}
                            >
                                {/*@ts-ignore*/}
                                {listInfoMedia.map((_, index) => (
                                    <span
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        style={{
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50%",
                                            backgroundColor: currentIndex === index ? "white" : "rgba(255, 255, 255, 0.5)",
                                            cursor: "pointer",
                                            transition: "background-color 0.3s",
                                        }}
                                    ></span>
                                ))}
                            </div>
                        }
                    </div>

                    {/*Info*/}
                    {!isShare && (
                        <>
                            <div>
                                <p style={{color: textHintColor, fontSize: 12, fontStyle: "italic"}}>{countLike} likes, {countComment} comments</p>
                            </div>
                            {/* Actions */}
                            <div className="p-d-flex p-ai-center p-jc-between p-p-3">
                                <div>
                                    <Button onClick={actionPost} title={isLike ? "Unlike" : "Like"} icon={`pi ${isLike ?  "pi-heart-fill" : "pi-heart" } `} className="p-button-rounded p-button-text p-mr-2"/>
                                    {ButtonComment}
                                    <Button onClick={()=> setVisible(true)} icon="pi pi-share-alt" className="p-button-rounded p-button-text"/>
                                    <Button onClick={savePost} title={"Save"} icon={`pi ${isSave ? "pi-bookmark-fill" : "pi-bookmark"}`} className="p-button-rounded p-button-text"/>
                                </div>
                                        {InputComponent}

                            </div>
                        </>
                    )}
                </div>
            </HelmetProvider>
        );
    }
};

export default PostCard;

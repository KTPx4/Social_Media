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
import convertToHoChiMinhTime from "../../utils/Convertor.tsx"
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import {Toast} from "primereact/toast";
import apiClient from "../../utils/apiClient.tsx";
import useStore from "../../store/useStore.tsx";
interface PostCardProps {
    Post: any,
    isHideComment: boolean
}


const PostCard: React.FC<PostCardProps> = ({Post, isHideComment= false}) => {
    // @ts-ignore
    const {userId, setId} = useStore()
    var {id ,authorId,  createdAt, authorProfile, authorImg, content, listMedia} = Post
    var postId = id,  username = authorProfile, avatar = authorImg, caption = content, medias = listMedia
    const [isLike, setIsLike] = useState<boolean>(Post.isLike);
    const [isSave, setIsSave] = useState<boolean>(Post.isSave);
    const [countLike, setCountLike]= useState<number>(Post.sumLike)
    const [countComment, setCountComment]= useState<number>(Post.sumComment)

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

    var token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";

    const listInfoMedia = medias.map((media: { mediaUrl: any; contentType: any; }) =>  {
        return {mediaUrl: media.mediaUrl + token, contentType: media.contentType}
    })

    const cachedBlobs = useRef<Record<number, string>>({}); // Lưu blob URLs của media
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // Trạng thái tải media
    const [isWaitRequest, setIsWaitRequest] = useState(false); // Trạng thái tải media

    // @ts-ignore
    const isOwn = authorId === userId

    const menu = useRef(null);
    var items = [
        !isOwn ? {
            label: 'Report',
            icon: 'pi pi-exclamation-triangle',
            command: () =>{

            }
        } : {
            label: 'Edit',
            icon: 'pi pi-pen-to-square',
            command: () =>{

            }
        },
    ];

    if(authorId === userId)
    {
        items = [...items, {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () =>{
                deletePost()
            }
        }]
    }
    createdAt = convertToHoChiMinhTime(createdAt) + " ago"

///////////////delete post
    const deletePost = () =>{
        console.log("postid-:",postId)
        confirmDelete()
    }
    const confirmDelete = () => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept
        });
    };

    const accept = async () => {
        var rs = await apiClient.delete(`/post/${postId}`)
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
    const sendPostToMess = async()=>{

    }
//////////////// open modal
    const openModalPost = async()=>{

    }


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
        if (cachedBlobs.current[currentIndex]) {
            if (media.contentType.startsWith("image")) {
                return (
                    <img
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
                        <source src={cachedBlobs.current[currentIndex]} type={media.contentType} />
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
                    console.error("Error loading media:", error);
                }
            };
            fetchBlob();

            return (
                <div
                    style={{
                        width: "480px",
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

    return (
        <HelmetProvider>
            <Helmet>
                <link rel="stylesheet" href="/css/component/PostCard.css"/>
            </Helmet>
            <ConfirmDialog/>
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
                        <Avatar image={avatar} size="large" shape="circle" className="p-mr-2"/>
                        <div style={{marginLeft: 5}}>
                            <small className="p-m-0 font-bold" style={{color: textColor}}>{username}</small>
                            <br></br>
                            <small className="p-text-secondary" style={{fontSize: 12, color: textHintColor}}>{createdAt}</small>
                        </div>
                    </div>
                    <TieredMenu model={items} popup ref={menu} breakpoint="767px" />
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
                        {caption}
                    </p>
                    {caption.length > 50 && (
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
                <div>
                    <p style={{color: textHintColor, fontSize: 12, fontStyle: "italic"}}>{countLike} likes, {countComment} comments</p>
                </div>
                {/* Actions */}
                <div className="p-d-flex p-ai-center p-jc-between p-p-3">
                    <div>
                        <Button onClick={actionPost} icon={`pi ${isLike ?  "pi-heart-fill" : "pi-heart" } `} className="p-button-rounded p-button-text p-mr-2"/>
                        {ButtonComment}
                        <Button onClick={sendPostToMess} icon="pi pi-send" className="p-button-rounded p-button-text"/>
                        <Button onClick={savePost} icon={`pi ${isSave ? "pi-bookmark-fill" : "pi-bookmark"}`} className="p-button-rounded p-button-text"/>
                    </div>
                            {InputComponent}

                </div>
            </div>
        </HelmetProvider>
    );
};

export default PostCard;

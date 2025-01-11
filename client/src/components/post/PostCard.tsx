import React, {useContext, useRef, useState} from "react";
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
interface PostCardProps {
    avatar: string;
    username: string;
    caption: string;
    medias: any;
    createdAt: string;
    isHideComment?: boolean;
    authorId: string;
    userId: string;
}


const PostCard: React.FC<PostCardProps> = ({userId,  authorId, avatar, username, caption, medias , createdAt,isHideComment= false }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const textColor = currentTheme.getText()
    const textHintColor = currentTheme.getHint()
    const captionColor = currentTheme.getCaption()
    var token = localStorage.getItem("token");
    const listMedia = medias.map((media: { mediaUrl: any; contentType: any; }) =>  {
        return {mediaUrl: media.mediaUrl + token, contentType: media.contentType}
    })
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
    console.log("ok1", authorId )
    console.log("ok2", userId )

    if(authorId === userId)
    {
        console.log("ok")
        items = [...items, {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () =>{

            }
        }]
    }
    createdAt = convertToHoChiMinhTime(createdAt)

    const toggleCaption = () => {
        setIsExpanded(!isExpanded);
    };

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % listMedia.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + listMedia.length) % listMedia.length);
    };
    // @ts-ignore
    var InputComponent = <></>
    var ButtonComment= <></>

    if(!isHideComment)
    {
        ButtonComment = (<>
            <Button icon="pi pi-comment" className="p-button-rounded p-button-text"/>
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
    var mediaShow = <></>
    console.log("Media: ", listMedia)
    if(listMedia[currentIndex].contentType.startsWith("image"))
    {
        mediaShow= (
            <img
                src={listMedia[currentIndex].mediaUrl}
                alt={`Post Image ${currentIndex + 1}`}
                style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    display: "block",
                }}
            />
        )
    }
    else {
        mediaShow =(
            <video
                style={{width: "100%", objectFit: "cover"}}
                controls
                autoPlay
                muted
                key={Date.now()}
            >
                <source src={listMedia[currentIndex].mediaUrl} type={"video/mp4"}/>
            </video>
        )
    }
    return (
        <HelmetProvider>
            <Helmet>
                <link rel="stylesheet" href="/css/component/PostCard.css"/>
            </Helmet>
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
                    {mediaShow}


                    {/* Previous Button */}
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

                    {/* Next Button */}
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

                    {/* Indicators */}
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
                        {listMedia.map((_, index) => (
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
                </div>

                {/* Actions */}
                <div className="p-d-flex p-ai-center p-jc-between p-p-3">
                    <div>
                        <Button icon="pi pi-heart" className="p-button-rounded p-button-text p-mr-2"/>
                        {ButtonComment}
                        <Button icon="pi pi-send" className="p-button-rounded p-button-text"/>
                        <Button icon="pi pi-bookmark" className="p-button-rounded p-button-text"/>
                    </div>
                            {InputComponent}

                </div>
            </div>
        </HelmetProvider>
    );
};

export default PostCard;

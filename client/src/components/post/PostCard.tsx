import React, {useContext, useState} from "react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Galleria } from "primereact/galleria";
import { InputText } from "primereact/inputtext";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {ThemeContext} from "../../ThemeContext.tsx"; // Import cả font-weight mặc định của Roboto

interface PostCardProps {
    avatar: string;
    username: string;
    caption: string;
    images: string[];
}


const PostCard: React.FC<PostCardProps> = ({ avatar, username, caption, images }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const textColor = currentTheme.getText()
    const textHintColor = currentTheme.getHint()
    const captionColor = currentTheme.getCaption()


    const toggleCaption = () => {
        setIsExpanded(!isExpanded);
    };

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <HelmetProvider>
            <Helmet>
                <link rel="stylesheet" href="/css/component/PostCard.css"/>
            </Helmet>
            <div className="p-card p-mb-3 p-shadow-4" style={{backgroundColor: "transparent",boxShadow: "none",width: "100%", maxWidth: "500px", padding: 10, marginTop: 10}}>
                {/* Header */}
                <div className="post-header mx-2 my-3">
                    <div className="post-header-profile">
                        <Avatar image={avatar} size="large" shape="circle" className="p-mr-2"/>
                        <div style={{marginLeft: 5}}>
                            <small className="p-m-0 font-bold" style={{color: textColor}}>{username}</small>
                            <br></br>
                            <small className="p-text-secondary" style={{fontSize: 12, color: textHintColor}}>1d ago</small>
                        </div>
                    </div>
                    <Button icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text"
                            style={{color: textColor}}/>
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
                    <img
                        src={images[currentIndex]}
                        alt={`Post Image ${currentIndex + 1}`}
                        style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "cover",
                            display: "block",
                        }}
                    />

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
                        {images.map((_, index) => (
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
                        <Button icon="pi pi-comment" className="p-button-rounded p-button-text"/>
                        <Button icon="pi pi-send" className="p-button-rounded p-button-text"/>
                    </div>
                    <IconField>
                        <InputIcon className="pi pi-check" onClick={()=>{}}/>

                        <InputText placeholder="Add a comment..." className="input-comment p-inputtext-sm p-mr-2 border-none border-bottom-1"
                                   style={{backgroundColor: "transparent", width: "100%", color: textHintColor}}/>
                    </IconField>
                </div>
            </div>
        </HelmetProvider>
    );
};

export default PostCard;

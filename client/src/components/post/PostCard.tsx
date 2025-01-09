import React from "react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Galleria } from "primereact/galleria";
import { InputText } from "primereact/inputtext";
import {Helmet, HelmetProvider} from "react-helmet-async";
import '@fontsource/roboto'; // Import cả font-weight mặc định của Roboto

interface PostCardProps {
    avatar: string;
    username: string;
    caption: string;
    images: string[];
}

const PostCard: React.FC<PostCardProps> = ({ avatar, username, caption, images }) => {
    return (
        <HelmetProvider>
            <Helmet>
                <link rel="stylesheet" href="/css/component/PostCard.css"/>
            </Helmet>
            <div className="p-card p-mb-3 p-shadow-4" style={{width: "100%", maxWidth: "500px", padding: 10 }}>
                {/* Header */}
                <div className="post-header mx-2 my-3">
                    <div className="post-header-profile">
                        <Avatar image={avatar} size="large" shape="circle" className="p-mr-2" />
                        <div style={{marginLeft: 5}}>
                            <small className="p-m-0 font-bold"  >{username}</small>
                            <br></br>
                            <small className="p-text-secondary" style={{fontSize: 12}}>1d ago</small>
                        </div>
                    </div>
                    <Button icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text" style={{color: "black"}}/>
                </div>

                {/* Caption */}
                <div className="p-px-3 p-pb-2">
                    <p>{caption}</p>
                </div>

                {/* Images */}
                <Galleria
                    value={images}
                    item={(item) => <img src={item} alt="Post Image" style={{ width: "100%", objectFit: "cover" }} />}
                    showThumbnails={false}
                    // numVisible={1}
                    circular
                    showIndicators
                />

                {/* Actions */}
                <div className="p-d-flex p-ai-center p-jc-between p-p-3">
                    <div>
                        <Button icon="pi pi-heart" className="p-button-rounded p-button-text p-mr-2" />
                        <Button icon="pi pi-share-alt" className="p-button-rounded p-button-text" />
                    </div>
                    <InputText placeholder="Add a comment..." className="p-inputtext-sm p-mr-2" />
                </div>
            </div>
        </HelmetProvider>
    );
};

export default PostCard;

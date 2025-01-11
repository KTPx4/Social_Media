import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Menu } from 'primereact/menu';
import { Divider } from 'primereact/divider';
import './PostDetail.css';
import apiClient from "../../utils/apiClient.tsx";
import {userContext} from "../../store/UserContext.tsx";
import PostCard from "../../components/post/PostCard.tsx";
import {ThemeContext} from "../../ThemeContext.tsx";

interface Media {
    id: string;
    postId: string;
    type: number;
    mediaUrl: string;
    content: string | null;
    isDeleted: boolean;
    contentType: string;
}

interface PostData {
    id: string;
    createdAt: string;
    authorId: string;
    content: string;
    postShareId: string | null;
    isHide: boolean;
    status: number;
    type: number;
    sumLike: number;
    sumComment: number;
    listMedia: Media[];
}

const PostDetail: React.FC = () => {
    // @ts-ignore
    const { userId, setUserId } = useContext(userContext);
    var [userToken, setUserToken] = useState(null);
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<PostData | null>(null);
    const [comment, setComment] = useState('');
    const [menu, setMenu] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [files, setFiles] = useState([])

    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
        // @ts-ignore
    const textColor = currentTheme.getText()
    const borderColor = currentTheme.getBorder()
    const backgroundColor = currentTheme.getBackground()
    const textHintColor = currentTheme.getHint()

    useEffect(() => {
        var token = localStorage.getItem("token");
        // @ts-ignore
        setUserToken(token)
        const fetchPost = async () => {
            try {
                const response = await apiClient.get(`/post/${id}`);
                console.log(response)
                // if (data.message === 'Get success') {
                //     setPost(data.data);
                // }
                var status = response.status
                setIsLoading(false)
                if(status === 200)
                {
                    setPost(response.data.data);
                    setFiles(response.data.data.listMedia.map((m: { mediaUrl: any; }) => m.mediaUrl + token));
                }
                else{
                    setPost(null);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [id]);

    const handleLike = () => {
        console.log('Liked post');
    };

    const handleUnlike = () => {
        console.log('Unliked post');
    };

    const handleComment = () => {
        console.log('Commented:', comment);
        setComment('');
    };

    if (isLoading) return <div>Loading...</div>;
    if(!post) return <div>Can not access this post</div>;

    const isAuthor = post.authorId === userId;

    const menuItems = isAuthor
        ? [
            { label: 'Edit', icon: 'pi pi-pencil', command: () => console.log('Edit post') },
        ]
        : [
            { label: 'Report', icon: 'pi pi-flag', command: () => console.log('Report post') },
        ];

    return (
        <div className="post-detail" style={{width: "100%"}}>
            <div className="post-detail-content" style={{borderRight: `1px solid ${borderColor} !important`}}>
                {/*// @ts-ignore*/}
                <PostCard isHideComment={true} createdAt={post.createdAt} images={files} username={post.authorProfile} avatar={post.authorImg} caption={post.content}/>
            </div>

            {/*<Divider layout="vertical" className="divider" />*/}

            <div className="post-detail-comments">

                <div className="comment-list" style={{height: "100%", overflow: "auto", backgroundColor: backgroundColor, minHeight: 500}}>
                    {/*list comment*/}
                </div>

                <div className="comment-input" style={{marginBottom: 40, minWidth: 300, maxWidth: 700}}>
                    <InputText placeholder="Add a comment..." className="input-comment p-inputtext-sm p-mr-2 border-none border-bottom-1"
                               style={{backgroundColor: "transparent", width: "100%", color: textHintColor}}/>
                    <Button text label="Post" onClick={handleComment} />
                </div>
            </div>
        </div>
    );
};

export default PostDetail;

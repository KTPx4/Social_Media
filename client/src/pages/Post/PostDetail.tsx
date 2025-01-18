import React, {useContext, useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import apiClient from "../../utils/apiClient.tsx";
import PostCard from "../../components/post/PostCard.tsx";
import {ThemeContext} from "../../ThemeContext.tsx";
import useStore from "../../store/useStore.tsx";
import {Card} from "primereact/card";
// @ts-ignore
import './PostDetail.css';
import postCard from "../../components/post/PostCard.tsx";
import CommentComponent from "../../components/post/CommentComponent.tsx";
import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import {Toast} from "primereact/toast";
import {ProgressSpinner} from "primereact/progressspinner";
import {InputIcon} from "primereact/inputicon";
import {InputMask} from "primereact/inputmask";
import {IconField} from "primereact/iconfield";

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
    const {userId, setId} = useStore()
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<PostData | null>(null);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [files, setFiles] = useState([])

    const toast = useRef<Toast>(null);

    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
        // @ts-ignore
    const textColor = currentTheme.getText()
    const borderColor = currentTheme.getBorder()
    const backgroundColor = currentTheme.getBackground()
    const textHintColor = currentTheme.getHint()
    const keyTheme = currentTheme.getKey()


    const [listComment , setListComment] = useState([])
    const [page, setPage] = useState(1)
    const [isCanLoadComment, setIsCanLoadComment] = useState(true)
    const [isWaitLoadComment, setIsWaitLoadComment] = useState(false)
    const [replyCommentId, setReplyCommentId] = useState("");
    const [isWaitComment, setIsWaitComment] = useState(false);
    const [inputComment, setInputComment] = useState("")

// load list comment
    const loadListComment = async (p: number)=>{
        if(!isCanLoadComment) return

        try{
            var rs = await  apiClient.get(`/post/${id}/comment?page=${p}`)
            console.log(rs)
            setIsWaitLoadComment(false)
            var statusCode = rs.status
            if(statusCode == 200)
            {
                var listComment = rs.data.data
                if( !listComment || listComment === null || listComment.length === 0)
                {
                    setIsCanLoadComment(false)
                    return
                }
                // @ts-ignore

                setListComment((prev) => [...prev, ...listComment])
            }
        }
        catch (e)
        {
            setIsWaitLoadComment(false)
            console.log(e)
        }
    }
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await apiClient.get(`/post/${id}`);
                // console.log(response)
                // if (data.message === 'Get success') {
                //     setPost(data.data);
                // }
                var status = response.status
                console.log(response)
                setIsLoading(false)
                if(status === 200)
                {

                    setPost(response.data.data);
                    setFiles(response.data.data.listMedia);
                }
                else{
                    setPost(null);
                }

            } catch (error) {
                console.error('Error fetching post:', error);
                // @ts-ignore
                setIsLoading(false)
                setPost(null);
            }

        };

        fetchPost();
    }, [id]);

    useEffect(() => {

        loadListComment(page);

    }, [page]);
    const handleComment = () => {
        console.log('Commented:', comment);
        setComment('');
    };
    const goToHome = () => {
        // Điều hướng về trang chính (ví dụ sử dụng react-router-dom)
        window.location.href = '/home';
    };

    const PostComment = async( ) =>{
        if(isWaitComment) return;
        if(!inputComment || !inputComment.trim()) return;

        setIsWaitComment(true);
        console.log(inputComment)
        console.log(replyCommentId)

        var data = {

            Content: inputComment
        }

        try{
            var rs = await apiClient.post(`/post/${id}/comment`, data)
            console.log(rs)
            setIsWaitComment(false);

            var statusCode = rs.status
            if( statusCode === 200 || statusCode === 201)
            {
                var rsComment = rs.data.data
                // @ts-ignore
                setListComment((prev) => [rsComment, ...prev])
            }
        }catch (e)
        {
            setIsWaitComment(false);
            console.log(e)
        }
        setInputComment("")
    }
    const showConfirm = (message: string): Promise<boolean> => {
        return new Promise((resolve) => {
            confirmDialog({
                message,
                header: "Delete Comment",
                icon: "pi pi-exclamation-triangle",
                accept: () => resolve(true), // Resolve khi người dùng accept
                reject: () => resolve(false), // Resolve khi người dùng reject
            });
        });
    };
    const DeleteComment = async(commentId : string, callBackSuccess: any) =>{
        console.log("Comment id: ", commentId)

        // show confirm

        const isConfirmed = await showConfirm("Are you sure you want to delete this comment?");
        if (!isConfirmed) {

            return; // Người dùng từ chối, không làm gì cả
        }

        try{
            var rs = await apiClient.delete(`/post/${id}/comment/${commentId}`)
            var statusCode = rs.status
            if(statusCode === 200 || statusCode === 204)
            {
                // if accept
                callBackSuccess(commentId)
                // @ts-ignore
                var findCmt = listComment.filter(comment => comment.id === commentId)
                if( findCmt.length > 0)
                {
                    // @ts-ignore
                    var newListComment = listComment.filter(comment => comment.id !== commentId)
                    setTimeout(()=>{
                        setListComment(newListComment)
                    }, 1000)
                }
            }
            else{
                alert("Let reload and try again!")
            }
        }
        catch(err){
            alert("Let reload and try again!")
            console.error(err);
        }

    }


    if (isLoading) return <div>Loading...</div>;
    if(!post) return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: "100%",
                textAlign: 'center',
                backgroundColor: backgroundColor,
            }}
        >
            <Card style={{maxWidth: '400px', padding: '1rem', backgroundColor: keyTheme === "theme_dark" ? "black" : "white"}}>
                <img
                    src="/public/person.png"
                    alt="Error Icon"
                    style={{width: '150px', marginBottom: '1rem'}}
                />
                <h3 style={{color: textColor}}>This post is currently unavailable.</h3>
                {/*<p style={{color: '#6c757d'}}>*/}
                {/*    The content you are trying to view is not accessible right now.*/}
                {/*</p>*/}
                <Button label="Go to Home" icon="pi pi-home" onClick={goToHome}/>
            </Card>
        </div>
    );


    return (
        <div className="post-detail" style={{width: "100%", maxHeight: 700}}>
            <ConfirmDialog/>
            <Toast ref={toast}/>
            <div className="post-detail-content" style={{borderRight: `1px solid ${borderColor} !important`}}>
                {/*// @ts-ignore*/}
                {/*<PostCard postId={post.id} userId={userId} authorId={post.authorId} isHideComment={true}*/}
                {/*          createdAt={post.createdAt} medias={files} username={post.authorProfile}*/}
                {/*          avatar={post.authorImg} caption={post.content}/>*/}
                <PostCard post={post} isHideComment={true}/>

            </div>

            {/*<Divider layout="vertical" className="divider" />*/}

            <div className="post-detail-comments">

                <div className="comment-list"
                     style={{height: "100%", overflow: "auto", backgroundColor: backgroundColor, minHeight: 500, border: `2px solid ${borderColor}`}}>
                    {listComment.map((comment) =>{
                        // @ts-ignore
                        return (<CommentComponent DeleteComment={DeleteComment} key={comment.id} comment={comment} postId={id}/>)
                    })}
                     {/*list comment*/}

                    {isWaitLoadComment && (
                        <ProgressSpinner   style={{marginLeft: 25, width: '30px', height: '30px'}} strokeWidth="5"  animationDuration=".5s" />
                    )}
                    {isCanLoadComment && !isWaitLoadComment && (
                        <div style={{marginTop: 2}}>
                            <p onClick={()=> {
                                if(isWaitLoadComment)
                                {
                                    return
                                }
                                setIsWaitLoadComment(true)
                                setPage(page+1)
                            }}
                               style={{fontSize: 12, fontStyle: "italic", cursor: "pointer"}}>...Load orther
                                comment...</p>
                        </div>
                    )}
                </div>

                <div className="comment-input-div" style={{marginBottom: 40, minWidth: 300, maxWidth: 700}}>
                    <IconField className="input-comment" style={{width: "100%", margin: "0 0px"}}>
                        <InputText
                            style={{
                                backgroundColor: borderColor,
                                width: "100%",
                                color: textHintColor
                            }}
                            disabled={isWaitComment}
                            value={inputComment}
                            onChange={(e)=> setInputComment(e.target.value)}
                            onKeyDown={(e)=>{
                                if(e.key === "Enter") {
                                    PostComment()
                                }
                            }}
                            placeholder="Add a comment..." className="input-comment p-inputtext-sm p-mr-2 border-none border-bottom-1"
                        />
                        <InputIcon className="pi pi-send" onClick={PostComment}/>
                    </IconField>

                    {/*<Button text icon={"pi pi-send"} onClick={PostComment} />*/}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;

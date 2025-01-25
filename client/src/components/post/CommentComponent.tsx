import React, {useState, useEffect, useContext, useRef} from "react";
import apiClient from "../../utils/apiClient.tsx";
import {Avatar} from "primereact/avatar";
import {ThemeContext} from "../../ThemeContext.tsx";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import useStore from "../../store/useStore.tsx";
import {TieredMenu} from "primereact/tieredmenu";

import './Comment.css';
import {ProgressSpinner} from "primereact/progressspinner";
import {Tooltip} from "primereact/tooltip";
import {convertToHoChiMinhTime, toHCMTime} from "../../utils/Convertor.tsx";
import {IconField} from "primereact/iconfield";

type CommentComponent = {
    id: string;
    postId: string;
    userId: string;
    userProfile: string;
    imageUrl: string;
    isLike: boolean;
    replyCommentId: string | null;
    rootCommentId: string | null;
    content: string;
    createdAt: string;
    countReply: number;
    countLike: number;
    replyUserProfile: string;
};

type CommentProps = {
    comment: CommentComponent;
    postId: string;
    isChild: boolean;
    ClickComment: any;
    DeleteComment: any;
};

const LIMIT_LOAD_COMMENT = 20

const CommentComponent: React.FC<CommentProps> = ({ comment, postId, isChild = false, ClickComment, DeleteComment }) => {
    var hrefProfile = "/home/profile"
    const {userId} = useStore()

    const isOwn = comment.userId === userId
    const [pageChild, setPageChild] = useState(0);
    const [canLoadReply, setCanLoadReply] = useState((comment.countReply > 0) && !isChild);
    const [listChildComment, setListChildComment] = useState([])
    const [isShowComment, setIsShowComment] = useState(false);
    const [userReply, setUserReply] = useState("");
    const [marginTopInput, setMarginTopInput] = useState(0);

    const [replyCommentId, setReplyCommentId] = useState("");
    const [isWaitComment, setIsWaitComment] = useState(false);
    const [inputComment, setInputComment] = useState("")
    const [isLike, setIsLike] = useState(comment.isLike)
    const [countLike , setCountLike] = useState(comment.countLike)
    const  [isDeleted, setIsDeleted] = useState(false);
    const [waitLoadComment, setWailoadComment] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null); // Tham chiếu đến input

    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const textColor = currentTheme.getText()
    const textHintColor = currentTheme.getHint()
    const captionColor = currentTheme.getCaption()
    const cardColor = currentTheme.getCard()

    const menu = useRef(null);
    var items = [
       {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () =>{
                clickDeletePost()
            }
        },
    ];

    const clickDeletePost = async () =>{
        // if call from chill -> CallBackDelFromRoot
        // if call from root -> PostDetails will detele this comment and child will delete
        await DeleteComment(comment.id, (cmtId)=>{
            setIsDeleted(true);
        })
    }
    const CallBackDelFromRoot = (commentId: string, callBack) => {

        DeleteComment(commentId, (delCommentId: string) =>{

            if(delCommentId === comment.id)
            {
                setIsDeleted(true);
                // setListChildComment([])
            }else{
                callBack(delCommentId)
                setTimeout(()=>{
                    setListChildComment( listChildComment.filter((child: any) => child.id !== delCommentId))
                }, 1000)
            }
        })
    }
    const PostComment = async( ) =>{
        if(isWaitComment) return;

        setIsWaitComment(true);
        console.log(inputComment)
        console.log(replyCommentId)

        var data = {
            ReplyCommentId: replyCommentId,
            Content: inputComment
        }

        try{
            var rs = await apiClient.post(`/post/${comment.postId}/comment`, data)
            console.log(rs)
            setIsWaitComment(false);

            var statusCode = rs.status
            if( statusCode === 200 || statusCode === 201)
            {
                var rsComment = rs.data.data
                // @ts-ignore
                setListChildComment((prev) => [...prev, rsComment])
            }
        }catch (e)
        {
            setIsWaitComment(false);
            console.log(e)
        }
        setInputComment("")
    }
    const SendAction = async(isLike: boolean, commentId: string)=>{
        var rs = null
        try{
            if(isLike) // unlike
            {
                rs = await apiClient.post(`/post/${comment.postId}/comment/${commentId}/unlike`)
            }
            else{ // like
                rs = await apiClient.post(`/post/${comment.postId}/comment/${commentId}/like`)
            }
            var statusCode = rs.status
            if( statusCode === 200 || statusCode === 204)
            {
                return !isLike;
            }
        }
        catch(e){
            console.log(e)
        }

    }
    const LikeClick = async ()=>{ // call in component
        if(ClickComment == null) { // click from root
            setIsLike(!isLike)
            SendAction(comment.isLike, comment.id)

            setCountLike(countLike + (isLike ? -1 : 1))

            return
        }
        else{ // click from child
            ClickComment(comment, isChild, "like")
        }
    }

    useEffect(() => {
        if(isShowComment)
        {
            handleCommentClick();
        }
    }, [isShowComment]);

    const CommentClick = async() =>{
        setIsShowComment(true)

        handleCommentClick();

        if(ClickComment == null) { // click from root
            setUserReply(comment.userProfile)
            setReplyCommentId(comment.id)
            return
        }
        else{ // click from child - reply
            ClickComment(comment, isChild, "comment")
        }
    }
    const handleCommentClick = () => {
        inputRef.current?.focus(); // Trỏ đến ô input
    };
    // @ts-ignore
    const CallBackCommentFromRoot = async(childComment, isChild, type) =>{
        // get click from child - reply
        console.log("Click comment: ", childComment)

        setIsShowComment(true)
        setUserReply(childComment.userProfile)
        setReplyCommentId(childComment.id)
        handleCommentClick();

        if(type.toLowerCase() === "like")
        {
            var newStatus = await SendAction(childComment.isLike, childComment.id)
            console.log(listChildComment)

            var newarr = listChildComment.map((item:any) => item.id === childComment.id ? {...item, isLike: newStatus, countLike: childComment.countLike + (newStatus ? 1 : -1)} : item)
            var rs = [...newarr]
            console.log("update: ",rs)
            setListChildComment(rs)
        }
        else{
        }

    }

    const loadChildComment = async () =>{
        if(waitLoadComment) return

        var nextPage = pageChild + 1
        var sumPage= Math.ceil(comment.countReply / LIMIT_LOAD_COMMENT);
        if(nextPage > sumPage)
        {
            setCanLoadReply(false)
            return
        }
        setWailoadComment(true)
        setPageChild(nextPage)
        try{
            var rs = await apiClient.get(`/post/${postId}/comment/${comment.id}?page=${nextPage}`)
            console.log("Child: ", rs)
            setWailoadComment(false)
            var statusCode = rs.status
            if(statusCode == 200)
            {
                var listComment = rs.data.data
                if(!listComment || listComment === null || listComment.length == 0)
                {
                    setCanLoadReply(false)
                    return
                }
                // @ts-ignore
                setListChildComment((prev) => [...prev, ...listComment])
                nextPage +=  1
                if(nextPage > sumPage)
                {
                    setCanLoadReply(false)
                    return
                }
            }
        }
        catch (e)
        {
            setWailoadComment(false)
            console.log(e)
        }
    }
    var prefixComment = <></>
    var cmt = comment.content.trim()
    var content = ""
    if(cmt.startsWith("@"))
    {
        var index = cmt.indexOf(" ")

        content = cmt.substring(index)
        var userProfile = cmt.substring(0, index)
        if(userProfile)
        {
            prefixComment = <a href={`${hrefProfile}/${userProfile.substring(1)}`}>{userProfile}</a>
        }
    }
    else{
        content = cmt
    }
    const commentCaption = (<>
        {prefixComment} {content}
    </>)

    return (
        <>

            <div
                className={`comment ${ isDeleted ? "fade-out" : ""}`}
                style={{
                marginTop: 15,
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                transition: "opacity 1s"
            }}>

                <div className="root-comment">
                    <div   className="post-header-profile" style={{display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start"}}>
                        <Avatar image={comment.imageUrl} size={"large"} shape="circle" className="p-mr-2"/>
                        <div style={{marginLeft: 5, display: "flex", flexDirection: "column"}}>
                            <div style={{
                                minWidth: 10,
                                display: "flex",
                                flexDirection: "column",

                            }}>
                                {/*name - content*/}
                                <div
                                 style={{
                                     display: "flex",
                                     flexDirection: "row",
                                 }}>

                                    <div style={{
                                        backgroundColor:  cardColor,
                                        padding: "7px 15px",
                                        borderRadius: 17,
                                        width: "fit-content"
                                    }}>
                                        <small className="p-m-0 font-medium"
                                               style={{
                                                   marginBottom: 5,
                                                   maxWidth: "200px",
                                                   color: textColor,
                                                   fontSize: 13,
                                                   wordWrap: "break-word",
                                                   overflowWrap: "break-word",
                                                   display: "block" // Đảm bảo xuống hàng nếu cần
                                               }}
                                        >
                                            <a style={{fontSize: 13, textDecoration: "none", color: textColor}}
                                               href={hrefProfile + "/" + comment.userProfile}>  {comment.userProfile}</a>

                                            {comment.replyUserProfile && (
                                                <>
                                                    {" "}
                                                    <span
                                                        style={{height: 13, width: 13, fontSize: 12, color: textHintColor}}
                                                        className="pi pi-angle-right"/>
                                                    <a style={{fontSize: 13, textDecoration: "none", color: textColor}}
                                                       href={hrefProfile + "/" + comment.replyUserProfile}>{comment.replyUserProfile}</a>
                                                </>
                                            )}
                                        </small>


                                        <small className="p-text-secondary"
                                               style={{
                                                   maxWidth: "230px",
                                                   minWidth: "5px",
                                                   fontSize: 13,
                                                   color: captionColor,
                                                   wordWrap: "break-word",
                                                   overflowWrap: "break-word",
                                                   display: "block" // Đảm bảo xuống hàng nếu cần
                                               }}
                                        >{commentCaption}</small>

                                    </div>

                                    {/*edit*/}
                                    {isOwn && (
                                        <div>
                                            <TieredMenu model={items} popup ref={menu} breakpoint="767px"/>
                                            <Button  icon="pi pi-ellipsis-v" className="btn-comment-more p-button-rounded p-button-text"
                                                    style={{color: textColor, display: "none"}}
                                                // @ts-ignore
                                                    onClick={(e) => menu.current.toggle(e)}
                                            />
                                        </div>
                                    )}
                                </div>
                                {/*action*/}
                                <div style={{
                                    marginLeft: 10,
                                    marginTop: 8,
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "start",
                                    maxWidth: isChild ? 200 : 170
                                }}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}>
                                    {/*<Tooltip target=".comment-created" />*/}

                                    <p
                                        className="comment-created"
                                        title={toHCMTime(comment.createdAt)}
                                        // data-pr-position="right"
                                        // data-pr-at="right+5 top"
                                        // data-pr-my="left center-2"
                                        style={{
                                        fontSize: 11,
                                        color: textHintColor,
                                        padding: 0,
                                        margin: 0
                                    }}>{convertToHoChiMinhTime(comment.createdAt)}</p>


                                    <Button onClick={LikeClick} text style={{
                                        marginLeft: 8,
                                        maxWidth: 25,
                                        padding: 0,
                                        margin: "0 0 0 5px",
                                        height: "fit-content"
                                    }}
                                            title={isLike ? "Unlike" : "Like"}
                                            icon={`pi ${isLike ? "pi-heart-fill" : "pi-heart"} `}
                                            className="p-button-rounded p-button-text p-mr-2"/>

                                    <Button title={"Reply"} onClick={CommentClick} text style={{maxWidth: 25, padding: 0, margin: 0, height: "fit-content"}}
                                            icon="pi pi-comment"
                                            className="p-button-rounded p-button-text"/>
                                </div>
                                <div>
                                    <p style={{
                                        fontSize: 11,
                                        color: textHintColor,
                                        padding: 0,
                                        margin: "0 0 0 7px",

                                    }}>{countLike} likes</p>
                                </div>
                            </div>

                            </div>


                        </div>

                    </div>
                    <div style={{
                        marginLeft: 30
                    }}>
                        <div style={{marginTop: 2}} className="child-comment">
                            {listChildComment.map((child) => {
                                return (
                                    // @ts-ignore
                                    <CommentComponent comment={child} postId={postId} isChild={true} key={`${child.id}-${child.isLike}`} ClickComment={CallBackCommentFromRoot} DeleteComment={CallBackDelFromRoot}/>
                                )
                            })}
                        </div>
                        {isWaitComment && (
                            <>

                            </>
                        )}
                        {!isChild && isShowComment &&  (
                            <div className="input-reply" style={{marginTop: marginTopInput,  borderRadius: 10}}>
                                <FloatLabel>
                                    <InputText
                                        ref={inputRef}
                                        autoComplete="off"
                                        disabled={isWaitComment}
                                        onFocus={() => setMarginTopInput(25)} // Thêm margin-top khi nhấp vào
                                        onBlur={() => setMarginTopInput(0)}  // Đặt lại margin-top khi rời khỏi
                                        id="userprofile"
                                        onKeyDown={(e)=>{
                                            if(e.key === "Enter") {
                                                PostComment()
                                                console.log("Enter comment")
                                            }
                                        }}
                                        value={inputComment}
                                        onChange={(e)=> setInputComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="input-comment p-inputtext-sm p-mr-2 border-none border-bottom-1"
                                        style={{
                                            backgroundColor: "transparent",
                                            width: "100%",
                                            color: textHintColor
                                        }}/>
                                    <label htmlFor="userprofile">{userReply}</label>
                                </FloatLabel>

                            </div>
                        )}
                        {waitLoadComment && (
                            <ProgressSpinner   style={{marginLeft: 25, width: '30px', height: '30px'}} strokeWidth="5"  animationDuration=".5s" />
                        )}
                        {canLoadReply && !waitLoadComment && (
                            <div style={{marginTop: 2, marginLeft: 20}}>
                                <p onClick={loadChildComment}
                                   style={{fontSize: 11, fontStyle: "italic", cursor: "pointer"}}>load orther
                                    reply...</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>

    );
};

export default CommentComponent;

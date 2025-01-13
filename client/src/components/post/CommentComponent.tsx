import React, {useState, useEffect, useContext, useRef} from "react";
import apiClient from "../../utils/apiClient.tsx";
import {Avatar} from "primereact/avatar";
import {ThemeContext} from "../../ThemeContext.tsx";
import {Button} from "primereact/button";
import convertToHoChiMinhTime from "../../utils/Convertor.tsx";
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import useStore from "../../store/useStore.tsx";
import {TieredMenu} from "primereact/tieredmenu";



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
};

type CommentProps = {
    comment: CommentComponent;
    postId: string;
    isChild: boolean;
    ClickComment: any;
};

const LIMIT_LOAD_COMMENT = 20

const CommentComponent: React.FC<CommentProps> = ({ comment, postId, isChild = false, ClickComment }) => {
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
                deletePost()
            }
        },
    ];
    const deletePost = () =>{

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

    const CommentClick = async() =>{
        setIsShowComment(true)
        if(ClickComment == null) { // click from root
            setUserReply(comment.userProfile)
            setReplyCommentId(comment.id)
            return
        }
        else{ // click from child - reply
            ClickComment(comment, isChild, "comment")
        }
    }

    // @ts-ignore
    const CallBackCommentFromRoot = async(childComment, isChild, type) =>{
        // get click from child - reply
        console.log("Click comment: ", childComment)
        setIsShowComment(true)
        setUserReply(childComment.userProfile)
        setReplyCommentId(childComment.id)

        if(type.toLowerCase() === "like")
        {
            var newStatus = await SendAction(childComment.isLike, childComment.id)
            console.log(listChildComment)

            var newarr = listChildComment.map((item:any) => item.id === childComment.id ? {...item, isLike: newStatus, countLike: childComment.countLike + (newStatus ? 1 : -1)} : item)
            var rs = [...newarr]
            console.log("update: ",rs)
            setListChildComment(rs)
        }

    }

    const loadChildComment = async () =>{
        var nextPage = pageChild + 1
        var sumPage= Math.ceil(comment.countReply / LIMIT_LOAD_COMMENT);
        if(nextPage > sumPage)
        {
            setCanLoadReply(false)
            return
        }

        setPageChild(nextPage)
        try{
            var rs = await apiClient.get(`/post/${postId}/comment/${comment.id}?page=${nextPage}`)
            console.log(rs)
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
            prefixComment = <a href={`/account/${userProfile.substring(1)}`}>{userProfile}</a>
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

            <div className="comment" style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "row",
                justifyContent: "start"
            }}>

                <div className="root-comment">
                    <div className="post-header-profile" style={{display: "flex", flexDirection: "row", alignItems: "flex-start"}}>
                        <Avatar image={comment.imageUrl} size={"large"} shape="circle" className="p-mr-2"/>
                        <div style={{marginLeft: 5, display: "flex", flexDirection: "column"}}>
                            <div style={{
                                minWidth: 50,
                                display: "flex",
                                flexDirection: "column",

                            }}>
                                <div
                                 style={{
                                     backgroundColor:  cardColor,
                                     padding: "10px 15px",
                                     borderRadius: 25,
                                     width: "fit-content"
                                 }}>

                                    <small className="p-m-0 font-bold"
                                           style={{
                                               maxWidth: "200px",
                                               color: textColor,
                                               fontSize: 16,
                                               wordWrap: "break-word",
                                               overflowWrap: "break-word",
                                               display: "block" // Đảm bảo xuống hàng nếu cần
                                           }}
                                    >{comment.userProfile}</small>

                                    <small className="p-text-secondary"
                                           style={{
                                               maxWidth: "230px",
                                               minWidth: "140px",
                                               fontSize: 13,
                                               color: captionColor,
                                               wordWrap: "break-word",
                                               overflowWrap: "break-word",
                                               display: "block" // Đảm bảo xuống hàng nếu cần
                                           }}
                                    >{commentCaption}</small>
                                </div>
                            <div style={{
                                marginLeft: 10,
                                marginTop: 5,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "start",
                                maxWidth: isChild ? 200 : 140
                            }}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}>
                                    <p style={{
                                        fontSize: 11,
                                        color: textHintColor,
                                        padding: 0,
                                        margin: 0
                                    }}>{convertToHoChiMinhTime(comment.createdAt)}</p>
                                    <Button onClick={LikeClick} text style={{
                                        marginLeft: 8,
                                        maxWidth: 25,
                                        padding: 0,
                                        margin: 0,
                                        height: "fit-content"
                                    }}
                                            icon={`pi ${isLike ? "pi-heart-fill" : "pi-heart"} `}
                                            className="p-button-rounded p-button-text p-mr-2"/>

                                    <Button onClick={CommentClick} text style={{maxWidth: 25, padding: 0, margin: 0, height: "fit-content"}}
                                            icon="pi pi-comment"
                                            className="p-button-rounded p-button-text"/>
                                </div>
                                <div>
                                    <p style={{
                                        fontSize: 11,
                                        marginLeft: 5,
                                        color: textHintColor,
                                        padding: 0,
                                        margin: 0
                                    }}>{countLike} likes</p>
                                </div>
                            </div>

                            </div>

                            <div style={{marginTop: 2}} className="child-comment">
                                {listChildComment.map((child) => {
                                    return (
                                        // @ts-ignore
                                        <CommentComponent comment={child} postId={postId} isChild={true} key={`${child.id}-${child.isLike}`} ClickComment={CallBackCommentFromRoot}/>
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
                            {canLoadReply && (
                                <div style={{marginTop: 2}}>
                                    <p onClick={loadChildComment}
                                       style={{fontSize: 12, fontStyle: "italic", cursor: "pointer"}}>...Load orther
                                        comment...</p>
                                </div>
                            )}
                        </div>
                        {isOwn && (
                            <div>
                                <TieredMenu model={items} popup ref={menu} breakpoint="767px" />
                                <Button  icon="pi pi-ellipsis-v" className="p-button-rounded p-button-text"
                                        style={{color: textColor}}
                                    // @ts-ignore
                                        onClick={(e) => menu.current.toggle(e)}
                                />
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>

    );
};

export default CommentComponent;

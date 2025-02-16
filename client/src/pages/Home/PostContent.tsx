// @ts-ignore
import PostCard from "../../components/post/PostCard.tsx";

import {Avatar} from "primereact/avatar";
import useStore from "../../store/useStore.tsx";
import React, {useEffect, useRef, useState} from "react";
import PostDetail from "../Post/PostDetail.tsx";
import {IndexedDBService} from "../../store/IndexedDBService.ts";
import apiClient from "../../utils/apiClient.tsx";
import {ProgressSpinner} from "primereact/progressspinner";

// @ts-ignore
const post = {
    avatar: "https://via.placeholder.com/150",
    username: "px4k3.pxt",
    caption: "This is my post to describe about post in my app...This is my post to describe about post in my app...This is my post to describe about post in my app...",
    images: [
        "https://via.placeholder.com/500x300",
        "https://via.placeholder.com/500x400",
    ],
    isHideComment: false
};

const PostContent = () =>{
    const {userId}= useStore()
    const [listPost, setListPost] = useState([])
    const [page, setPage] = useState(1)
    const db = new IndexedDBService("ChatDB", "stored");
    const [isLoadPost, setIsLoadPost] = useState(false);
    const [isEndLoad, setIsEndLoad] = useState(false);

    const contentRef = useRef<HTMLDivElement | null>(null); // Ref cho container

    useEffect(() => {
        LoadFromLocal()
        LoadFromDb()
    }, []);

    const LoadFromLocal = async ()=>{
        try{
            const savePosts = await db.getItem<{ id: string; data: any }[]>("posts");
            if (!savePosts || savePosts.length < 1) return;
            var data = savePosts?.data
            setListPost(data ?? [])
        }
        catch (e)
        {
            console.log(e)
        }

    }
    const LoadFromDb = async () =>{
        if(isLoadPost || isEndLoad) return
        try{
            setIsLoadPost(true)
            var rs = await  apiClient.get(`/post?page=${page}`)
            console.log("===========================,", page)
            var statusCode = rs.status
            if(statusCode === 200)
            {
                var data = rs.data.data
                if(data && data.length > 0)
                {
                    console.log("////////////////////////////////")
                    if(page > 1)
                    {
                        var listOldId = listPost.map((post) => post.id) ?? []

                        var newPost = data.filter((p) => !listOldId.includes(p.id))

                        var newData = [...listPost, ...newPost]
                        setListPost(newData)

                    }
                    else{
                        await db.addItem({ id: "posts", data: data });
                        setListPost(data)
                    }

                }
                else{
                    setIsEndLoad(true)
                }
                setPage(page+1)
            }
            setIsLoadPost(false)

        }
        catch (e)
        {
            setIsLoadPost(false)
            console.log(e)
        }
    }

    const onScrollPost = async()=>{
        if(!contentRef.current || isLoadPost) return
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;

        if (scrollTop + clientHeight >= (scrollHeight*2) / 3) {

            await LoadFromDb()
        }
    }
    return (
        <>
            <div className="p-d-flex p-jc-center p-p-4"
                 style={{
                     width: "100%",
                     display: "flex",
                     justifyContent: "center",
                     alignItems: "center",
                    flexDirection: "column"
                }}
            >
                <div className="list-follow-online"
                     style={{
                         overflowX: "auto",
                         width: "100%",
                         maxWidth: "600px",
                         margin: "5px 0px 20px",
                         display: "flex",
                         flexDirection: "row",
                         justifyContent: "center",
                         flexWrap: "nowrap",
                         padding: 10
                    }}>

                    <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "0px 10px"
                        }}>
                        {/*<Avatar*/}
                        {/*    image={"https://via.placeholder.com/150"}*/}
                        {/*    shape="circle"*/}
                        {/*    style={{ width: 50, height: 50 , minWidth:  50}}*/}
                        {/*/>*/}
                        {/*<p style={{fontSize: 12, maxWidth: 60, overflow: "hidden", textOverflow: "ellipsis"}}>Px4k3ssssssssssssssssss</p>*/}
                   </div>
                </div>
                <div
                    ref={contentRef}
                    onScroll={onScrollPost}
                    style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems:"center",
                    overflow:"auto",
                    height: "88vh"
                }}>
                    {isLoadPost && (
                        <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="4" fill="transparent"
                                         animationDuration=".5s"/>
                    )}
                    {listPost?.map((post) => {
                        return (
                            <PostCard post={post} isHideComment={false} key={post.id}/>
                        )
                    })}
                </div>


            </div>
        </>
    )
}
export default PostContent
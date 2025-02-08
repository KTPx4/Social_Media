import React, {useEffect, useState} from "react";
import apiClient from "../../utils/apiClient.tsx";
import PostCard from "../post/PostCard.tsx";

const ListPostComponent : React.FC<any> = ({ userProfile, postType}) =>{
    const [listPost, setListPost] = useState([])

    useEffect(() => {
        if(postType)
        {
            loadPost()
        }
    }, [postType]);

    const loadPost = async()=>{
        try{
            var rs = await apiClient.get(`/user/profile/${userProfile}/${postType}`)
            var status = rs.status
            if(status === 200)
            {
                console.log("data: ",rs.data.data)
                setListPost(rs.data.data)
            }
        }
        catch (e)
        {
            console.log(e)
        }
    }

    return(
        <div style={{
            display: "flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center"
        }}>
            {listPost.map((p)=>
                 <PostCard  key={p.id+Date.now()} post={p} isHideComment={true}/>
            )}
            {listPost.length < 1 && (
                <h1>Nothing to show here</h1>
            )}
        </div>
    )
}
export default ListPostComponent
import PostCard from "../../components/post/PostCard.tsx";

import {Avatar} from "primereact/avatar";

const post = {
    avatar: "https://via.placeholder.com/150",
    username: "px4k3.pxt",
    caption: "This is my post to describe about post in my app...This is my post to describe about post in my app...This is my post to describe about post in my app...",
    images: [
        "https://via.placeholder.com/500x300",
        "https://via.placeholder.com/500x400",
    ],
};

const PostContent = () =>{
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
                        <Avatar
                            image={"https://via.placeholder.com/150"}
                            shape="circle"
                            style={{ width: 50, height: 50 , minWidth:  50}}
                        />
                        <p style={{fontSize: 12, maxWidth: 60, overflow: "hidden", textOverflow: "ellipsis"}}>Px4k3ssssssssssssssssss</p>
                    </div>
  <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "0px 10px"
                        }}>
                        <Avatar
                            image={"https://via.placeholder.com/150"}
                            shape="circle"
                            style={{ width: 50, height: 50 , minWidth:  50}}
                        />
                        <p style={{fontSize: 12, maxWidth: 50, overflow: "hidden", textOverflow: "ellipsis"}}>Px4k3ssssssssssssssssss</p>
                    </div>
  <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "0px 10px"
                        }}>
                        <Avatar
                            image={"https://via.placeholder.com/150"}
                            shape="circle"
                            style={{ width: 50, height: 50 , minWidth:  50}}
                        />
                        <p style={{fontSize: 12, maxWidth: 50, overflow: "hidden", textOverflow: "ellipsis"}}>Px4k3ssssssssssssssssss</p>
                    </div>
  <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "0px 10px"
                        }}>
                        <Avatar
                            image={"https://via.placeholder.com/150"}
                            shape="circle"
                            style={{ width: 50, height: 50 , minWidth:  50}}
                        />
                        <p style={{fontSize: 12, maxWidth: 50, overflow: "hidden", textOverflow: "ellipsis"}}>Px4k3ssssssssssssssssss</p>
                    </div>


                </div>

                {/*list post */}
                <PostCard {...post} />
                <PostCard {...post} />
                <PostCard {...post} />
            </div>
        </>
    )
}
export default PostContent
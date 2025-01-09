import PostCard from "../../components/post/PostCard.tsx";

const post = {
    avatar: "https://via.placeholder.com/150",
    username: "px4k3.pxt",
    caption: "This is my post to describe about post in my app...",
    images: [
        "https://via.placeholder.com/500x300",
        "https://via.placeholder.com/500x300/ff7f7f",
    ],
};

const PostContent = () =>{
    return (
        <>
            <div className="p-d-flex p-jc-center p-p-4">
                <PostCard {...post} />
            </div>
        </>
    )
}
export default PostContent
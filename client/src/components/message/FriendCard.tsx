import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import useStore from "../../store/useStore.tsx";

const FriendCard = ({canRemove = true, isAdd, Friend, Image, Name, ClickAdd, Profile, Role = "member"})=>{
    const {userId} = useStore()
    const OnclickButton = ()=>{
        ClickAdd(Friend , isAdd)
    }

    console.log(Friend)

    return(
        <div style={{
            margin: "20px 0",
            display: "flex",
            flexDirection:"row",
            alignItems:"center",
            width: "100%"
        }}>
            <Avatar image={Image} shape="circle" style={{ width: 30, height: 30}} />
            <div style={{display: "flex", flexDirection: "column"}}>
                <p style={{margin: "3px 10px", width: 60, textOverflow: "ellipsis", overflow: "hidden"}}>{Name}</p>
                {/*<p style={{margin: "3px 10px", fontSize: 13, fontStyle: "italic"}}>{Profile}</p>*/}
                <p style={{margin: "0 10px", fontSize: 11, }}>{Role}</p>
            </div>
            {Friend.userId === userId && (
                <Button disabled={true} text label={"me"} severity={"info"}/>
            )}
            {canRemove && Friend.userId !== userId &&
                <Button severity={"success"} onClick={OnclickButton} text rounded style={{width: 30, height: 30}} icon={`pi ${isAdd ? "pi-minus-circle" : "pi-plus-circle"}`}/>
            }
        </div>
    )
}
export default FriendCard
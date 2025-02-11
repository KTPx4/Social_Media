import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";

const FriendCard = ({ isAdd, Friend, Image, Name, ClickAdd, Profile})=>{

    const OnclickButton = ()=>{
        ClickAdd(Friend , isAdd)
    }



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
                <p style={{margin: "0 10px", fontSize: 12, fontStyle: "italic"}}>{Profile}</p>
            </div>
            <Button severity={"success"} onClick={OnclickButton} text rounded style={{width: 30, height: 30}} icon={`pi ${isAdd ? "pi-minus-circle" : "pi-plus-circle"}`}/>
        </div>
    )
}
export default FriendCard
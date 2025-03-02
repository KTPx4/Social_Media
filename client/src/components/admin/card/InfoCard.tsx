import React from "react";

const InfoCard = ({onClick, Title, Number, ImgSrc, Icon}) =>{
    return (
        <div
            onClick={onClick}
            style={{
                width: 250,
                height: 130,
                borderRadius: 20,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "white",
                border: "1px solid #ffffff",
                overflow: "hidden"
            }}>
            <div style={{
                padding: 20,
                width: "100%",
                height: "50%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
                <div style={{
                    padding: "10px 0",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}>
                    <p style={{margin: 0, fontWeight: 600, fontSize: 15}}>{Title}</p>
                    <p className={"text-1"} style={{margin: 0, fontSize: 22,}}>{Number}</p>
                </div>
                <span className={Icon} style={{fontSize: "1.7rem"}}/>
            </div>
            <img style={{width: "100%",}} src={ImgSrc}/>
        </div>
    )
}
export default InfoCard;
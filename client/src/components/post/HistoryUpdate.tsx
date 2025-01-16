// Import React và các thư viện cần thiết
import React, {useContext, useEffect, useState} from "react";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from "primereact/dropdown";
import {Image} from "primereact/image";
import {parseAst} from "vite";
import {Fieldset} from "primereact/fieldset";
import {convertToHoChiMinhTime, toHCMTime} from "../../utils/Convertor.tsx";
import {ThemeContext} from "../../ThemeContext.tsx";

interface HistoryProps {
    visible: boolean;
    onHide: () => void;
    listPost: any;
    toast: any;

}


const HistoryUpdate: React.FC<HistoryProps> = ({ visible, onHide, listPost, toast }) => {
    var token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";

    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const textColor = currentTheme.getText()
    const textHintColor = currentTheme.getHint()
    const captionColor = currentTheme.getCaption()
    const backgroundColor = currentTheme.getBackground()
    const cardColor = currentTheme.getCard()

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleCaption = () => {
        setIsExpanded(!isExpanded);
    };


    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header="History update"
            style={{ width: "500px", margin: 10, background: backgroundColor }}
        >
            <div style={{display: "flex", flexDirection: "column", margin: 5, }}>
                {listPost.map((post : any) =>{
                    return(
                        <Fieldset
                            style={{backgroundColor: cardColor, marginTop: 10}}
                            key={post.id + Date.now()} title={toHCMTime(post.createdAt)}
                                  legend={convertToHoChiMinhTime(post.createdAt) + " ago"} toggleable>

                            {/*content*/}
                            <div className="p-px-3 p-pb-2" style={{marginBottom: 5}}>
                                <p
                                    style={{
                                        whiteSpace: isExpanded ? "normal" : "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        marginBottom: "5px",
                                        color: captionColor
                                    }}
                                >

                                    {post.content}
                                </p>
                                {post.content.length > 50 && (
                                    <button
                                        onClick={toggleCaption}
                                        style={{
                                            margin: 3,
                                            padding: 0,
                                            border: "none",
                                            background: "transparent",
                                            color: textHintColor,
                                            cursor: "pointer",
                                            fontSize: "14px",
                                        }}
                                    >
                                        {isExpanded ? "hide" : "more"}
                                    </button>
                                )}
                            </div>

                            {/*image*/}
                            <div style={{
                                width: "100%",
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", // 4 cột với kích thước bằng nhau
                                gap: "10px", // Khoảng cách giữa các phần tử cả ngang và dọc
                            }}>
                                {post.listMedia.map((media: any) => {
                                    if(media.isDeleted)
                                    {
                                        return (
                                            <div
                                                key={media.id}
                                                style={{
                                                    padding: 50,
                                                    height: "100px",
                                                    backgroundColor: "grey",
                                                    maxWidth: 100,
                                                    objectFit: "cover",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderRadius: 10
                                                }}
                                            >
                                                <p style={{color: "white"}}>Deleted!</p>
                                            </div>
                                        )
                                    }
                                    else {
                                        return (
                                            <div key={media.id} style={{position: "relative", width: "fit-content"}}>
                                                <Image
                                                    className="Img-History"
                                                    preview
                                                    src={`${media.mediaUrl + token}`}
                                                    alt="Media"
                                                    width="100"
                                                    height="100"
                                                    style={{width: "100px", height: "100px", objectFit: "cover", borderRadius: 10}}
                                                />
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </Fieldset>
                    )
                })}
            </div>

        </Dialog>
    );
};

export default HistoryUpdate;

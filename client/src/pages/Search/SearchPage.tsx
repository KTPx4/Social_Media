import {InputText} from "primereact/inputtext";
import React, {useEffect, useState} from "react";
import {InputIcon} from "primereact/inputicon";
import {IconField} from "primereact/iconfield";
import PostCard from "../../components/post/PostCard.tsx";
import {ProgressSpinner} from "primereact/progressspinner";
import apiClient from "../../utils/apiClient.tsx";

const SearchPage = () =>{
    const [listData, setListData] = useState([])
    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(value)
        {

        }
    }, [value]);

    const LoadData = async () =>{
        if(!value.trim() || isLoading) return;
        setIsLoading(true)

        try{
            var rs = await apiClient.get(`/post?search=${value.trim()}`)
            if(rs.status === 200)
            {
                var data= rs.data.data;
                setListData(data)
                setIsLoading(false)
            }
        }
        catch(e){
            setIsLoading(false)

            console.log(e)
        }

    }

    return(
        <div style={{
            padding: 20,
            width: "100%",
            height: "100%",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        }}>
            <IconField>
                <InputIcon className="pi pi-search"> </InputIcon>
                <InputText
                    onKeyDown={(e)=>{
                        if(e.key === "Enter") {
                            LoadData()

                        }
                    }}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search content" style={{width: "100%", backgroundColor: "transparent"}}/>
            </IconField>
            <br/>
            {isLoading && (
                <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="4" fill="transparent"
                                 animationDuration=".5s"/>
            )}

            <br/>
            <div className={"my-2"} style={{
                display:"flex",
                justifyContent:"center",
                flexDirection: "column",
                alignItems: "center"
            }}>
                {listData?.map((post) => {
                    return (
                        <PostCard post={post} isHideComment={false} key={post.id}/>
                    )
                })}
            </div>
        </div>
    )
}

export default SearchPage;
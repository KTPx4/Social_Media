import {Outlet, useNavigate} from "react-router-dom";
import {Avatar} from "primereact/avatar";
import useStore from "../../store/useStore.tsx";
import React, {useEffect, useState} from "react";
import {Button} from "primereact/button";
import {SplitButton} from "primereact/splitbutton";
import "./LayoutAdmin.css"
import {Dialog} from "primereact/dialog";
const LayoutAdmin = () =>{

    const  {myAccount} = useStore()
    const role = myAccount.userRoles[0]
    const navigate = useNavigate();

    const [showLogout, setShowlogout] = useState(false);
    const [titlePage, setTitlePage] = useState("Admin page");


    useEffect(() => {
        var path = location.pathname

        console.log(path)
        switch (path)
        {

            case "/admin/account":
                setTitlePage("Manage Accounts");
                break
            case "/admin/report":
                setTitlePage("Manage Reports");
                break
            case "admin/chart":
                setTitlePage("System information");
                break
            default:
                setTitlePage("Admin page");
                break
        }
    }, []);

    const items = [
        {
            label: 'Social Web',
            icon: <img src={"/vite.png"} style={{width: 20, height: 20,marginRight: 5}}/>,
            command: () =>navigate("/")
        },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: ()=> setShowlogout(true)
        },


    ];
    const HandleLogout = ()=>{
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/")
    }

    const toHome =()=>{
        setTitlePage("Admin page");
        navigate("/admin")
    }

    const toAccount =()=>{
        setTitlePage("Manage Accounts");
        navigate("/admin/account")
    }

    const toReport =()=>{
        setTitlePage("Manage Reports");
        navigate("/admin/report")
    }

    return(
        <div className={"nav-admin"} style={{width: "100%", height: "100vh"}}>
            <Dialog

                visible={showLogout}
                header={"Do you want log out?"}
                onHide={()=> setShowlogout(false)}>
                <div style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <Button onClick={HandleLogout} text severity={"danger"} label={"Yes"}/>
                    <Button onClick={()=>setShowlogout(false)} text severity={"secondary"} label={"No"}/>
                </div>
            </Dialog>
            {/*header top*/}
            <div style={{
                width: "100%",
                height: "10%",
                padding: 5
            }}>
                <div style={{
                    display:"flex",
                    flexDirection:"row",
                    justifyContent: "space-between",
                }}>
                    <div style={{display: "flex", flexDirection:"row", alignItems:"center", justifyContent: "center"}}>
                        <Avatar
                            onClick={()=>navigate("/admin")}
                            shape={"circle"} size={"large"} image={"/vite.png"}
                            style={{
                                marginLeft: 8, marginTop: 5,width: 60, height: 55, objectFit: "cover",

                            }}
                        />
                        <p style={{fontSize: 20, fontWeight: "bold",marginLeft: 10}}>{titlePage}</p>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Avatar size={"large"}
                                shape={"circle"}
                                image={myAccount?.imageUrl}
                                style={{marginLeft: 8, marginTop: 5, width: 50, height: 50, objectFit: "cover"}}/>
                        <div className={"mx-2"}
                             style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <p style={{margin: "0px 0px", fontSize: 18, fontWeight: "bold"}}>{myAccount?.name}</p>
                            <p style={{margin: "0px 0px", fontSize: 14, color: "grey"}}>{role}</p>
                        </div>
                        <SplitButton icon={null} text model={items}/>
                    </div>
                </div>
            </div>

            <div style={{
                width: "100%", height: "90%",
                display: "flex", flexDirection: "row"
            }}>

                {/*nav right*/}
                <div
                    className={"nav-right"}
                    style={{
                    width: "5%", height: "100%",
                    display: "flex", flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "center",
                        padding: "25px 0"
                }}>
                    <Button onClick={toHome} text outlined icon={<i className={"pi pi-home"} style={{fontSize: '1.5rem'}}></i>} severity={"secondary"}/>
                    <Button onClick={toAccount} text outlined icon={<i className={"pi pi-users"} style={{fontSize: '1.5rem'}}></i>} severity={"secondary"}/>
                    <Button onClick={toReport} text outlined icon={<i className={"pi pi-envelope"} style={{fontSize: '1.5rem'}}></i>} severity={"secondary"}/>
                    {/*<Button onClick={toHome} text outlined icon={<i className={"pi pi-chart-bar"} style={{fontSize: '1.5rem'}}></i>} severity={"secondary"}/>*/}
                </div>

                {/*body*/}
                <div style={{
                    width: "95%", height: "100%",
                    backgroundColor: "#eff3f8",
                    borderTopLeftRadius: 30,
                    boxShadow: "inset 0 3px 4px rgba(0, 0, 0, .1)",
                    padding: 20,
                    overflow:"auto"
                }}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
export default LayoutAdmin
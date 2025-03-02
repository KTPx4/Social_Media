import React, {useEffect, useState} from "react";
import {Card} from "primereact/card";
import "./AdminCss.css"
import InfoCard from "../../components/admin/card/InfoCard.tsx";
import apiClient from "../../utils/apiClient.tsx";
import {Dropdown} from "primereact/dropdown";
import { Chart } from 'primereact/chart';
const AdminPage = () =>{
    const [countPost, setCountPost] = useState(0);
    const [countReport, setCountReport] = useState(0);
    const [countAccount, setCountAccount] = useState(0);
    const [countMod, setCountMod] = useState(0);

    //chart
    const [year, setYear] = useState(new Date().getFullYear());
    const [chartData, setChartData] = useState<any>(null);
    const [type , setType] = useState("account");

    useEffect(() => {
        LoadFromDb()
    }, []);

    useEffect(() => {

        loadChartData(type, year);

    }, [year, type]);

    const fetchUserStats = async (type, year) =>{
        try{
            var rs = await apiClient.get(`/admin/${type}?year=${year}`)
            return rs.data.data ?? []
        }
        catch(err){
            console.log(err)
            return []
        }
    }
    const loadChartData = async (type , selectedYear: number) => {

        const data = await fetchUserStats(type, selectedYear);
        const labels = Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`);
        const values = new Array(12).fill(0);

        data.forEach((item: any) => {
            values[item.month - 1] = item.count;
        });

        setChartData({
            labels,
            datasets: [
                {
                    label: `${type} (${selectedYear})`,
                    data: values,
                    backgroundColor: "rgba(54, 162, 235, 0.5)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                },
            ],
        });
    };
    const LoadFromDb = async () =>{
        try{
            var rs = await apiClient.get("/admin")
            var status = rs.status
            if(status === 200)
            {
                var data = rs.data.data
                if(data)
                {
                    setCountPost(data.totalPost)
                    setCountReport(data.totalReport)
                    setCountAccount(data.totalAccount)
                    setCountMod(data.totalMod)
                }
            }
        }
        catch(e){
            console.log(e)
        }
    }
    const clickAccount = () =>{
        setType("account")
    }
    const clickPost = () =>{
        setType("post")

    }
    const clickReport = () =>{
        setType("report")

    }
    const clickMod = () =>{
        setType("mod")

    }

    return(
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            overflow: "auto"
        }}>
            {/*List card*/}
            <div style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
            }}>
                <InfoCard
                    key={"Info-Account"}
                    onClick={clickAccount}
                    Icon={"pi pi-user"}
                    Title={"Accounts"}
                    ImgSrc={"/svg/1.svg"}
                    Number={countAccount}/>

                <InfoCard
                    onClick={clickMod}

                    key={"Info-Mod"}
                    Icon={"pi pi-android"}
                    Title={"Moderator"}
                    ImgSrc={"/svg/2.svg"}
                    Number={countMod}
                />
                <InfoCard
                    onClick={clickPost}
                    key={"Info-Post"}
                    Icon={"pi pi-images"}
                    Title={"Posts"}
                    ImgSrc={"/svg/3.svg"}
                    Number={countPost}
                />
                <InfoCard
                    onClick={clickReport}
                    key={"Info-Report"}
                    Icon={"pi pi-envelope"}
                    Title={"Report"}
                    ImgSrc={"/svg/4.svg"}
                    Number={countReport}
                />

            </div>

            {/*chart*/}
            <div style={{
                marginTop: 20,
                display:"flex",
                flexDirection:"column",
                width: "100%"
            }}>
                <Dropdown
                    value={year}
                    options={[2022, 2023, 2024, 2025].map((y) => ({label: y.toString(), value: y}))}
                    onChange={(e) => setYear(e.value)}
                    placeholder="Select year"
                />
                <Chart type="bar" data={chartData} options={{responsive: true, maintainAspectRatio: false}}/>
            </div>
        </div>
    )
}
export default AdminPage
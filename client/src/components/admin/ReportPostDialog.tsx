import React, {useContext, useState} from "react";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

import {ThemeContext} from "../../ThemeContext.tsx";
import apiClient from "../../utils/apiClient.tsx";

enum TargetTypes
{
    Post = 0, User = 1, Story = 2
}
const ReportPostDialog = ({ postId, visible, onHide, type = TargetTypes.Post }) => {
    // theme
    const themeContext = useContext(ThemeContext);
    // @ts-ignore
    const { currentTheme, changeTheme } = themeContext;
    const textColor = currentTheme.getText()
    const textHintColor = currentTheme.getHint()
    const captionColor = currentTheme.getCaption()
    const keyTheme = currentTheme.getKey()

    const [reportType, setReportType] = useState(null);
    const [reason, setReason] = useState("");

    const reportTypes = [
        { label: "Spam", value: "Spam" },
        { label: "Hate Speech", value: "HateSpeech" },
        { label: "Violence", value: "Violence" },
        { label: "Misinformation", value: "Misinformation" },
        { label: "Other", value: "Other" }
    ];

        const handleSubmit = async () => {
        if (!reportType || !reason.trim()) {
            alert("Please select a reason and provide details.");
            return;
        }

        try {
            const response = await apiClient.post(`/post/${postId}/report`, {
                TargetType: type, // 0 = Post (theo enum trong model)
                TargetId: postId,
                ReportType: reportType,
                Reason: reason
            });
            console.log(response)
            if (response.status === 200 || response.status === 204) {
                alert("Report submitted successfully!");
                onHide(); // Đóng dialog sau khi gửi thành công
            }
        } catch (error) {
            console.error("Error reporting post:", error);
        }
    };

    return (
        <Dialog className={keyTheme} header="Report Post" visible={visible} style={{ width: "40vw" }} onHide={onHide}>
            <div className="p-fluid">
                <label>Reason</label>
                <Dropdown
                    className={"mt-2"}
                    style={{
                    backgroundColor: "transparent"
                }} value={reportType} options={reportTypes} onChange={(e) => setReportType(e.value)} placeholder="Select a reason" />
                <br />
                <label >Details</label>
                <InputTextarea
                    className={"mt-2"}
                    style={{
                    backgroundColor: "transparent"
                }}
                value={reason} onChange={(e) => setReason(e.target.value)} rows={5} placeholder="Provide details..." />

                <Button label="Submit Report" icon="pi pi-check" className="mt-3" onClick={handleSubmit} />
            </div>
        </Dialog>
    );
};

export default ReportPostDialog;

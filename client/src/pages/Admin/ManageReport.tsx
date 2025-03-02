import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown"; // 👉 Thêm Dropdown chọn trạng thái
import apiClient from "../../utils/apiClient";
import { toHCMTime } from "../../utils/Convertor.tsx";
import { useNavigate } from "react-router-dom";

const ManageReport = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null); // 👉 Lưu trạng thái mới
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await apiClient.get("/admin/report/post");
            if (response.status === 200) {
                setReports(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        }
    };

    // 👉 Gửi cập nhật trạng thái lên server
    const updateReportStatus = async () => {
        if (!selectedReport || selectedStatus === null) {
            alert("Please select a status before updating.");
            return;
        }

        try {
            const response = await apiClient.post(`/admin/report/post/${selectedReport.id}`, {
                status: selectedStatus
            });

            if (response.status === 200 || response.status === 204) {
                alert("Report status updated successfully!");

                // ✅ Cập nhật trạng thái trong danh sách (React re-renders)
                setReports((prevReports) =>
                    prevReports.map((r) =>
                        r.id === selectedReport.id ? { ...r, status: selectedStatus } : r
                    )
                );

                setShowDialog(false); // Đóng dialog sau khi cập nhật thành công
            }
        } catch (error) {
            console.error("Error updating report status:", error);
            alert("Failed to update report status.");
        }
    };

    // 👉 Tạo danh sách trạng thái để chọn trong Dropdown
    const statusOptions = [
        { label: "Pending", value: 0 },
        { label: "In Process", value: 1 },
        { label: "Resolved", value: 2 }
    ];

    // 👉 Cột hiển thị trạng thái trong DataTable
    const statusBodyTemplate = (rowData) => {
        const statusColors = {
            0: { label: "Pending", color: "warning" },
            1: { label: "In Process", color: "info" },
            2: { label: "Resolved", color: "success" }
        };

        const { label, color } = statusColors[rowData.status] || { label: "Unknown", color: "secondary" };
        return <Tag value={label} severity={color} />;
    };

    // 👉 Dialog chi tiết báo cáo và cập nhật trạng thái
    const reportDetailDialog = (
        <Dialog header="Report Details" visible={showDialog} style={{ width: "50vw" }} onHide={() => setShowDialog(false)}>
            {selectedReport && (
                <Card title={`Report Type: ${selectedReport.reportType}`}>
                    <p><strong>Target Type:</strong> {selectedReport.targetType === 0 ? "Post" : "User"}</p>
                    <p><strong>Target ID:</strong> {selectedReport.targetId}</p>
                    <p><strong>Reason:</strong> {selectedReport.reason}</p>
                    <p><strong>Status:</strong> {selectedReport.status === 0 ? "Pending" : selectedReport.status === 1 ? "In Process" : "Resolved"}</p>
                    <p><strong>Details:</strong> {selectedReport.details || "No details provided"}</p>
                    <p><strong>Created At:</strong> {toHCMTime(selectedReport.createdAt)}</p>
                    {selectedReport.resolvedAt && <p><strong>Resolved At:</strong> {toHCMTime(selectedReport.resolvedAt)}</p>}

                    <Dropdown
                        value={selectedStatus}
                        options={statusOptions}
                        onChange={(e) => setSelectedStatus(e.value)}
                        placeholder="Select new status"
                        className="mt-2"
                    />

                    <Button

                        label="Update Status" className="mx-2 mt-3 p-button-success" onClick={updateReportStatus} />
                    <Button
                        className={"mx-3"}
                        onClick={()=>{
                            window.open(`/post/${selectedReport.targetId}`, "_blank");
                        }}
                    label={"View post"}/>

                </Card>
            )}
        </Dialog>
    );

    return (
        <div className="card">
            <h2 className="text-center mb-4">Report Management</h2>
            <DataTable value={reports} paginator rows={10} stripedRows responsiveLayout="scroll">
                <Column field="reportType" header="Report Type" sortable />
                <Column field="targetId" header="Target ID" sortable />
                <Column field="reason" header="Reason" sortable />
                <Column field="status" header="Status" body={statusBodyTemplate} sortable />
                <Column field="staffResolveId" header="Handled By" body={(rowData) => rowData.staffResolveId || "Not assigned"} sortable />
                <Column
                    body={(rowData) => (
                        <Button icon="pi pi-eye" className="p-button-text p-button-sm" onClick={() => { setSelectedReport(rowData); setShowDialog(true); setSelectedStatus(rowData.status); }} />
                    )}
                    header="Actions"
                />
            </DataTable>

            {reportDetailDialog}
        </div>
    );
};

export default ManageReport;

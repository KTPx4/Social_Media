import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import axios from "axios";
import apiClient from "../../utils/apiClient.tsx";

const EditUserRoleDialog = ({ userId, visible, onHide, callBack }) => {
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        if (userId) {
            loadRole()
        }
    }, [userId]);
    const loadRole = async() =>{
        await apiClient.get(`/admin/account/${userId}/roles`)
            .then(response => {
                setSelectedRoles(response.data.data);
            })
            .catch(error => {
                console.error("Error fetching roles:", error);
            });
    }

    const handleRoleChange = (role) => {
        let updatedRoles = selectedRoles.includes(role)
            ? selectedRoles.filter(r => r !== role)
            : [...selectedRoles, role];

        // Nếu bỏ chọn cả "mod-account" và "mod-post", cũng bỏ luôn "mod"
        if (!updatedRoles.includes("mod-account") && !updatedRoles.includes("mod-post")) {
            updatedRoles = updatedRoles.filter(r => r !== "mod");
        }

        setSelectedRoles(updatedRoles);
    };

    const handleSave = async () => {
        await apiClient.post(`/admin/account/${userId}/roles`, selectedRoles)
            .then(() => {
                alert("Roles updated successfully");
                callBack(true)
                onHide();
            })
            .catch(error => {
                console.error("Error updating roles:", error);
            });
    };

    return (
        <Dialog visible={visible} header="Edit User Roles" onHide={onHide} style={{ width: "400px" }}>
            <div className="p-field-checkbox my-2">
                <Checkbox className={"mx-2"} inputId="mod-account" value="mod-account"
                          onChange={() => handleRoleChange("mod-account")}
                          checked={selectedRoles.includes("mod-account")} />
                <label htmlFor="mod-account">Moderator - Account</label>
            </div>

            <div className="p-field-checkbox my-2">
                <Checkbox className={"mx-2"} inputId="mod-post" value="mod-post"
                          onChange={() => handleRoleChange("mod-post")}
                          checked={selectedRoles.includes("mod-post")} />
                <label htmlFor="mod-post">Moderator - Post</label>
            </div>

            <div className="p-field-checkbox my-2">
                <Checkbox className={"mx-2"} inputId="mod" value="mod"
                          disabled
                          checked={selectedRoles.includes("mod")} />
                <label htmlFor="mod">Moderator (auto-assigned)</label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                <Button  label="Cancel" onClick={onHide} className="p-button-secondary mx-2" />
                <Button label="Save" onClick={handleSave} className="p-button-primary" />
            </div>
        </Dialog>
    );
};

export default EditUserRoleDialog;

import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import apiClient from "../../utils/apiClient.tsx";
import {SplitButton} from "primereact/splitbutton";
import EditUserRoleDialog from "../../components/admin/EditUserRoleDialog .tsx";
import useStore from "../../store/useStore.tsx";

const ManageAccount = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedType, setSelectedType] = useState("user");
    const [searchText, setSearchText] = useState("");
    const {myAccount} = useStore()
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const openDialog = (userId) => {
        setSelectedUser(userId);
        setShowDialog(true);
    };

    const userTypes = [
        { label: "User", value: "user" },
        { label: "Mod", value: "mod" }
    ];

    useEffect(() => {
        var roles = myAccount.userRoles ?? []
        if(roles && roles.includes("admin")) setIsAdmin(true)

        loadData();
    }, [selectedType]);

    useEffect(() => {
        handleSearch();
    }, [searchText, users]);

    const loadData = async () => {
        try {
            const rs = await apiClient.get(`/admin/account/info?type=${selectedType}`);
            if (rs.status === 200) {
                const data = rs.data.data;
                setUsers(data);
                setFilteredUsers(data);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleSearch = () => {
        const filtered = users?.filter(user =>
            user.name.toLowerCase().includes(searchText.toLowerCase()) ||
            user.userProfile.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

   const imageBodyTemplate = (rowData) => {
        return <Avatar image={rowData.imageUrl} shape="circle" size="large" />;
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center">
                {imageBodyTemplate(rowData)}
                <span className="ml-2">{rowData.name}</span>
            </div>
        );
    };

    const createdAtTemplate = (rowData) => {
        return new Date(rowData.createdAt).toLocaleDateString();
    };

    const statusTemplate = (rowData) => {

        return rowData.isDeleted ? (
            <span className="text-red-500">Ban</span>
        ) : (
            <span className="text-green-500">Active</span>
        );
    };
    const roleTemplate = (rowData) => {
        var roles = rowData.userRoles
        if(!roles || roles.length < 1) roles = ["user"]
        return <span className="text-black-500">{roles.map(e => e + " ")}</span>;
    };

    const HandleBanUser = async(user) =>{
        try{
            var rs = null;
            if(!user.isDeleted)
            {
                rs = await apiClient.post(`/admin/account/${user.id}/ban`)
            }
            else{
                rs = await apiClient.delete(`/admin/account/${user.id}/ban`)
            }
            console.log(rs)
            if(rs.status === 200)
            {
                // @ts-ignore
                setUsers((prev) =>
                    prev.map((u) => (u.id === user.id ? { ...u, isDeleted: !u.isDeleted } : u))
                );
                // @ts-ignore
                setFilteredUsers((prev) =>
                    prev.map((u) => (u.id === user.id ? { ...u, isDeleted: !u.isDeleted } : u))
                );
            }
        }
        catch(err){
            console.log(err);
        }

    }

    const actionTemplate = (rowData) => {
        const items = [ ];

        if( isAdmin  || (myAccount && myAccount.userRoles?.includes("mod-account")))
        {
            items.push( {
                label: rowData.isDeleted ? "UnBan" :'Ban',
                icon: rowData.isDeleted ? "pi pi-unlock": 'pi pi-ban',
                command:()=>HandleBanUser(rowData)
            },)
        }
        if(isAdmin)
        {
            items.push({
                label: 'Select role',
                icon: 'pi pi-android',
                command: () => {
                    openDialog(rowData.id)

                }
            })
        }
        return(
            <SplitButton text dropdownIcon="pi pi-ellipsis-v"  model={items} />
        )
        // <Button icon="pi pi-ellipsis-v" className="p-button-text" onClick={()=>console.log(rowData.id)}/>;
    };
    const callBackEditRole = async (isSuccess) =>{
        if(isSuccess)
        {
            await loadData();
        }
    }
    return (
        <div className="card">
            {selectedUser && (
                <EditUserRoleDialog
                    callBack={callBackEditRole}
                    userId={selectedUser}
                    visible={showDialog}
                    onHide={() => setShowDialog(false)}
                />
            )}

            <div className="flex justify-content-start mb-3">
                <Dropdown value={selectedType} options={userTypes} onChange={(e) => setSelectedType(e.value)} placeholder="Select Type" />
                {/*<Button className="ml-3" label="Create Mod" icon="pi pi-user-plus" />*/}

            </div>
            <InputText
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by name or profile"
                className="my-2 p-inputtext-sm"
            />
            <DataTable value={filteredUsers} paginator rows={8}>
                <Column field="name" header="Name" body={nameBodyTemplate} sortable />
                <Column field="userProfile" header="Profile" sortable />
                <Column field="createdAt" header="Created At" body={createdAtTemplate} sortable />
                <Column field="isDeleted" header="Status" body={statusTemplate} sortable />
                {/*<Column field="role" header="Role" body={roleTemplate} sortable />*/}
                <Column body={actionTemplate} header="Actions" />
            </DataTable>
        </div>
    );
};

export default ManageAccount;

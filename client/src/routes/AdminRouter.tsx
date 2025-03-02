import React, {ReactNode} from "react";
import useAuth from "../hooks/useAuth.tsx";
import {Navigate} from "react-router-dom";


interface AdminRouterProps {
    children: ReactNode; // Định nghĩa kiểu cho `children`
}

const AdminRouter: React.FC<AdminRouterProps> = ({ children }) => {
    const token: string = localStorage.getItem('token')|| sessionStorage.getItem("token") || '';

    // Đảm bảo useAuth trả về đúng kiểu dữ liệu
    const { isAuthenticated, loading,data } = useAuth(token);

    if (loading) {
        return (
            <div className="w-100 d-flex justify-content-center align-items-center">
                loading....
                {/*<Spinner className="d-flex justify-content-center" animation="border" variant="info" />*/}
            </div>
        );
    }

    if(!isAuthenticated && !loading && !data)
    {
        localStorage.removeItem("token")
        sessionStorage.removeItem("token")
        return <Navigate to="/" />
    }
    else{

        var role = data.userRoles ?? []
        if(!role || role.length < 1 || (!role.includes("admin") && !role.includes("mod") && !role.includes("mod-post") && !role.includes("mod-account") ))
        {
            return <Navigate to={"/"} />
        }

        return children
    }
};

export default AdminRouter;

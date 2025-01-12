import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';


interface UserRouterProps {
    children: ReactNode; // Định nghĩa kiểu cho `children`
}

const UserRouter: React.FC<UserRouterProps> = ({ children }) => {
    const token: string = localStorage.getItem('token')|| sessionStorage.getItem("token") || '';

    // Đảm bảo useAuth trả về đúng kiểu dữ liệu
    const { isAuthenticated, loading } = useAuth(token);

    if (loading) {
        return (
            <div className="w-100 d-flex justify-content-center align-items-center">
                loading....
                {/*<Spinner className="d-flex justify-content-center" animation="border" variant="info" />*/}
            </div>
        );
    }
    else{

    }
    // Render component chính hoặc điều hướng
    return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

export default UserRouter;

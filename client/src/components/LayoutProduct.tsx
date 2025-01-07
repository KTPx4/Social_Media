import { Outlet } from "react-router-dom";

const LayoutProduct = () => {
    return (
        <>
            <h3>This is layout for product</h3>

            <Outlet />
        </>
    );
}

export default LayoutProduct;
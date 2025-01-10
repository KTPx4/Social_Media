import { useContext } from "react";
import { userContext } from "../store/UserContext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen flex bg-blue-400">
      <div className="m-auto w-9 flex flex-column justify-center align-items-center bg-white p-8 border-round-2xl gap-4 rounded-lg shadow-lg">
        <i
          className="pi pi-exclamation-circle"
          style={{ fontSize: "8rem", color: "slateblue" }}
        ></i>
        <h4 className="text-2xl m-0">Page Not Found</h4>
        <h1 className="text-6xl m-0">Error 404</h1>
        <p className="mt-4">
          Sorry, the page you are looking for does not exist.
        </p>
        <Button
          label="Login"
          icon="pi pi-user"
          onClick={() => {
            navigate("/");
          }}
        ></Button>
        {/* Add your email confirmation logic here */}
      </div>
    </div>
  );
};

export default NotFoundPage;

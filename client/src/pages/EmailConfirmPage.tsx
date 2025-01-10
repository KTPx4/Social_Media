import { useContext, useEffect } from "react";
import { userContext } from "../store/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import apiClient from "../utils/apiClient";

const EmailConfirmPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const username = queryParams.get("username");
  const token = queryParams.get("token");
  useEffect(() => {
    async function verifyEmail() {
      await apiClient.get("/user/reset", { params: { token, username } });
    }
    verifyEmail();
  }, []);
  return (
    <div className="h-screen w-screen flex bg-blue-400">
      <div className="m-auto w-9 flex flex-column justify-center align-items-center bg-white p-8 border-round-2xl gap-4 rounded-lg shadow-lg">
        <i
          className="pi pi-verified"
          style={{ fontSize: "8rem", color: "slateblue" }}
        ></i>
        <h4 className="text-2xl m-0">Your password have been reset </h4>
        <h1 className="text-6xl m-0">Successfully</h1>
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

export default EmailConfirmPage;

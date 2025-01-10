import { useContext, useEffect, useState } from "react";
import { userContext } from "../store/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import apiClient from "../utils/apiClient";
import { InputText } from "primereact/inputtext";

const EmailConfirmPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const username = queryParams.get("username");
  const token = queryParams.get("token");

  const [passwordError, setPasswordError] = useState("");
  const [NewPass, setPassword] = useState("");

  async function handleResetPassword() {
    let error = "";
    if (!NewPass) {
      error = "This field can not be empty";
    } else if (NewPass.length < 6 || NewPass.length > 30) {
      error = "Password must be between  6 to 30  characters long";
    }
    if (!error) {
      try {
        await apiClient.get("/user/reset", {
          params: { username, token, NewPass },
        });
        navigate("/");
      } catch (err) {
        if (err instanceof Error) {
          error = err.message;
        }
      }
    }
    setPasswordError(error);
  }

  return (
    <div className="h-screen w-screen flex bg-blue-400">
      <div className="m-auto w-9 flex flex-column justify-center align-items-center bg-white p-8 border-round-2xl gap-4 rounded-lg shadow-lg">
        <i
          className="pi pi-key"
          style={{ fontSize: "8rem", color: "slateblue" }}
        ></i>
        <h4 className="text-2xl m-0">Please enter your new NewPass</h4>
        <InputText
          type="NewPass"
          className="p-inputtext-lg w-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && (
          <p className="text-xs text-red-700">{passwordError}</p>
        )}
        <Button
          label="Reset Password"
          icon="pi pi-user"
          onClick={handleResetPassword}
        ></Button>
      </div>
    </div>
  );
};

export default EmailConfirmPage;

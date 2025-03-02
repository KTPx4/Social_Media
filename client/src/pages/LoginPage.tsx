import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import DialogBox from "../components/login/DialogBox";
import apiClient from "../utils/apiClient";
import { userContext } from "../store/UserContext";
import useAuth from "../hooks/useAuth.tsx";
import { Navigate } from "react-router-dom";
const LoginPage = () => {
  // @ts-ignore
  // const { userId, setUserId } = useContext(userContext);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [userInformation, setUserInformation] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
  });
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token") || "";
  const { isAuthenticated } = useAuth(token);

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }
  /*
  useEffect(() => {
    function fetchToken() {
      const sessionToken = sessionStorage.getItem("token");
      const localToken = localStorage.getItem("token");
      if (localToken || sessionToken) {
        // navigate("/home");
      }
    }
    fetchToken();
  }, [navigate]);
*/
  // const [ingredients, setIngredients] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errors = {
      username: "",
      password: "",
    };

    if (!userInformation.username) {
      errors.username = "This field can not be empty";
    }
    if (!userInformation.password) {
      errors.password = "This field can not be empty";
    } else if (
      userInformation.password.length < 5 ||
      userInformation.password.length > 30
    ) {
      errors.password = "Password must be between  5 to 30  characters long";
    }
    const isValid = Object.values(errors).every((e) => e === "");
    if (isValid) {
      try {
        const data = await apiClient.post("/user/login", userInformation);
        // if (rememberMe) {
        //   localStorage.setItem("token", data.data.token);
        // } else {
        //   sessionStorage.setItem("token", data.data.token);
        // }
        localStorage.setItem("token", data.data.token);

        console.log("Set id: ",data.data.data.id)
        // setUserId(data.data.data.id);
        // You can add a success message or navigate to another page here
        window.location.href = "/home";
      } catch (error: unknown) {
        if (error instanceof Error) {
          errors.username = error.message;
          // setFormErrors(errors);
        } else {
          console.log("An unknown error occurred");
        }
      }
    }
    setFormErrors(errors);
  }

  return (
    <>
      {" "}
      <DialogBox setIsVisible={setVisible} visible={visible} />
      <form
          onSubmit={handleSubmit}
          className="h-screen flex flex-column align-items-center justify-content-center  p-4"
      >
        <p
            className="font-italic text-4xl mb-4"
            style={{
              marginLeft: 15,
              fontFamily: "Arizonia, serif",
              fontSize: "40px !important",
              color: "black",
            }}
        >
          Internal
        </p>
        <div className="flex flex-column justify-content-center align-items-center  w-full max-w-xs">
          <InputText
              type="text"
              className="p-inputtext-lg w-3"
              placeholder="Username"
              onChange={(e) => {
                setUserInformation((prevstate) => ({
                  ...prevstate,
                  username: e.target.value,
                }));
              }}
          />
          <p className="text-xs text-red-700">{formErrors.username}</p>

          <InputText
              type="password"
              className="p-inputtext-lg w-3"
              placeholder="Password"
              onChange={(e) => {
                setUserInformation((prevstate) => ({
                  ...prevstate,
                  password: e.target.value,
                }));
              }}
          />
          <p className="text-xs text-red-700">{formErrors.password}</p>
        </div>
        <div className="flex w-3 justify-content-between">
          <div className="flex align-items-center">
            <Checkbox
                inputId="ingredient1"
                value="RememberMe"
                onChange={(e) => {
                  setRememberMe(e.checked);
                }}
                checked={rememberMe}
            />
            <label htmlFor="ingredient1" className="ml-2">
              Remember Me
            </label>
          </div>
          <Button
              label="Forgot password?"
              icon="pi pi-external-link"
              onClick={() => setVisible(true)}
              className="p-button-link border-none"
          />
        </div>
        <div className="flex flex-column justify-content-center align-items-center gap-2 mt-4 w-full max-w-xs">
          <Button
              type="submit"
              className="p-button-secondary w-3 mt-2"
              label="Login"
          />
          <p className=" mt-2">
            Don't have an account{" "}
            <Link to="/register" className="text-blue-500 cursor-pointer">
              Sign up.
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default LoginPage;

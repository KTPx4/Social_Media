import { InputText } from "primereact/inputtext";
import "primeflex/primeflex.css";
import { Button } from "primereact/button";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import { userContext } from "../store/UserContext";

const RegisterPage = () => {
  const { userId, setUserId } = useContext(userContext);
  const navigate = useNavigate();
  const [userInformation, setUserInformation] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    function fetchToken() {
      const sessionToken = sessionStorage.getItem("token");
      const localToken = localStorage.getItem("token");
      if (localToken || sessionToken) {
        navigate("/home");
      }
    }
    fetchToken();
  }, [navigate]);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Validation
    if (!userInformation.username)
      errors.username = "This field can not be empty";
    if (!userInformation.email) {
      errors.email = "This field can not be empty";
    } else if (!userInformation.email.includes("@")) {
      errors.email = "Email must contain an '@' symbol";
    }
    if (!userInformation.password) {
      errors.password = "This field can not be empty";
    } else if (
      userInformation.password.length < 6 ||
      userInformation.password.length > 30
    ) {
      errors.password = "Password must be between  6 to 30  characters long";
    }
    if (!userInformation.confirmPassword) {
      errors.confirmPassword = "This field can not be empty";
    } else if (userInformation.password !== userInformation.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    const isValid = Object.values(errors).every((e) => e === "");
    if (isValid) {
      try {
        const { confirmPassword, ...userData } = userInformation; // Exclude confirmPassword
        const data = await apiClient.post("/user/register", userData);
        sessionStorage.setItem("token", JSON.stringify(data.data.token));
        setUserId(data.data.data.id);
        navigate("/home");
        // You can add a success message or navigate to another page here
      } catch (error: unknown) {
        if (error instanceof Error) {
          errors.email = error.message;
          // setFormErrors(errors);
        } else {
          console.log("An unknown error occurred");
        }
      }
    }
    setFormErrors(errors);
  }

  return (
    <form
      className="h-screen flex flex-column align-items-center justify-content-center  p-4"
      onSubmit={handleSubmit}
    >
      <h1 className="font-italic text-4xl mb-4">Interval</h1>
      <div className="flex flex-column justify-content-center align-items-center w-full max-w-xs">
        <InputText
          type="text"
          className="p-inputtext-lg w-3"
          placeholder="Username"
          onChange={(e) => {
            setUserInformation({
              ...userInformation,
              username: e.target.value,
            });
          }}
        />
        <p className="text-xs text-red-700">{formErrors.username}</p>

        <InputText
          type="email"
          className="p-inputtext-lg w-3"
          placeholder="Email"
          onChange={(e) => {
            setUserInformation({
              ...userInformation,
              email: e.target.value,
            });
          }}
        />
        <p className="text-xs text-red-700">{formErrors.email}</p>

        <InputText
          type="password"
          className="p-inputtext-lg w-3"
          placeholder="Password"
          onChange={(e) => {
            setUserInformation({
              ...userInformation,
              password: e.target.value,
            });
          }}
        />
        <p className="text-xs text-red-700">{formErrors.password}</p>

        <InputText
          type="password"
          className="p-inputtext-lg w-3"
          placeholder="Confirm Password"
          onChange={(e) => {
            setUserInformation({
              ...userInformation,
              confirmPassword: e.target.value,
            });
          }}
        />
        <p className="text-xs text-red-700">{formErrors.confirmPassword}</p>
      </div>

      <div className="flex flex-column justify-content-center align-items-center gap-2 mt-4 w-full max-w-xs">
        <Button
          className="p-button-primary text-center w-3"
          label="Register"
          type="submit"
        />
        <p className="mt-2">
          Already have an account?{" "}
          <Link to="/" className="mt-2 text-blue-500 cursor-pointer">
            Login
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterPage;

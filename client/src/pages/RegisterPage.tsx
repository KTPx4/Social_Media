import { InputText } from "primereact/inputtext";
import "primeflex/primeflex.css";
import { Button } from "primereact/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../utils/apiClient";
const RegisterPage = () => {
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
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    {
      e.preventDefault();
      const errors = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      };
      if (!userInformation.username)
        errors.username = "This field can not be empty";
      if (!userInformation.email) {
        errors.email = "This field can not be empty";
      } else if (!userInformation.email.includes("@")) {
        errors.email = "Email must contain an '@' symbol";
      }
      if (!userInformation.password) {
        errors.password = "This field can not be empty";
      } else if (userInformation.password.length < 6) {
        errors.password =
          "Please enter a valid password. The password is required at least 6 characters";
      }
      if (!userInformation.confirmPassword) {
        errors.confirmPassword = "This field can not be empty";
      } else if (userInformation.password != userInformation.confirmPassword) {
        errors.confirmPassword = "Password does not match";
      }
      const isVaild = Object.values(errors).every((e) => e === "");

      if (isVaild) {
        try {
          const { confirmPassword, ...userData } = userInformation;
          await apiClient.post(
            "https://localhost:7000/api/user/register",
            userData
          );
        } catch (error: unknown) {
          if (error instanceof Error) {
            errors.email = error.message;
            setFormErrors(errors);
          } else {
            console.log("An unknown error occurred");
          }
        }
      }
      // if (isVaild) {
      //   try {
      //     const { confirmPassword, ...userData } = userInformation;
      //     await registerInToUserAccount(userData);
      //     navigation.navigate("/");
      //   } catch (error) {
      //     errors.email = error.message;
      //     setFormErrors(errors);
      //   }
      // }
      setFormErrors(errors);
    }
  }
  return (
    <div className="h-screen flex flex-column align-items-center justify-content-center gap-7 p-4">
      <h1 className="font-italic text-4xl mb-4">Interval</h1>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="flex flex-column justify-content-center align-items-center  w-full max-w-xs">
          <InputText
            type="text"
            className="p-inputtext-lg w-3"
            placeholder="username"
            onChange={(e) => {
              setUserInformation({
                ...userInformation,
                username: e.target.value,
              });
            }}
          />
          <p className="text-xs text-red-700">{formErrors.username}</p>
          <InputText
            type="text"
            className="p-inputtext-lg w-3"
            placeholder="Email"
            onChange={(e) => {
              setUserInformation({ ...userInformation, email: e.target.value });
            }}
          />{" "}
          <p className="text-xs text-red-700 ">{formErrors.email}</p>
          <InputText
            type="text"
            className="p-inputtext-lg w-3"
            placeholder="Password"
            onChange={(e) => {
              setUserInformation({
                ...userInformation,
                password: e.target.value,
              });
            }}
          />
          <p className="text-xs text-red-700 ">{formErrors.password}</p>
          <InputText
            type="text"
            className="p-inputtext-lg w-3"
            placeholder="Confirm  Password"
            onChange={(e) => {
              setUserInformation({
                ...userInformation,
                confirmPassword: e.target.value,
              });
            }}
          />
          <p className="text-xs text-red-700 ">{formErrors.confirmPassword}</p>
        </div>
        <div className="flex flex-column justify-content-center align-items-center gap-2 mt-4 w-full max-w-xs">
          <Button
            className="p-button-primary text-center w-3  "
            label="Login"
            type="submit"
          ></Button>
          <p className=" mt-2">
            Have an account{" "}
            <Link to="/" className=" mt-2 text-blue-500 cursor-pointer">
              Login in.
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
// Have an account ? Login In.
export default RegisterPage;

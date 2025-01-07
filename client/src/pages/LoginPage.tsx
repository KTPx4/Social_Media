import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { useState } from "react";

const LoginPage = () => {
  const [userInformation, setUserInformation] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  // const [errors, setErrors] = useState("");
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  async function handleSubmit(e) {
    {
      e.preventDefault();
      const errors = {
        email: "",
        password: "",
      };

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
      const isVaild = Object.values(errors).every((e) => e === "");
      // if (isVaild) {
      //   try {
      //     const userData = { rememberMe, ...userInformation };
      //     const token = await signInToUserAccount(userData);
      //     if (rememberMe) {
      //       localStorage.setItem("token", JSON.stringify(token));
      //     } else {
      //       sessionStorage.setItem("token", JSON.stringify(token));
      //     }

      //     navigation.navigate("mainPage");
      //   } catch (error) {
      //     errors.email = error.message;
      //     setFormErrors(errors);
      //   }
      // }
      setFormErrors(errors);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="h-screen flex flex-column align-items-center justify-content-center gap-7 p-4"
    >
      <h1 className="font-italic text-4xl mb-4">Interval</h1>
      <div className="flex flex-column justify-content-center align-items-center gap-3 w-full max-w-xs">
        <InputText
          type="text"
          className="p-inputtext-lg w-3"
          placeholder="Username"
          onChange={(e) => {
            setUserInformation((prevstate) => ({
              ...prevstate,
              email: e.target.value,
            }));
          }}
        />
        <p className="text-xs text-red-700 ">{formErrors.email}</p>
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
      </div>
      <p className="text-xs text-red-700 ">{formErrors.password}</p>
      <div className="flex flex-column justify-content-center align-items-center gap-2 mt-4 w-full max-w-xs">
        <Button
          type="submit"
          className="p-button-secondary w-3 mt-2"
          label="Login"
        />
        {/* <Button className="p-button-primary  w-3  ">Login</Button> */}
        <a className=" mt-2 text-blue-500 cursor-pointer">
          Register with Facebook
        </a>
        <p className=" mt-2">
          Don't have an account{" "}
          <Link to="/register" className="text-blue-500 cursor-pointer">
            Sign up.
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginPage;

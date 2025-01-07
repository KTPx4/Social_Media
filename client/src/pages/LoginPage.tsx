import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Checkbox } from "primereact/checkbox";

const LoginPage = () => {
  const [userInformation, setUserInformation] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [checked, setChecked] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  // const [ingredients, setIngredients] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
    const isValid = Object.values(errors).every((e) => e === "");
    setFormErrors(errors);
  }

  // function onIngredientsChange(e: { checked: boolean; value: string }) {
  //   let _ingredients = [...ingredients];

  //   if (e.checked) _ingredients.push(e.value);
  //   else _ingredients.splice(_ingredients.indexOf(e.value), 1);

  //   setIngredients(_ingredients);
  // }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-screen flex flex-column align-items-center justify-content-center  p-4"
    >
      <h1 className="font-italic text-4xl mb-4">Interval</h1>
      <div className="flex flex-column justify-content-center align-items-center  w-full max-w-xs">
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
        <p className="text-xs text-red-700">{formErrors.email}</p>

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
            name="pizza"
            value="Cheese"
            onChange={(e) => setChecked(e.checked)}
            checked={checked}
          />
          <label htmlFor="ingredient1" className="ml-2">
            Remember Me
          </label>
        </div>
        <Link className="text-blue-500 cursor-pointer">Forgot password?</Link>
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
  );
};

export default LoginPage;

import { useContext } from "react";
import { userContext } from "../store/UserContext";

const MainPage = () => {
  const { userId, setUserId } = useContext(userContext);
  return (
    <>
      <h1>{userId}</h1>
    </>
  );
};

export default MainPage;

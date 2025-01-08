import { createContext, useState } from "react";

interface UserContextProps {
  userId: string | null;
  setUserId: (id: string | null) => void;
}

export const userContext = createContext<UserContextProps | undefined>(
  undefined
);

export default function UserContextProvider({ children }) {
  const [userId, setUserId] = useState("");
  const ctxUserValue = {
    userId,
    setUserId,
  };
  return (
    <userContext.Provider value={ctxUserValue}>{children}</userContext.Provider>
  );
}

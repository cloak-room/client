import React, { useContext, useState } from "react";

interface ContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
}

const defaultContext = { user: null, setUser: () => {} };

const UserContext = React.createContext<ContextProps>(defaultContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  let userStorage = window.localStorage.getItem("user");
  const savedUser: User = userStorage ? JSON.parse(userStorage) : null;
  const [user, setUser] = useState<User | null>(savedUser ?? null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserCtx = () => useContext(UserContext);

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "./Types";
import { ToastContainer } from "react-toastify";
import { getUser } from "@/api/user";
import Loader from "@/components/elements/Loader";

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["jwt-user"],
    queryFn: () => getUser(),
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (typeof data === "object") setUser(data);
  }, [data]);

  return isPending ? (
    <Loader />
  ) : (
    <AppContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
      <ToastContainer />
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

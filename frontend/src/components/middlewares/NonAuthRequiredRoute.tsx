import { useAppContext } from "@/lib/AppProvider";
import React from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface NonAuthRequiredRouteProps {
  children: ReactNode;
}

const NonAuthRequiredRoute: React.FC<NonAuthRequiredRouteProps> = ({
  children,
}) => {
  const { user } = useAppContext();
  const location = useLocation();

  if (user) {
    return (
      <Navigate
        to="/dashboard"
        state={{ from: location.pathname }}
        replace={true}
      />
    );
  }

  return <>{children}</>;
};

export default NonAuthRequiredRoute;

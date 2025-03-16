import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../firebase/AuthProvider";

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { user } = useContext(AuthContext); 
  const [roles, setRoles] = useState({ isMember: false, isModerator: false, isAdmin: false });

  useEffect(() => {
    if (user) {
      fetch("https://tech-prod-server.vercel.app/users")
        .then((res) => res.json())
        .then((data) => {
          const foundUser = data.find((u) => u.email === user.email);
          if (foundUser) {
            setRoles({
              isMember: foundUser.isMember || false,
              isModerator: foundUser.isModerator || false,
              isAdmin: foundUser.isAdmin || false,
            });
          }
        })
        .catch((err) => console.error("Failed to fetch user roles:", err));
    }
  }, [user]);

  return <RoleContext.Provider value={roles}>{children}</RoleContext.Provider>;
};

export const useRoles = () => useContext(RoleContext);

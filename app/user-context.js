import { createContext, useContext } from "react";
import { User } from "./lib/auth/user.service";

export const UserContext = createContext(User.ANONYMOUS);

export function useUserContext() {
  return useContext(UserContext);
}

import { useUserContext } from "@/app/user-context";
import Login from "./login";
import Logout from "./logout";

export default function Authentication({ onLogin }) {
  const user = useUserContext();

  return (
    <span>
      {!user.isAuthenticated ? (
        <Login onLogin={onLogin}></Login>
      ) : (
        <Logout></Logout>
      )}
    </span>
  );
}

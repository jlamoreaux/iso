import { redirect } from "react-router-dom";
import { logout } from "../services/api";

const logoutLoader = async () => {
  await logout();
  return redirect("/");
};

export default logoutLoader;

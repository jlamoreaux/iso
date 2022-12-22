import React, { useState } from "react";
import { logout } from "../../services/api";
import { redirect } from "react-router-dom";

const Logout: React.FC = () => {
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);
  return isLoggedOut ? redirect("/") : <p>Logging out...</p>;
};

export default Logout;

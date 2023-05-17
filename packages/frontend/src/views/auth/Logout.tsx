import React, { useState } from "react";
import { logout } from "../../services/api.ts";

const Logout = () => {
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);
  return <p>Logging out...</p>;
};

export default Logout;

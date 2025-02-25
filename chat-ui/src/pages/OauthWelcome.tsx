import { UserInterface } from "@/Interfaces/types";
import { useAuth } from "@/store/AuthContext";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OauthWelcome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const userInfo = query.get("user");
    console.log(token);
    console.log(userInfo);
    if (token && userInfo) {
      const user = JSON.parse(userInfo) as UserInterface;
      console.log(token);
      console.log(user);

      login({ user, token });
      navigate("/chat", { replace: true });
    }
  }, []);
  return <div>Welcome! Redirecting...</div>;
};

export default OauthWelcome;

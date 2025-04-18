import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const navigate = useNavigate();
  const checkAuth = () => {
    const creds = localStorage.getItem("basicCreds");
    if (!creds) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const logout = () => {
    localStorage.removeItem("basicCreds");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    navigate("/login");
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { checkAuth, logout };
};

export default useAuth;

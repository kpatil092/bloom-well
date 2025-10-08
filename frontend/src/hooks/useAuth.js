import { useSelector } from "react-redux";

export const useAuth = () => {
  const user = useSelector((s) => s.auth.user);
  return { user, isAuthenticated: !!user };
};

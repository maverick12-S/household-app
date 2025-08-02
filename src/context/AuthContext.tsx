import { createContext, ReactNode, useEffect, useState } from "react";
import { getToken, getUserEmail, initKeycloak } from "../auth/keycloak";

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | undefined;
  setIsAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: unknown;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<unknown>(null);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const setupLogin = async () => {
      const authenticated = await initKeycloak();
      const token = getToken();
      setAccessToken(token);
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setUserInfo(getUserEmail());
      }
      setIsAuthLoading(false);
    };
    setupLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        setIsAuthLoading,
        userInfo,
      }}
    >
      {isAuthLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

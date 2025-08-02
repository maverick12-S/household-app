import Keycloak from 'keycloak-js';
import { redirect } from 'react-router-dom';

const keycloak = new Keycloak({
  url: 'http://localhost:8180/',
  realm: 'household',
  clientId: 'household-app',
});


export const initKeycloak = async (): Promise<boolean> => {
  try {
    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    });
    return authenticated;
  } catch (error) {
    console.error('Keycloak init error:', error);
    return false;
  }
};

export const login = () => keycloak.login();
export const logout = () => keycloak.logout({ redirectUri: window.location.origin });
export const accountManagement = () => keycloak.accountManagement();
export const getToken = () => keycloak.token;
export const getUserEmail = () => (keycloak.tokenParsed as any)?.email;



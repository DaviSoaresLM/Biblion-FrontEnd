// Pequeno helper para armazenar token e dados de usuário na sessionStorage
const TOKEN_KEY = 'biblion_token';
const USER_KEY = 'biblion_user';

export const setToken = (token) => {
  try {
    if (token == null) {
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  } catch (e) {
    // ignore
  }
};

export const getToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

export const setUser = (user) => {
  try {
    if (!user) sessionStorage.removeItem(USER_KEY);
    else sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {}
};

export const getUser = () => {
  try {
    const v = sessionStorage.getItem(USER_KEY);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    return null;
  }
};

export const clearAuth = () => {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch (e) {}
};

export default { setToken, getToken, setUser, getUser, clearAuth };

export const authenticateUser = (token) => {
  localStorage.setItem('token', token);
};

export const deauthenticateUser = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const clearAll = () => {
  localStorage.clear();
};

import http from './http.js';

import { getCsrfToken } from './csrfService';

const API_REGISTER_URL = './user/register';
const API_LOGIN_URL = './user/login';
const API_LOGOUT_URL = './user/logout';
const API_GET_USERS_URL = '/user/users';

export const register = async (data) => {
  try {
    if (process.env.REACT_ENV === 'production') {
      await getCsrfToken();
    }
    return await http.post(`${API_REGISTER_URL}`, data);
  } catch (err) {
    return err.response;
  }
};

export const getUserInfo = async () => {
  try {
    return await http.get('/user/me');
  } catch (err) {
    return err.reponse;
  }
};

export const login = async (data) => {
  console.log(process.env.REACT_ENV)
  try {
    if (process.env.REACT_ENV === 'production') {
      await getCsrfToken();
    }
    return await http.post(`${API_LOGIN_URL}`, data);
  } catch (err) {
    return err.response;
  }
};

export const logout = async () => {
  try {
    if (process.env.REACT_ENV === 'production') {
      await getCsrfToken();
    }
    return await http.post(`${API_LOGOUT_URL}`);
  } catch (err) {
    return err.response;
  }
};

export const getUsers = async () => {
  try {
    return await http.get(`${API_GET_USERS_URL}`);
  } catch (err) {
    return err.response;
  }
};

export default { register, getUserInfo, logout, getUsers, login };

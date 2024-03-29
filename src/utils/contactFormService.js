import http from './http.js';

import { getCsrfToken } from './csrfService';

const API_FORM = '/contact';

export const submitForm = async (data) => {
  try {
    if (process.env.REACT_ENV === 'production') {
      await getCsrfToken();
    }
    return await http.post(`${API_FORM}`, data);
  } catch (err) {
    return err.response;
  }
};

export const listForms = async () => {
  try {
    return await http.get(`${API_FORM}`);
  } catch (err) {
    return err.response;
  }
};

export const deleteForm = async (id) => {
  try {
    return await http.delete(`${API_FORM}/delete/${id}`);
  } catch (err) {
    return err.response;
  }
};

export default {
  submitForm,
  listForms,
  deleteForm,
};

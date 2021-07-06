import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000';

export const loginRequest = async (data) => {
  console.log(data);
  const url = baseUrl + '/login';
  const loginBody = {
    email: data.email,
    password: data.password,
  };
  try {
    const res = await axios.post(url, loginBody, {
      headers: {
        accept: 'application/json',
        'content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

export const registerRequest = async (email, password) => {
  const url = baseUrl + '/login';
  const loginBody = {
    email: email,
    password: password,
  };
  try {
    const res = await axios.post(url, loginBody, {
      headers: {
        'content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

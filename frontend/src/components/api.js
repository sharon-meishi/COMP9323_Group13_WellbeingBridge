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
    return [res.status, res.data];
  } catch (error) {
    return [error.response.status,error.response.data.message];
  }
};

export const registerRequest = async (data) => {
  const url = baseUrl + '/signup/user';
  const signupBody = {
    nickname: data.nickname,
    email: data.email,
    password: data.nickname
  };
  try {
    const res = await axios.post(url, signupBody, {
      headers: {
        'content-Type': 'application/json',
      },
    });
    return [res.status, res.data];
  } catch (error) {
    return [error.response.status,error.response.data.message];
  }
};

export const organizationApplyRequest = async(data) => {
  const url = baseUrl + '/signup/organization'
  const applyBody = {
    organizationName: data.OrganizationName,
    email: data.Email,
    password: data.Password,
    organizationType: data.OrganizationType,
    contact: data.Contact,
    introduction:data.OrganizationIntroduction,
  }
  try {
    const res = await axios.post(url, applyBody, {
      headers: {
        'content-Type': 'application/json',
      },
    });
    return [res.status, res.data];
  } catch (error) {
    console.log(error)
    return [error.response.status,error.response.data.message];
  }
}

export const getPopularEventId = async (data) => {
  console.log(data);
  const url = baseUrl + '/popular/events';
  try {
    const res = await axios.get(url, {
      headers: {
        accept: 'application/json',
        'content-Type': 'application/json',
      },
    });
    return [res.status, res.data];
  } catch (error) {
    return [error.response.status,error.response.data.message];
  }
};

export const getEventSummary = async (eventId) => {
  console.log(eventId)
  const url = baseUrl + `/event/${eventId}/summary`;
  try {
    const res = await axios.get(url, {
      headers: {
        accept: 'application/json',
        'content-Type': 'application/json',
      },
    });
    return [res.status, res.data];
  } catch (error) {
    return [error.response.status,error.response.data.message];
  }
};

export const getEventDetail = async (data) => {
  console.log(data);
  const url = baseUrl + `/event/${data[0]}`;
  try {
    const res = await axios.get(url, {
      headers: {
        accept: 'application/json',
        'content-Type': 'application/json',
      },
    });
    return [res.status, res.data];
  } catch (error) {
    return [error.response.status,error.response.data.message];
  }
};

export const likeEvent = async (data) => {
  console.log(data);
  const url = baseUrl + `/event/${data[1]}/favourite`;
  try {
    const res = await axios.put(url, {
      headers: {
        accept: 'application/json',
        'content-Type': 'application/json',
        'token':data[0],
        'eventid':data[1],
      },
    });
    return [res.status, res.data];
  } catch (error) {
    return [error.response.status,error.response.data.message];
  }
};
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
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const registerRequest = async (data) => {
  const url = baseUrl + '/signup/user';
  const signupBody = {
    nickname: data.nickname,
    email: data.email,
    password: data.password,
  };
  try {
    const res = await axios.post(url, signupBody, {
      headers: {
        'content-Type': 'application/json',
      },
    });
    return [res.status, res.data];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const organizationApplyRequest = async (data) => {
  const url = baseUrl + '/signup/organization';
  const applyBody = {
    organizationName: data.OrganizationName,
    email: data.Email,
    password: data.Password,
    organizationType: data.OrganizationType,
    contact: data.Contact,
    introduction: data.OrganizationIntroduction,
  };
  try {
    const res = await axios.post(url, applyBody, {
      headers: {
        'content-Type': 'application/json',
      },
    });
    return [res.status, res.data];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const createEventRequest = async (uploadBody) => {
  const url = baseUrl + '/event';
  const headers = {
    Authorization: `${sessionStorage.getItem('token')}`,
    'content-Type': 'application/json',
  };
  try {
    const res = await axios.post(url, uploadBody, {
      headers: headers,
    });
    return [res.status, res.data];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const getEventSummary = async (eventId, dataOnly) => {
  const url = baseUrl + `/event/${eventId}/summary`;
  let headers = {};
  if (sessionStorage.getItem('token')) {
    headers = {
      accept: 'application/json',
      Authorization: `${sessionStorage.getItem('token')}`,
      'content-Type': 'application/json',
    };
  } else {
    headers = {
      accept: 'application/json',
      'content-Type': 'application/json',
    };
  }
  try {
    const res = await axios.get(url, {
      headers: headers,
    });
    if (dataOnly){
      return res.data
    }else{
      return [res.status, res.data];
    }
  } catch (error) {
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const getEventDetails = async (eventId) => {
  const url = baseUrl + `/event/${eventId}`;
  let headers = {};
  if (sessionStorage.getItem('token')) {
    console.log(`token included:${sessionStorage.getItem('token')}`);
    headers = {
      accept: 'application/json',
      Authorization: `${sessionStorage.getItem('token')}`,
      'content-Type': 'application/json',
    };
  } else {
    headers = {
      accept: 'application/json',
      'content-Type': 'application/json',
    };
  }
  try {
    const res = await axios.get(url, {
      headers: headers,
    });
    return [res.status, res.data];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const updateEventDetails = async (eventId, uploadBody) => {
  const url = baseUrl + `/event/${eventId}`;
  const headers = {
    Authorization: `${sessionStorage.getItem('token')}`,
    'content-Type': 'application/json',
  };
  try {
    const res = await axios.put(url, uploadBody, {
      headers: headers,
    });
    return [res.status, ''];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const getPopularEventId = async () => {
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
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const likeEvent = async (data) => {
  console.log(data);
  const url = baseUrl + `/event/${data}/favourite`;
  try {
    const res = await axios.put(
      url,
      {},
      {
        headers: {
          accept: 'application/json',
          'content-Type': 'application/json',
          Authorization: `${sessionStorage.getItem('token')}`,
        },
      }
    );

    return [res.status, res.data];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const unlikeEvent = async (data) => {
  console.log(data);
  const url = baseUrl + `/event/${data}/unfavourite`;
  try {
    const res = await axios.put(
      url,
      {},
      {
        headers: {
          accept: 'application/json',
          'content-Type': 'application/json',
          Authorization: `${sessionStorage.getItem('token')}`,
        },
      }
    );

    return [res.status, res.data];
  } catch (error) {
    return [error.response.status, error.response.data.message];
  }
};

export const bookEvent = async (data) => {
  console.log(data);
  const url = baseUrl + `/event/${data}/book`;
  try {
    const res = await axios.put(
      url,
      {},
      {
        headers: {
          accept: 'application/json',
          'content-Type': 'application/json',
          Authorization: `${sessionStorage.getItem('token')}`,
        },
      }
    );

    return [res.status, res.data];
  } catch (error) {
    return [error.response.status, error.response.data.message];
  }
};

export const unbookEvent = async (data) => {
  console.log(data);
  const url = baseUrl + `/event/${data}/unbook`;
  try {
    const res = await axios.put(
      url,
      {},
      {
        headers: {
          accept: 'application/json',
          'content-Type': 'application/json',
          Authorization: `${sessionStorage.getItem('token')}`,
        },
      }
    );

    return [res.status, res.data];
  } catch (error) {
    return [error.response.status, error.response.data.message];
  }
};
export const getUserProfile = async () => {
  const url = baseUrl + '/user/profile';
  console.log(sessionStorage.getItem('token'));
  const headers = {
    Authorization: `${sessionStorage.getItem('token')}`,
    'content-Type': 'application/json',
  };
  try {
    const res = await axios.get(url, {
      headers: headers,
    });
    return [res.status, res.data];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const updateUserProfile = async (updateBody) => {
  const url = baseUrl + '/user/profile';
  const headers = {
    Authorization: `${sessionStorage.getItem('token')}`,
    'content-Type': 'application/json',
  };
  try {
    const res = await axios.put(url, updateBody, {
      headers: headers,
    });
    return [res.status, ''];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const getOrganizationProfile = async (oId) => {
  const url = baseUrl + `/organization/profile/${oId}`;
  const headers = {
    Authorization: `${sessionStorage.getItem('token')}`,
    'content-Type': 'application/json',
  };
  try {
    const res = await axios.get(url, {
      headers: headers,
    });
    return [res.status, res.data];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const updateOrganizationProfile = async (oId, updateBody) => {
  const url = baseUrl + `/organization/profile/${oId}`;
  const headers = {
    Authorization: `${sessionStorage.getItem('token')}`,
    'content-Type': 'application/json',
  };
  try {
    const res = await axios.put(url, updateBody, {
      headers: headers,
    });
    return [res.status, ''];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const getOrganizationDetails = async (oId) => {
  const url = baseUrl + `/organization/${oId}`;
  console.log(sessionStorage.getItem('token'));
  let headers = {};
  if (sessionStorage.getItem('token')) {
    headers = {
      Authorization: `${sessionStorage.getItem('token')}`,
      'content-Type': 'application/json',
    };
  } else {
    headers = {
      'content-Type': 'application/json',
    };
  }
  try {
    const res = await axios.get(url, {
      headers: headers,
    });
    return [res.status, res.data];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const postComment = async (eventId, comment) => {
  const url = baseUrl + `/event/${eventId}/comment`;
  const headers = {
    Authorization: `${sessionStorage.getItem('token')}`,
    'content-Type': 'application/json',
  };
  const commentBody = {
    comment: comment,
  };
  try {
    const res = await axios.post(url, commentBody, {
      headers: headers,
    });
    return [res.status, ''];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const updateComment = async (eventId, comment, commentId) => {
  const url = baseUrl + `/event/${eventId}/comment/${commentId}`;
  const headers = {
    Authorization: `${sessionStorage.getItem('token')}`,
    'content-Type': 'application/json',
  };
  const commentBody = {
    comment: comment,
  };
  try {
    const res = await axios.put(url, commentBody, {
      headers: headers,
    });
    return [res.status, ''];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const deleteComment = async (eventId, commentId) => {
  const url = baseUrl + `/event/${eventId}/comment/${commentId}`;
  const headers = {
    Authorization: `${sessionStorage.getItem('token')}`,
    'content-Type': 'application/json',
  };
  try {
    const res = await axios.delete(url, {
      headers: headers,
    });
    return [res.status, ''];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const updateAnswer = async (eventId, commentId, answer) => {
  const url = baseUrl + `/event/${eventId}/comment/${commentId}/answer`;
  const headers = {
    Authorization: `${sessionStorage.getItem('token')}`,
    'content-Type': 'application/json',
  };
  const answerBody = {
    answer: answer,
  };
  try {
    const res = await axios.put(url, answerBody, {
      headers: headers,
    });
    return [res.status, ''];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const deleteEvent = async (eventId) => {
  console.log('delete')
  const url = baseUrl + `/event/${eventId}/summary`;
  const headers = {
    Authorization: `${sessionStorage.getItem('token')}`,
    'content-Type': 'application/json',
  };
  try {
    const res = await axios.delete(url, {
      headers: headers,
    });
    return [res.status, ''];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const updateOrgPage = async (oId, uploadBody) => {
  const url = baseUrl + `/organization/${oId}`;
  const headers = {
    Authorization: `${sessionStorage.getItem('token')}`,
    'content-Type': 'application/json',
  };
  try {
    const res = await axios.put(url, uploadBody, {
      headers: headers,
    });
    return [res.status, ''];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const searchOrganization= async (keyword,typeList) => {
  let url;
  if (keyword && typeof typeList !== 'object'){
    url = baseUrl + `/search/organization?name=${keyword}&type=${typeList}`;
  }else if (keyword){
    url = baseUrl + `/search/organization?name=${keyword}`;
  }else{
    url = baseUrl + `/search/organization?type=${typeList}`;
  }
  try {
    const res = await axios.get(url,{
      headers: {
        accept: 'application/json',
        'content-Type': 'application/json',
      },
    });
    return [res.status, res.data];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const getOrgSummary= async (oid) => {
  const url = baseUrl + `/organization/${oid}/summary`;
  try {
    const res = await axios.get(url,{
      headers: {
        accept: 'application/json',
        'content-Type': 'application/json',
      },
    });
    return [res.status, res.data];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};

export const searchEvent= async (data) => {
  const url = baseUrl + `/search/event${data}`;
  try {
    const res = await axios.get(url,{
      headers: {
        accept: 'application/json',
        'content-Type': 'application/json',
      },
    });
    return [res.status, res.data];
  } catch (error) {
    console.log(error);
    if (error.response) {
      return [error.response.status, error.response.data.message];
    } else {
      return [error, ''];
    }
  }
};
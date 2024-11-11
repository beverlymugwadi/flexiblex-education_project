const axios = require('axios');
const API_URL = process.env.API_URL;

const flexibleXAPICall = async (endpoint, method, data, token) => {
  try {
    const response = await axios({
      url: `${API_URL}/${endpoint}`,
      method: method,
      data: data,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

module.exports = flexibleXAPICall;
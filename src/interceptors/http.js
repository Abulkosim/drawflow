import axios from 'axios';

const http = axios.create({
  baseURL: 'https://bot-platon.platon.uz/services/platon-core/api/'
});

http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {

    }
    return Promise.reject(error);
  }
)

export default http;

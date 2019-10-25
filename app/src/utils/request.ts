import axios from 'axios';
import { Message, MessageBox } from 'element-ui';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000,
  // withCredentials: true // send cookies when cross-domain requests
});

// Request interceptors
service.interceptors.request.use(
  config => config,
  error => {
    Promise.reject(error);
  }
);

// Response interceptors
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code && res.code !== 200 && res.code !== 201) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      });
      if (res.code === 500) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
          }
        ).then(() => {
          window.location.assign('/logout');
        });
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return response.data;
    }
  },
  error => {
    console.log(error);
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;

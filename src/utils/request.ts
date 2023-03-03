import axios from 'axios';
import { ElMessage } from 'element-plus';
const req = axios.create({
  withCredentials: true,
  timeout: 10000,
  baseURL: 'http://127.0.0.1:3001',
});

req.interceptors.response.use(
  (res) => {
    if (res.status >= 200 && res.status < 300) {
      return res.data;
    }

    return res;
  },
  (err) => {
    console.log('err: ', err);

    if (err.message) {
      ElMessage({
        message: err.message,
        type: 'error',
      });
    }
    return Promise.reject(err);
  }
);

export function get(url: string, params?: any) {
  return req.get(url, { params });
}

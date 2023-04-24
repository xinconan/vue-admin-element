import axios, { AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
const req = axios.create({
  withCredentials: true,
  timeout: 10000,
  baseURL: import.meta.env.PROD
    ? 'https://x-nest.vercal.app'
    : 'http://127.0.0.1:3001',
});

req.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.status >= 200 && res.status < 300) {
      return res.data;
    }

    return Promise.reject(res);
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

export function get<T>(url: string, params?: any): Promise<T> {
  return req.get(url, { params });
}

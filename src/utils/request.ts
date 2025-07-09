import axios, { type AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
const req = axios.create({
  withCredentials: true,
  timeout: 30000,
  baseURL: import.meta.env.PROD
    ? 'https://x-nest.vercel.app'
    : 'http://127.0.0.1:3001',
});

req.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.status >= 200 && res.status < 300) {
      return res.data.data;
    }

    return Promise.reject(res);
  },
  (err) => {
    console.log('err: ', err);
    let msg = err.message;
    if (err.response?.data?.message) {
      msg = err.response.data.message;
    }

    ElMessage({
      message: msg,
      type: 'error',
    });
    return Promise.reject(err);
  }
);

export function get<T>(url: string, params?: any): Promise<T> {
  return req.get(url, { params });
}

export function post<T>(url: string, data?: any): Promise<T> {
  return req.post(url, data);
}

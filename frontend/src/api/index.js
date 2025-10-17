import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001',
});

API.interceptors.request.use((req) => {
  const info = localStorage.getItem('userInfo');
  if (info) {
    const token = JSON.parse(info)?.token;
    if (token) req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const fetchCourses = () => API.get('/api/courses');
export const createCourse = (newCourse) => API.post('/api/courses', newCourse);

export default API;

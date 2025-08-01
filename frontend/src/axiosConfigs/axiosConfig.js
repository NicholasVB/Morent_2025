import axios from "axios";

const is_production = process.env.REACT_APP_IS_PRODUCTION === 'true';
const local_url = process.env.REACT_APP_LOCAL_URL;
const production_url = process.env.REACT_APP_PRODUCTION_URL;

console.log("is_production:", is_production);
console.log("local_url:", local_url);
console.log("production_url:", production_url);
console.log("baseURL:", is_production ? production_url : local_url);

const instance = axios.create({
    baseURL: is_production ? production_url : local_url,
    // withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const access = window.localStorage.getItem("access");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Обработка ответов, обновление токенов
instance.interceptors.response.use(
  (response) => {
    if (response.data.refresh && response.data.access) {
      window.localStorage.setItem("refresh", response.data.refresh);
      window.localStorage.setItem("access", response.data.access);
    }
    return response;
  },
  (error) => {
    const message = error.response?.data?.detail;

    if (message === "Invalid token.") {
      window.localStorage.removeItem("access");
      window.localStorage.removeItem("refresh");
      // Можно редиректить на логин:
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default instance;
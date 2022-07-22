import axios from "axios";

const baseUrl = `${process.env.REACT_APP_SERVICE_URL}/v1/`;
console.log(baseUrl);
axios.defaults.baseURL = baseUrl;

axios.interceptors.request.use(
  (config) => {
    if (localStorage.getItem("token")) {
      config.headers["Authorization"] = `Bearer ${localStorage.getItem(
        "token"
      )}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.clear();
      alert("You are not authorized");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default axios;

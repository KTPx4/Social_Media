import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7000/api",
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.response) {
      throw new Error(error.response.data.message);
      // switch (error.response.status) {
      //   case 400:
      //     throw new Error("Username is exists");
      //   case 401:
      //     throw new Error("Unauthorized access - please log in.");
      //   case 403:
      //     throw new Error(
      //       "Forbidden - you do not have permission to access this resource."
      //     );
      //   default:
      //     throw error;
      // }
    } else {
      throw error;
    }
  }
);
export default apiClient;

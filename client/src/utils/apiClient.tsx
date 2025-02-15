import axios from "axios";

var urlServer =  import.meta.env.VITE_SERVER_URL || "https://localhost:7000";

const apiClient = axios.create({
  baseURL: `${urlServer}/api`,
  timeout: 100000,
});

apiClient.interceptors.request.use(
  (config) => {
    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("token");
    const token = localToken || sessionToken;
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
        console.log(error)
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

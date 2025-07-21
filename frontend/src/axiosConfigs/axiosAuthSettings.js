import axios from "axios";

const instance = axios.create({
	// baseURL: "https://morent-backend-xavm.onrender.com",
	baseURL: "http://127.0.0.1:8000/",
});

instance.interceptors.request.use((config) => {
	if (window.localStorage.getItem("access")) {
		config.headers.Authorization = `Bearer ${window.localStorage.getItem("access")}`;
		// config.headers.Authorization = window.localStorage.getItem("token");
	}
	// if (config.data.username != "-" && config.data.password != "-") {
	// 	window.localStorage.setItem("username", config.data.username);
	// 	window.localStorage.setItem("password", config.data.password);
	// }
	// config.headers.Authorization = window.localStorage.getItem("token");
	return config;
});

instance.interceptors.response.use(
	(response) => {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		window.localStorage.setItem("refresh", response.data.refresh);
		window.localStorage.setItem("access", response.data.access);
		return response;
	},
	(error) => {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		console.log("error in interseprors response ", error);
		if (error.response.data.detail === "Invalid token.") {
			window.localStorage.removeItem("token");
		}
		return Promise.reject(error);
	}
);

export default instance;

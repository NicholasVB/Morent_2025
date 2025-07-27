import axios from "axios";

const instance = axios.create({
	// baseURL: "https://morent2025.onrender.com",
	baseURL: "http://127.0.0.1:8000/",
});

instance.interceptors.request.use((config) => {
	if (window.localStorage.getItem("access")) {
		config.headers.Authorization = `Bearer ${window.localStorage.getItem("access")}`;
		// config.headers.Authorization = window.localStorage.getItem("token");
	}
	return config;
});

export default instance;

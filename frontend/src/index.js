import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.scss";
import "./style.scss";
// import "./index.scss";
import App from "./App";
import { ScrollToTop } from "./components";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<>
		<BrowserRouter>
			<Provider store={store}>
				<ScrollToTop/>
				<App />
			</Provider>
		</BrowserRouter>
	</>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

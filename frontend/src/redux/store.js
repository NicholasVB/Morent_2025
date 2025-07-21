import { configureStore } from "@reduxjs/toolkit";
import carList from "./slices/carList";
import carFullInfo from "./slices/carFullInfo";
import AuthReducer from "./slices/auth";
// import RegistrationReducer from "./slices/register";
import userInfoReducer from "./slices/personalFullInfo";

export default configureStore({
	reducer: {
		carssList: carList,
		carInfo: carFullInfo,
		auth: AuthReducer,
		// register: RegistrationReducer,
		userInfo: userInfoReducer,
	},
});

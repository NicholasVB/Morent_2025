import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axiosConfigs/axiosAuthSettings";

export const fetchRegistration = createAsyncThunk("register/fetchRegistration", async (params) => {
	const data = await axios.post("/api/register/", params);
	return data;
});

const RegistrationSlice = createSlice({
	name: "register",
	initialState: {
		data: null,
		status: "loading",
	},
	extraReducers: {
		[fetchRegistration.pending]: (state, action) => {
			state.status = "loading";
			state.data = null;
		},
		[fetchRegistration.fulfilled]: (state, action) => {
			state.data = action.payload;
			state.status = "loaded";
		},
		[fetchRegistration.rejected]: (state) => {
			state.data = null;
			state.status = "error";
		},
	},
});
export const selectIsRegister = (state) => state.register.status;
export default RegistrationSlice.reducer;

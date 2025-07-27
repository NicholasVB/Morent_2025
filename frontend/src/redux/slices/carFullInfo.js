import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axiosConfigs/axiosConfig";

export const fetchCarInfo = createAsyncThunk("carList/fetchCarInfo", async (id) => {
	const { data } = await axios.get(`/api/car/${id}`);
	// проверять код ошибки try{} catch()

	return data;
});

const carFullInfo = createSlice({
	name: "carFullInfo",
	initialState: {
		fullInfo: {},
		comments: [],
		status: null,
	},
	reducers: {},
	extraReducers: {
		[fetchCarInfo.pending]: (state, action) => {
			state.status = "Loading";
		},
		[fetchCarInfo.fulfilled]: (state, action) => {
			state.fullInfo = action.payload[0];
			state.status = "Ok";
		},
		[fetchCarInfo.rejected]: (state, action) => {
			state.status = action.error;
		},
	},
});

export const {} = carFullInfo.actions;
export default carFullInfo.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
import axios from "../../axiosConfigs/axiosConfig";

export const fetchAllCars = createAsyncThunk("carList/fetchAllCars", async () => {
	// const { data } = await axios.get("https://morent-backend-xavm.onrender.com/api/");
	const { data } = await axios.get("/api/");
	// проверять код ошибки try{} catch()
	console.log("data of one item", data[0])
	return data;
});

const postsSlice = createSlice({
	name: "carList",
	initialState: {
		listOfCars: [],
		renderList: [],
		currentCarID: 0,
		status: null,
		listChanged: false
	},
	reducers: {
		setRenderList: (state, action) => {
			state.renderList = action.payload;
		},
		setListOfCars: (state, action) => {
			state.listOfCars = action.payload;
		},
		setCurrentCarID: (state, action) => {
			state.currentCarID = action.payload;
		},
		setListChanged: (state, action) => {
			state.listChanged = action.payload;
		},
	},
	extraReducers: {
		[fetchAllCars.pending]: (state, action) => {
			state.status = "Loading";
		},
		[fetchAllCars.fulfilled]: (state, action) => {
			state.listOfCars = action.payload;
			state.status = "Loaded";
		},
		[fetchAllCars.rejected]: (state, action) => {
			state.status = action.error;
		},
	},
});
export const { setRenderList, setListOfCars, setCurrentCarID, setListChanged } = postsSlice.actions;
export default postsSlice.reducer;

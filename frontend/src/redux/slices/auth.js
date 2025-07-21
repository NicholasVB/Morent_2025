import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		curentAuthSession: null,
	},
	reducers: {
		setCurentAuthSession(state, action) {
			state.curentAuthSession = action.payload;
		},
	},
});

export const { setCurentAuthSession } = authSlice.actions;
export default authSlice.reducer;

import React from "react";
import { Routes, Route } from "react-router-dom";
import { Header, Footer, Preloader } from "./components";
import { About, Home, Socials, Car, Login, Registration, Profile, ProfileEdit, Rent } from "./pages";

function App() {
	return (
		<>
			<Header></Header>
			<Routes>
				<Route path="/" element={<Home />}></Route>
				<Route path="/about" element={<About />}></Route>
				{/* <Route path="/preloader" element={<Preloader />}></Route> */}
				<Route path="/socials" element={<Socials />}></Route>
				<Route path="/car" element={<Car />}></Route>
				<Route path="/login" element={<Login />}></Route>
				<Route path="/registration" element={<Registration />}></Route>
				<Route path="/profile" element={<Profile />}></Route>
				<Route path="/profile/edit" element={<ProfileEdit />}></Route>
				<Route path="/rent" element={<Rent />}></Route>
			</Routes>
			<Footer></Footer>
		</>
	);
}

export default App;

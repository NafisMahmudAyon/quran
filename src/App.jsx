// App.js

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import QuranVersesComponent from "./components/QuranVersesComponent";
import HomePage from "./components/HomePage";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route exact path="/" element={<HomePage />} />
				<Route path="/quran-verses" element={<QuranVersesComponent />} />
				{/* <Route path="/settings" component={SettingsPage} /> */}
				{/* Add more routes as needed */}
			</Routes>
		</BrowserRouter>
	);
};

export default App;




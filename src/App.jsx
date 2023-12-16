// App.js

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import QuranVersesComponent from "./components/QuranVersesComponent";
import HomePage from "./components/HomePage";
import Surah from "./components/Surah";
import { FontSizeProvider } from "./components/FontSizeContext";

const App = () => {
	return (
		// <FontSizeProvider>
			<BrowserRouter>
				<Routes>
					<Route exact path="/" element={<HomePage />} />
					<Route path="/quran-verses" element={<QuranVersesComponent />} />
					<Route path="/surah/:surahNumber" element={<Surah />} />
					{/* <Route path="/settings" component={SettingsPage} /> */}
					{/* Add more routes as needed */}
				</Routes>
			</BrowserRouter>
		// </FontSizeProvider>
	);
};

export default App;


import React, { useState } from "react";
import SurahList from "./SurahList";
import ParaList from "./ParaList";

const HomePage = () => {
	const [nav, setNav] = useState("surah");
	return (
		<div className="background bg-teal-400 h-[100vh] bg-cover ">
			<div className="h-[120px] border-b ">
				<h1 className="text-center text-4xl py-4 ">Quran App</h1>
				<div className="flex justify-between px-12 text-xl pb-2 ">
					<h3
						className={`border-b-4 ${
							nav === "surah" ? "border-bisque" : "border-transparent"
						} `}
						onClick={() => setNav("surah")}>
						Surah
					</h3>
					<h3
						className={`border-b-4 ${
							nav === "para" ? "border-bisque" : "border-transparent"
						} `}
						onClick={() => setNav("para")}>
						Para
					</h3>
				</div>
			</div>
			<div className="h-[calc(100vh-120px)] overflow-scroll scroller ">
				{nav === "surah" && (
					<div className="overflow-hidden ">
						<SurahList />
					</div>
				)}
				{nav === "para" && (
					<div>
						<ParaList />
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;

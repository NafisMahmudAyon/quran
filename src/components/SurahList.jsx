import React, { useState, useEffect } from "react";

const SuraList = () => {
	const [surahs, setSurahs] = useState([]);

	useEffect(() => {
		const fetchSurahs = async () => {
			try {
				const response = await fetch(
					"https://api.quran.com/api/v4/chapters?language=en"
				);
				const data = await response.json();
				setSurahs(data.chapters);
			} catch (error) {
				console.error("Error fetching surahs:", error);
			}
		};

		fetchSurahs();
	}, []);
	const handleClick = () => {
		window.location.href = "/surah";
	};

	return (
		<div>
			{/* <h2>List of Surahs</h2> */}
			<div className="pt-6 bg-opacity-30 bg-teal-900 ">
				{surahs.map((surah) => (
					<div
						key={surah.id}
						className="flex justify-between items-center px-6 py-4 border-b "
						onClick={() => (window.location.href = "/surah/2")}>
						<div className="flex gap-4 items-center ">
							<strong>{surah.id}.</strong>{" "}
							<div className="flex flex-col ">
								<strong>{surah.name_simple}</strong>
								{surah.translated_name.name}
							</div>
						</div>
						<div className="arabic text-xl ">{surah.name_arabic}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default SuraList;

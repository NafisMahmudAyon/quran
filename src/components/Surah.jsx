// Surah.js
import { useEffect, useState } from "react";

function Surah({ surah }) {
	const [data, setData] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					`/surah/${surah}.json` // Use string interpolation to include the value of `surah`
				);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const result = await response.json();
				setData(result);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [surah]);

	return (
		<div>
			{data ? (
				<ul>
          {data.name}
					{data.verses.map((verse, index) => (
						<li key={index} className="list-none text-right ">
							{verse.arabic}
						</li>
					))}
				</ul>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}

export default Surah;

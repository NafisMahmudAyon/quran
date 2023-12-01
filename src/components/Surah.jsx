import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import chaptersData from "./ChapterData";
import ArabicVerseData from "./ArabicVerse";
import VerseRenderer from "./VerseRender";

const Surah = () => {
	const { surahNumber } = useParams();
	const [verseData, setVerseData] = useState([]); // State to store fetched verse data
	const verses_count = chaptersData[surahNumber - 1].verses_count;
	console.log(verses_count)


	return (
		<div>
			<h2>Surah Details</h2>
			{surahNumber}
			{/* Use the verseData state as needed */}
			<div>
				<VerseRenderer surahNumber={surahNumber} versesData={ArabicVerseData} verseCount={verses_count} />
			</div>
		</div>
	);
};

export default Surah;

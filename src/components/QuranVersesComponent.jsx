import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const QuranVersesComponent = () => {
	const [verses, setVerses] = useState([]);
	const [translations, setTranslations] = useState({});
	const [pageNumber, setPageNumber] = useState(1);
	const [fontSize, setFontSize] = useState(20); // Initial font size
	const [fontSizeBN, setFontSizeBN] = useState(20); // Initial font size

	useEffect(() => {
		// Fetch data from the Quran verses API
		const fetchVersesData = async () => {
			try {
				const response = await fetch(
					`https://api.quran.com/api/v4/quran/verses/indopak?page_number=${pageNumber}`
				);
				const data = await response.json();
				setVerses(data.verses);
			} catch (error) {
				console.error("Error fetching Quran verses:", error);
			}
		};

		fetchVersesData();
	}, [pageNumber]);

	useEffect(() => {
		// Fetch translations based on verse_key
		const fetchTranslations = async (verseKey) => {
			try {
				const response = await fetch(
					`https://api.quran.com/api/v4/quran/translations/161?&verse_key=${encodeURIComponent(
						verseKey
					)}`
				);
				const data = await response.json();
				setTranslations((prevTranslations) => ({
					...prevTranslations,
					[verseKey]: data.translations[0]?.text || "Translation not found",
				}));
			} catch (error) {
				console.error("Error fetching translations:", error);
			}
		};

		verses.forEach((verse) => {
			fetchTranslations(verse.verse_key);
		});
	}, [verses]);

	const parseVerseKey = (verseKey) => {
		const [surah, verse] = verseKey.split(":");
		return { surah, verse };
	};

	const handleNextPage = () => {
		setPageNumber(pageNumber + 1);
	};

	const handlePreviousPage = () => {
		if (pageNumber > 1) {
			setPageNumber(pageNumber - 1);
		}
	};

	const handleFontSizeChange = (value) => {
		setFontSize(value);
	};
	const handleFontSizeChangeBN = (value) => {
		setFontSizeBN(value);
	};

	const renderVerses = () => {
		const verseStyle = {
			fontSize: `${fontSize}px`,
			lineHeight: `${fontSize * 1.6}px`,
		};
		const meaningStyle = {
			fontSize: `${fontSizeBN}px`,
			lineHeight: `${fontSizeBN * 1.6}px`,
		};

		return verses.map((verse) => {
			const { surah, verse: verseNumber } = parseVerseKey(verse.verse_key);
			return (
				<div key={verse.id}>
					<li className="arabic text-2xl" style={verseStyle}>
						<span className="normal">
							Surah {surah}, Verse {verseNumber}:
						</span>{" "}
						{verse.text_indopak}
						<br />
					</li>
					<li className="translation bangla" style={meaningStyle}>
						{translations[verse.verse_key] || "Loading translation..."}
					</li>
				</div>
			);
		});
	};

	return (
		<div>
			<h1>Quran Verses with Translations</h1>
			<Slider
				min={10}
				max={50}
				step={2}
				value={fontSize}
				onChange={handleFontSizeChange}
			/>
			<Slider
				min={10}
				max={50}
				step={2}
				value={fontSizeBN}
				onChange={handleFontSizeChangeBN}
			/>
			<ul>{renderVerses()}</ul>
			<div className="flex justify-between px-6 ">
				<button
					onClick={handlePreviousPage}
					disabled={pageNumber === 1}
					className={`px-4 py-2 ${
						pageNumber === 1 ? "bg-slate-700 hover:bg-slate-700 cursor-not-allowed text-white" : "bg-teal-500"
					} rounded-md hover:shadow-sm hover:bg-teal-600 transition-all ease-in-out`}>
					Previous Page
				</button>
				<button
					onClick={handleNextPage}
					className="px-4 py-2 bg-teal-500 rounded-md hover:shadow-sm hover:bg-teal-600 transition-all ease-in-out ">
					Next Page
				</button>
			</div>
		</div>
	);
};

export default QuranVersesComponent;

import React, { useState, useEffect } from "react";
import SettingsPanel from "./SettingPanel";

const Verse = ({
	verseKey,
	verse,
	translations,
	index,
	font,
	fontBN,
	verseStyle,
	meaningStyle,
}) => {
	const parts = verseKey.split(":");
	const verseNumber = parts[1]; // Extract the verse number from verseKey
	console.log(translations)
	

	return (
		<div key={verse?.id || index} className=" border mb-3 p-3 rounded-lg " 
		// onClick={()=> ()}
		>
			<p className=" w-[max-content] px-3 py-1 border">
				{verseNumber}
			</p>
			{verse ? (
				<div>
					<p style={verseStyle} className="text-right">
						{verse.text_indopak}
					</p>
					{translations[index] && (
						<p style={meaningStyle} className="text-center">
							{translations[verseNumber-1]?.translations[0].text}
						</p>
					)}
				</div>
			) : (
				<p>Verse not found</p>
			)}
		</div>
	);
};


const VerseRenderer = ({ surahNumber, versesData, verseCount }) => {
	const [translations, setTranslations] = useState([]);
	console.log(translations)
	const [font, setFont] = useState(20);
	const [fontBN, setFontBN] = useState(20);
	const [isLoading, setIsLoading] = useState(true);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const toggleSettings = () => {
		setIsSettingsOpen(!isSettingsOpen);
	};

	useEffect(() => {
		const fetchTranslations = async () => {
			const translations = [];
			for (let i = 1; i <= verseCount; i++) {
				const verseKey = `${surahNumber}:${i}`;
				const apiUrl = `https://api.quran.com/api/v4/quran/translations/161?verse_key=${verseKey}`;

				try {
					const response = await fetch(apiUrl);
					if (response.ok) {
						const translationData = await response.json();
						translations.push(translationData);
					} else {
						console.error(`Failed to fetch translation for verse ${verseKey}`);
					}
				} catch (error) {
					console.error(
						`Error fetching translation for verse ${verseKey}:`,
						error
					);
				}
			}
			setTranslations(translations);
			setIsLoading(false);
		};

		fetchTranslations();
	}, [verseCount, surahNumber]);

	const verseStyle = {
		fontSize: `${font}px`,
		lineHeight: `${font * 1.6}px`,
	};

	const meaningStyle = {
		fontSize: `${fontBN}px`,
		lineHeight: `${fontBN * 1.6}px`,
	};

	const allFoundVerses = [];
	for (let i = 1; i <= verseCount; i++) {
		const verseKey = `${surahNumber}:${i}`;
		const matchingVerses = versesData.filter(
			(verse) => verse.verse_key === verseKey
		);
		allFoundVerses.push(...matchingVerses);
	}

	console.log(allFoundVerses);

	const [currentPage, setCurrentPage] = useState(1);
	console.log(currentPage);
	const versesPerPage = 10;

	const indexOfLastVerse = currentPage * versesPerPage;
	const indexOfFirstVerse = indexOfLastVerse - versesPerPage;
	const currentVerses = allFoundVerses.slice(
		indexOfFirstVerse,
		indexOfLastVerse
	);

	const totalPageCount = Math.ceil(verseCount / versesPerPage);

	const handleNextPage = () => {
		if (currentPage < totalPageCount) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handlePaginationClick = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const renderPagination = () => {
		const adjacentPages = 2; // Number of adjacent pages to show
		const paginationItems = [];
		let startPage, endPage;

		if (totalPageCount <= 5) {
			startPage = 1;
			endPage = totalPageCount;
		} else {
			if (currentPage <= 3) {
				startPage = 1;
				endPage = 5;
			} else if (currentPage + 2 >= totalPageCount) {
				startPage = totalPageCount - 4;
				endPage = totalPageCount;
			} else {
				startPage = currentPage - 2;
				endPage = currentPage + 2;
			}
		}

		for (let i = startPage; i <= endPage; i++) {
			const isActive = i === currentPage; // Check if current page number is active
			paginationItems.push(
				<li key={i}>
					<button
						className={` h-6 w-6 flex justify-center items-center rounded leading-normal ${
							isActive ? "bg-emerald-300 text-black" : "bg-teal-500"
						}`}
						onClick={() => handlePaginationClick(i)}>
						{i}
					</button>
				</li>
			);
		}

		return (
			<ul className="pagination flex gap-4 justify-center py-4 bg-teal-900">
				<li>
					<button
						onClick={handlePrevPage}
						className={`flex justify-center items-center rounded leading-normal bg-teal-500 px-2 ${
							currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
						}`}
						disabled={currentPage === 1}>
						Prev
					</button>
				</li>
				{paginationItems}
				<li>
					<button
						onClick={handleNextPage}
						className={`flex justify-center items-center rounded leading-normal bg-teal-500 px-2 ${
							currentPage === totalPageCount
								? "opacity-50 cursor-not-allowed"
								: ""
						}`}
						disabled={currentPage === totalPageCount}>
						Next
					</button>
				</li>
			</ul>
		);
	};

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<div className=" ">
			{/* <h2>Rendered Verses with Translation</h2> */}
			<div className="px-[15px] pb-[50px] ">
				{isLoading ? (
					<p>Loading translations...</p>
				) : (
					currentVerses.map((verse, index) => (
						<Verse
							key={verse?.id || index}
							verseKey={`${surahNumber}:${indexOfFirstVerse + index + 1}`}
							verse={verse}
							translations={translations}
							index={index}
							font={font}
							fontBN={fontBN}
							verseStyle={verseStyle}
							meaningStyle={meaningStyle}
						/>
					))
				)}
			</div>
			<div className="absolute bottom-0 w-full">{verseCount > versesPerPage && renderPagination()}</div>
			
			<div
				className="h-6 w-6 bg-red-500"
				onClick={() => setIsSettingsOpen(!isSettingsOpen)}></div>
			<SettingsPanel
				isOpen={isSettingsOpen}
				togglePanel={toggleSettings}
				onFontSizeChange={(size) => setFont(size)}
				onFontSizeChangeBN={(size) => setFontBN(size)}
			/>
		</div>
	);
};

export default VerseRenderer;

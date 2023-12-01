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
	const verseNumber = parts[1];
	const surahNumber = parts[0];

	const [tafsir, setTafsir] = useState(false);
	const [tafsirData, setTafsirData] = useState([]);
	const [tafsirVerse, setTafsirVerse] = useState("")

	useEffect(() => {
		const fetchTafsir = async () => {
			const apiUrl = `https://api.quran.com/api/v4/quran/tafsirs/165?verse_key=${surahNumber}:${verseNumber}&language=bn`;
			try {
				const response = await fetch(apiUrl);
				if (response.ok) {
					const tafsirDataX = await response.json();
					setTafsirData(tafsirDataX);
				} else {
					console.error(`Failed to fetch tafsir for verse ${verseKey}`);
				}
			} catch (error) {
				console.error(`Error fetching tafsir for verse ${verseKey}:`, error);
			}
		};
		fetchTafsir();
	}, [tafsir, surahNumber, verseNumber, verseKey]);

	return (
		<div
			key={verse?.id || index}
			className="border mb-3 p-3 rounded-lg relative"
			onClick={() => {
				setTafsir(!tafsir);
				setTafsirVerse(verseNumber);
			}}>
			<p className="w-[max-content] px-3 py-1 border">{verseNumber}</p>
			{verse ? (
				<div>
					<p style={verseStyle} className="text-right">
						{verse.text_indopak}
					</p>
					{translations[index] && (
						<p style={meaningStyle} className="text-center">
							{translations[verseNumber - 1]?.translations[0].text}
						</p>
					)}
				</div>
			) : (
				<p>Verse not found</p>
			)}
			{tafsir && tafsirData.tafsirs.length > 0 && (
				<div className="fixed background bg-opacity-25 top-0 left-0 right-0 bottom-0 flex flex-col p-4 pt-4 z-10 overflow-scroll">
					<h2>Tafsir - Verse {tafsirVerse} </h2>
					<span
						className="absolute top-4 right-4 text-2xl w-6 h-6 text-red-500 z-20 "
						onClick={() => setTafsir(!tafsir)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="4"
							stroke-linecap="round"
							stroke-linejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</span>
					{tafsirData.tafsirs.map((item, index) => (
						<div
							key={index}
							className="border bg-teal-900 bg-opacity-80 p-3 m-1 rounded">
							<p>{item.text}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};


const VerseRenderer = ({ surahNumber, versesData, verseCount }) => {
	const [translations, setTranslations] = useState([]);
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
			<div className="h-1 pb-[50px] w-full "></div>
			<div className="absolute bottom-0 w-full">
				{verseCount > versesPerPage && renderPagination()}
			</div>

			<button
				className="fixed top-1/2 -translate-y-1/2 bg-red-600 cursor-pointer h-7 w-7 "
				onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					// {...props}
				>
					<path
						stroke="bisque"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M11.567 9.89a2.447 2.447 0 0 0-.32-3.158A2.627 2.627 0 0 0 8 6.423c-.42.271-.75.662-.947 1.122a2.435 2.435 0 0 0-.146 1.444c.1.487.344.933.7 1.28a2.64 2.64 0 0 0 2.806.543 2.557 2.557 0 0 0 1.154-.921ZM12.433 17.89a2.447 2.447 0 0 1 .32-3.158 2.627 2.627 0 0 1 3.247-.31c.42.271.75.662.947 1.121.194.456.245.96.146 1.445a2.48 2.48 0 0 1-.7 1.28 2.6 2.6 0 0 1-1.317.683 2.64 2.64 0 0 1-1.486-.142 2.557 2.557 0 0 1-1.157-.92v0Z"
						clipRule="evenodd"
					/>
					<path
						fill="bisque"
						d="M12 7.75a.75.75 0 0 0 0 1.5v-1.5Zm7 1.5a.75.75 0 0 0 0-1.5v1.5Zm-12.143 0a.75.75 0 0 0 0-1.5v1.5ZM5 7.75a.75.75 0 1 0 0 1.5v-1.5Zm7 9.5a.75.75 0 0 0 0-1.5v1.5Zm-7-1.5a.75.75 0 0 0 0 1.5v-1.5Zm12.143 0a.75.75 0 0 0 0 1.5v-1.5ZM19 17.25a.75.75 0 0 0 0-1.5v1.5Zm-7-8h7v-1.5h-7v1.5Zm-5.143-1.5H5v1.5h1.857v-1.5Zm5.143 8H5v1.5h7v-1.5Zm5.143 1.5H19v-1.5h-1.857v1.5Z"
					/>
				</svg>
			</button>
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

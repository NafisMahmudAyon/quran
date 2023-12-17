import React, { useState, useEffect, useRef } from "react";
import SettingsPanel from "./SettingPanel";
import chaptersData from "./ChapterData";
import SimpleAudioPlayer from "./SimpleAudioPlayer";
import Player from "./Player";

const TruncatedText = ({ text, maxWords }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const words = text.split(" ");
	const shouldTruncate = words.length > maxWords;

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<div onClick={toggleExpand}>
			<p>
				{shouldTruncate && !isExpanded
					? `${words.slice(0, maxWords).join(" ")}...`
					: text}
				{/* {shouldTruncate && (
					<button>{isExpanded ? "Show Less" : "Show More"}</button>
				)} */}
			</p>
		</div>
	);
};

const AudioPlayer = ({ audioSrc, isPlaying, onButtonClick }) => {
	const [error, setError] = useState(null);
	const audioRef = useRef(null);

	useEffect(() => {
		const audio = new Audio(audioSrc);
		audioRef.current = audio;

		const handlePlay = () => {
			const playPromise = audio.play();
			if (playPromise !== undefined) {
				playPromise.catch((error) => {
					console.error("Play Error:", error);
					setError(error);
				});
			}
		};

		const handlePause = () => {
			audio.pause();
		};

		if (isPlaying) {
			handlePlay();
		} else {
			handlePause();
		}

		return () => {
			audio.pause();
			audio.currentTime = 0;
		};
	}, [isPlaying, audioSrc]);

	const togglePlay = () => {
		setIsPlaying(!isPlaying);
	};

	return (
		<div>
			{error && <p>Error: {error.message}</p>}
			<button onClick={() => onButtonClick(audioSrc)}>
				<div className="w-6 h-6 bg-[bisque] rounded-full ">
					{isPlaying ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="100%"
							height="100%"
							viewBox="0 0 100 100"
							fill="none">
							<rect x="30" y="25" width="15" height="50" fill="#042f2e" />
							<rect x="55" y="25" width="15" height="50" fill="#042f2e" />
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="100%"
							height="100%"
							viewBox="0 0 100 100"
							fill="none">
							<circle cx="50" cy="50" r="45" fill="bisque" />
							<polygon points="40,30 40,70 70,50" fill="#042f2e" />
						</svg>
					)}
				</div>
			</button>
		</div>
	);
};

// https://api.quran.com/api/v4/chapter_recitations/1?language=en

const Verse = ({
	verseKey,
	verse,
	translations,
	index,
	font,
	fontBN,
	verseStyle,
	meaningStyle,
	loading,
}) => {
	const parts = verseKey.split(":");
	const verseNumber = parts[1];
	const surahNumber = parts[0];

	var [fatihaVerse, setFatihaVerse] = useState(1);
	var [tafsir, setTafsir] = useState(false);
	console.log(tafsir);
	const [tafsirData, setTafsirData] = useState([]);
	const [tafsirVerse, setTafsirVerse] = useState("");
	const [audioFiles, setAudioFiles] = useState([]);
	console.log(audioFiles)

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

	const [currentAudioSrc, setCurrentAudioSrc] = useState("");

	const handleAudioButtonClick = (audioSrc) => {
		if (currentAudioSrc !== audioSrc) {
			setCurrentAudioSrc(audioSrc);
		} else {
			setCurrentAudioSrc("");
		}
	};

	useEffect(() => {
		const fetchAudioFiles = async () => {
			try {
				const response = await fetch(
					"https://api.quran.com/api/v4/quran/recitations/1"
				);
				if (response.ok) {
					const data = await response.json();
					setAudioFiles(data.audio_files);
				} else {
					console.error("Failed to fetch audio files");
				}
			} catch (error) {
				console.error("Error fetching audio files:", error);
			}
		};

		fetchAudioFiles();
	}, []);

	return (
		<div
			key={verse?.id || index}
			className="border mb-3 p-3 rounded-lg relative"
			// onClick={() => {
			// 	setTafsir(true);
			// 	setTafsirVerse(verseNumber);
			// 	setFatihaVerse(index);
			// }}
		>
			{surahNumber == 1 && (
				<div className="flex justify-between">
					<p className="w-[max-content] px-3 py-1 border">{index}</p>
					<AudioPlayer
						audioSrc={`https://verses.quran.com/${
							audioFiles.find((audio) => audio.verse_key === verseKey)?.url
						}`}
						isPlaying={
							currentAudioSrc ===
							`https://verses.quran.com/${
								audioFiles.find((audio) => audio.verse_key === verseKey)?.url
							}`
						}
						onButtonClick={handleAudioButtonClick}
					/>
				</div>
			)}
			{surahNumber != 1 && (
				<div className="flex justify-between">
					<p className="w-[max-content] px-3 py-1 border">{verseNumber}</p>
					<AudioPlayer
						audioSrc={`https://verses.quran.com/${
							audioFiles.find((audio) => audio.verse_key === verseKey)?.url
						}`}
						isPlaying={
							currentAudioSrc ===
							`https://verses.quran.com/${
								audioFiles.find((audio) => audio.verse_key === verseKey)?.url
							}`
						}
						onButtonClick={handleAudioButtonClick}
					/>
				</div>
			)}

			{verse ? (
				<div
					onClick={() => {
						setTafsir(true);
						setTafsirVerse(verseNumber);
						setFatihaVerse(index);
					}}>
					<p style={verseStyle} className="text-right py-2">
						{verse.text_indopak}
					</p>
					{loading ? (
						"Translation Loading..."
					) : (
						<>
							{translations[index] && (
								<p style={meaningStyle} className="text-center">
									{/* {translations[verseNumber - 1]?.translations[0].text} */}
									{translations[index]?.translations[0].text}
								</p>
							)}
						</>
					)}
				</div>
			) : (
				<p>Verse not found</p>
			)}

			{tafsir == true && tafsirData.tafsirs.length > 0 && (
				<div className="fixed overflow-y-scroll background bg-opacity-25 top-0 left-0 h-[100dvh] flex flex-col px-4 pb-4 z-10 overflow-scroll">
					<div className="h-[120px] my-4 px-8 flex justify-between items-center ">
						{/* {tafsir == true && ( */}
						<div
							className=" text-2xl w-6 h-6  text-red-500 z-50 cursor-pointer"
							onClick={(e) => {
								e.stopPropagation();
								setTafsir(false);
							}}>
							{/* <svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="4"
									strokeLinecap="round"
									strokeLinejoin="round">
									<line x1="18" y1="6" x2="6" y2="18"></line>
									<line x1="6" y1="6" x2="18" y2="18"></line>
								</svg> */}
							<span className="w-6 ">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									// ...other attributes
								>
									<path
										stroke="bisque"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="m11 9-3 3m0 0 3 3m-3-3h8m5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
									/>
								</svg>
							</span>
						</div>
						{/* )} */}
						<div className="flex justify-center items-center ">
							{surahNumber == 1 && (
								<div className=" flex items-center justify-center flex-col  ">
									<h2 className="text-2xl ">Tafsir</h2>
									<span>
										{" "}
										<span className="underline">
											"{chaptersData[surahNumber - 1].name_simple}"
										</span>{" "}
										- Verse {fatihaVerse}
									</span>
								</div>
							)}
							{surahNumber != 1 && (
								<div className=" flex items-center justify-center flex-col  ">
									<h2 className="text-2xl ">Tafsir</h2>
									<span>
										{" "}
										<span className="underline">
											{chaptersData[surahNumber - 1].name_simple}
										</span>{" "}
										- Verse {tafsirVerse}
									</span>
								</div>
								// <div className="mb-4 flex justify-between ">
								// 	<h2>Tafsir - Verse {tafsirVerse}</h2>
								// </div>
							)}
						</div>
						<div></div>
					</div>

					{tafsirData.tafsirs
						.filter((item) => item.text.length > 10)
						.map((item, index) => (
							<div
								key={index}
								className="border bg-teal-900 bg-opacity-80 p-3 m-1 rounded">
								<TruncatedText text={item.text} maxWords={30} />

								{/* <TruncatedText text={item.text} maxWords={30} /> */}
							</div>
						))}
				</div>
			)}
		</div>
	);
};

const VerseRenderer = ({
	surahNumber,
	versesData,
	verseCount,
	bismillah_pre,
}) => {
	const [translations, setTranslations] = useState([]);
	console.log(translations);
	const [font, setFont] = useState(20);
	const [fontBN, setFontBN] = useState(20);
	const [isLoading, setIsLoading] = useState(true);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [paginationEnable, setPaginationEnable] = useState(false);
	const [loading, setLoading] = useState(false);

	const [versePlaylist, setVersePlaylist] = useState([]);

	const toggleSettings = () => {
		setIsSettingsOpen(!isSettingsOpen);
	};

	// useEffect(() => {
	// 	const fetchTranslations = async () => {
	// 		const translations = [];
	// 		for (let i = 1; i <= verseCount; i++) {
	// 			const verseKey = `${surahNumber}:${i}`;
	// 			const apiUrl = `https://api.quran.com/api/v4/quran/translations/161?verse_key=${verseKey}`;

	// 			try {
	// 				const response = await fetch(apiUrl);
	// 				if (response.ok) {
	// 					const translationData = await response.json();
	// 					translations.push(translationData);
	// 				} else {
	// 					console.error(`Failed to fetch translation for verse ${verseKey}`);
	// 				}
	// 			} catch (error) {
	// 				console.error(
	// 					`Error fetching translation for verse ${verseKey}:`,
	// 					error
	// 				);
	// 			}
	// 		}
	// 		setTranslations(translations);
	// 		setIsLoading(false);
	// 	};

	// 	fetchTranslations();
	// 	if (verseCount > 10) {
	// 		setPaginationEnable(true);
	// 	}
	// }, [verseCount, surahNumber]);

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
	console.log(indexOfLastVerse)
	const indexOfFirstVerse = indexOfLastVerse - versesPerPage;
	console.log(indexOfFirstVerse)
	const currentVerses = allFoundVerses.slice(
		indexOfFirstVerse,
		indexOfLastVerse
	);
	console.log(currentVerses)

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

	useEffect(() => {
		const fetchTranslations = async () => {
			const translations = [];
			const startVerse = (currentPage - 1) * versesPerPage + 1;
			const endVerse = Math.min(currentPage * versesPerPage, verseCount);
			setLoading(true);

			for (let i = startVerse; i <= endVerse; i++) {
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
			setLoading(false);
			setTranslations(translations);
			setIsLoading(false);
		};

		fetchTranslations();
		if (verseCount > 10) {
			setPaginationEnable(true);
		}
	}, [verseCount, surahNumber, currentPage, versesPerPage]);

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
		<div className="">
			{/* <h2>Rendered Verses with Translation</h2> */}
			<div className="px-[15px]  ">
				{isLoading ? (
					<p>Loading Verses...</p>
				) : (
					<>
						{currentPage == 1 && (
							<div className=" flex flex-col justify-center items-center pb-4 ">
								<h2 className="arabic text-2xl ">
									{versesData[0].text_indopak}
								</h2>{" "}
								<p className="bangla text-xl ">
									(আরম্ভ করছি) পরম করুণাময় অসীম দয়াময় আল্লাহর নামে।
								</p>
							</div>
						)}
						{surahNumber != 1 &&
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
									surahNumber={surahNumber}
									loading={loading}
								/>
							))}
						{surahNumber == 1 &&
							currentVerses.map((verse, index) => (
								<>
									{index != 0 && (
										<>
											<Verse
												key={verse?.id || index}
												verseKey={`${surahNumber}:${
													indexOfFirstVerse + index + 1
												}`}
												verse={verse}
												translations={translations}
												index={index}
												font={font}
												fontBN={fontBN}
												verseStyle={verseStyle}
												meaningStyle={meaningStyle}
												surahNumber={surahNumber}
												loading={loading}
											/>
										</>
									)}
								</>
							))}
					</>
				)}
			</div>

			<div className="fixed bottom-0 w-full bg-teal-900">
				<div id="audio-section">
					<Player start={indexOfFirstVerse + 1} end={indexOfLastVerse} surahNumber={surahNumber} />
				</div>
				<div>{verseCount > versesPerPage && renderPagination()}</div>
				{/* audio play section  */}
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

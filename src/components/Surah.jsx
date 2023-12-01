import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import chaptersData from "./ChapterData";
import ArabicVerseData from "./ArabicVerse";
import VerseRenderer from "./VerseRender";

const Surah = () => {
	const { surahNumber } = useParams();
	console.log(surahNumber);
	const [verseData, setVerseData] = useState([]); // State to store fetched verse data
	const verses_count = chaptersData[surahNumber - 1]?.verses_count;
	console.log(verses_count);

	return (
		<div>
			<div className="h-[120px] relative flex bg-teal-900  justify-between items-center px-8 border-b border-[bisque] ">
				<div
					className="flex flex-col gap-3 justify-center w-1/4  items-center leading-none text-xl  rounded-full "
					onClick={() => (window.location.href = `/`)}>
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
					<span className="text-[10px] whitespace-nowrap ">Back to Home</span>
				</div>

				<div className="flex w-1/2 flex-col items-center ">
					<span className="text-3xl ">
						{chaptersData[surahNumber - 1].name_simple}
					</span>
					<span className="text-2xl  ">
						{chaptersData[surahNumber - 1].name_arabic}
					</span>
					<span className="text-sm ">
						{chaptersData[surahNumber - 1].revelation_place}
					</span>
				</div>

				<div className="flex w-1/4 flex-col gap-3 ">
					{surahNumber - 1 !== 0 && (
						<button
							onClick={() =>
								(window.location.href = `/surah/${parseInt(surahNumber) - 1}`)
							}
							className="flex items-center gap-2 h-8 w-max whitespace-nowrap">
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
							<span className="w-[max-content]">
								{chaptersData[surahNumber - 2].name_simple}
							</span>
						</button>
					)}

					{surahNumber + 1 < 115 && (
						<button
							onClick={() =>
								(window.location.href = `/surah/${parseInt(surahNumber) + 1}`)
							}
							className="flex flex-row-reverse items-center gap-2 h-8 w-max whitespace-nowrap">
							<span className="w-6 rotate-180 ">
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
							<span className="w-[max-content]">
								{chaptersData[surahNumber].name_simple}
							</span>
						</button>
					)}
				</div>
			</div>
			{/* Use the verseData state as needed */}
			<div className="h-[calc(100%-120px)] overflow-scroll bg-teal-900 bg-opacity-80 pt-4 ">
				<VerseRenderer
					surahNumber={surahNumber}
					versesData={ArabicVerseData}
					verseCount={verses_count}
				/><div className="h-1 pb-[50px] w-full "></div>
			</div>
			
		</div>
	);
};

export default Surah;

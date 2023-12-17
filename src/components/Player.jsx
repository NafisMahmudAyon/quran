import React, { useEffect, useState, useRef } from "react";

const Player = ({ start, end, surahNumber }) => {
	const [audioFiles, setAudioFiles] = useState([]);
	const [verseKeys, setVerseKeys] = useState([]);
	const [audioSources, setAudioSources] = useState([]);
	const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
	console.log(currentAudioIndex);
	const [isPlaying, setIsPlaying] = useState(false);
	const [updateVolume, setUpdateVolume] = useState(80);
	const audioRef = useRef(new Audio());

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

	useEffect(() => {
		const generateVerseKeys = () => {
			const keys = [];
			for (let i = start; i <= end; i++) {
				keys.push(`${surahNumber}:${i}`);
			}
			setVerseKeys(keys);
		};

		generateVerseKeys();
	}, [start, end, surahNumber]);

	useEffect(() => {
		const newAudioSources = verseKeys.map((verseKey) => {
			const audioFile = audioFiles.find(
				(audio) => audio.verse_key === verseKey
			);
			return audioFile ? `https://verses.quran.com/${audioFile.url}` : null;
		});

		setAudioSources(newAudioSources);
	}, [verseKeys, audioFiles]);

	const playAudio = (index) => {
		if (audioSources[index]) {
			audioRef.current.src = audioSources[index];
			audioRef.current.play();
			setCurrentAudioIndex(index);
			setIsPlaying(true);
		}
	};

	const pauseAudio = () => {
		audioRef.current.pause();
		setIsPlaying(false);
	};

	const resetAudio = () => {
		pauseAudio();
		setCurrentAudioIndex(0);
	};

	const playNext = () => {
		const nextIndex = currentAudioIndex + 1;
		if (audioSources[nextIndex]) {
			playAudio(nextIndex);
		} else {
			// If the last audio file is played, reset the audio
			resetAudio();
		}
	};

	const playPrevious = () => {
		const prevIndex = currentAudioIndex - 1;
		if (audioSources[prevIndex]) {
			playAudio(prevIndex);
		}
	};

	useEffect(() => {
		const handleAudioEnd = () => {
			playNext();
		};

		audioRef.current.addEventListener("ended", handleAudioEnd);

		return () => {
			// Cleanup function to remove the event listener
			audioRef.current.removeEventListener("ended", handleAudioEnd);
		};
	}, [playNext]);

	const reset = `<svg width="12" height="12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M97.6206 1.51703e-06H88.22C87.8978 -0.000362428 87.5789 0.0647619 87.2826 0.191426C86.9863 0.318089 86.7188 0.503653 86.4963 0.736864C86.2738 0.970076 86.1009 1.24608 85.9882 1.54813C85.8755 1.85018 85.8253 2.17199 85.8406 2.49405L86.6338 18.9147C82.0224 13.4771 76.2824 9.11028 69.8133 6.11789C63.3441 3.1255 56.3011 1.57945 49.1742 1.5873C22.0768 1.5873 -0.0198149 23.7163 1.33342e-05 50.8313C0.0198416 77.99 22.0292 99.9999 49.1742 99.9999C61.3508 100.017 73.0975 95.4966 82.1248 87.3194C82.3659 87.1034 82.5605 86.8405 82.6967 86.5467C82.8328 86.2529 82.9076 85.9345 82.9165 85.6107C82.9254 85.287 82.8683 84.9649 82.7485 84.6641C82.6287 84.3632 82.4489 84.09 82.22 83.8611L75.4784 77.115C75.0517 76.6882 74.4789 76.4395 73.8759 76.4192C73.273 76.399 72.6848 76.6087 72.2305 77.0059C66.9035 81.6957 60.2746 84.6492 53.2273 85.4729C46.1801 86.2965 39.0493 84.9511 32.7857 81.616C26.5221 78.2809 21.4232 73.1145 18.1687 66.8056C14.9143 60.4967 13.6589 53.3451 14.57 46.304C15.481 39.263 18.5152 32.6671 23.2681 27.3957C28.021 22.1242 34.2667 18.4277 41.1726 16.7989C48.0785 15.17 55.3165 15.6862 61.9218 18.2787C68.527 20.8712 74.1856 25.4168 78.1433 31.3095L58.0116 30.3432C57.6898 30.3279 57.3682 30.3782 57.0663 30.491C56.7645 30.6037 56.4886 30.7767 56.2556 30.9993C56.0225 31.222 55.8371 31.4896 55.7105 31.7861C55.5839 32.0826 55.5188 32.4018 55.5192 32.7242V42.1309C55.5192 42.7624 55.7699 43.368 56.2161 43.8145C56.6623 44.261 57.2675 44.5119 57.8986 44.5119H97.6206C98.2517 44.5119 98.8569 44.261 99.3031 43.8145C99.7493 43.368 100 42.7624 100 42.1309V2.38095C100 1.74949 99.7493 1.14388 99.3031 0.697366C98.8569 0.250851 98.2517 1.51703e-06 97.6206 1.51703e-06Z" fill="#FFE4C4"/>
</svg>
`;
	const play = `<svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M50 0C22.375 0 0 22.375 0 50C0 77.625 22.375 100 50 100C77.625 100 100 77.625 100 50C100 22.375 77.625 0 50 0ZM40 72.5V27.5L70 50L40 72.5Z" fill="#FFE4C4"/>
</svg>
`;
	const pause = `<svg width="30" height="30" viewBox="0 0 99 99" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M49.5 0C22.1512 0 0 22.1512 0 49.5C0 76.8487 22.1512 99 49.5 99C76.8487 99 99 76.8487 99 49.5C99 22.1512 76.8487 0 49.5 0ZM44.55 69.3H34.65V29.7H44.55V69.3ZM64.35 69.3H54.45V29.7H64.35V69.3Z" fill="#FFE4C4"/>
</svg>
`;
	const next = `<svg width="12" height="12" viewBox="0 0 102 102" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.64024 91.003V11.6421C0.64024 2.59498 10.3125 -2.57287 15.685 2.85033L51.3243 36.8728V11.6421C51.3243 2.59498 56.1647 -2.57287 61.5372 2.85033L97.9537 42.5339C102.296 46.9307 103.706 55.7144 99.3644 60.1112L61.5372 99.77C56.1647 105.219 51.3243 100.05 51.3243 91.003V65.7754L15.685 99.7824C10.3125 105.218 0.64024 100.037 0.64024 91.003Z" fill="#FFE4C4"/>
</svg>
`;
	const previous = `<svg width="12" height="12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M100 89.1506V10.8542C100 1.9285 90.4575 -3.17002 85.1571 2.18043L49.9958 35.7465V10.8542C49.9958 1.9285 45.2204 -3.17002 39.92 2.18043L3.99201 41.3316C-0.291681 45.6695 -1.68346 54.3353 2.60023 58.6732L39.92 97.8C45.2204 103.175 49.9958 98.0763 49.9958 89.1506V64.2614L85.1571 97.8122C90.4575 103.175 100 98.0638 100 89.1506Z" fill="#FFE4C4"/>
</svg>

`;
	const volumeMute = `<svg width="27" height="20" viewBox="0 0 27 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.1996 0.366975L6.56569 4.99983H1.25001C0.55938 4.99983 0 5.55921 0 6.24984V13.7499C0 14.44 0.55938 14.9999 1.25001 14.9999H6.56569L11.1996 19.6328C11.9824 20.4156 13.3335 19.8656 13.3335 18.7489V1.25084C13.3335 0.133118 11.9814 -0.414804 11.1996 0.366975ZM24.044 9.99988L26.4211 7.62277C26.7492 7.29465 26.7492 6.76235 26.4211 6.43422L25.2325 5.24567C24.9044 4.91754 24.3721 4.91754 24.044 5.24567L21.6669 7.62277L19.2898 5.24567C18.9616 4.91754 18.4293 4.91754 18.1012 5.24567L16.9127 6.43422C16.5845 6.76235 16.5845 7.29465 16.9127 7.62277L19.2898 9.99988L16.9132 12.3765C16.5851 12.7046 16.5851 13.2369 16.9132 13.565L18.1017 14.7536C18.4299 15.0817 18.9622 15.0817 19.2903 14.7536L21.6669 12.377L24.044 14.7541C24.3721 15.0822 24.9044 15.0822 25.2325 14.7541L26.4211 13.5655C26.7492 13.2374 26.7492 12.7051 26.4211 12.377L24.044 9.99988Z" fill="#FFE4C4"/>
</svg>
`;
	const volumeLow = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.1994 0.366721L6.5656 5.00004H1.24999C0.559373 5.00004 0 5.55941 0 6.25003V13.75C0 14.4401 0.559373 15 1.24999 15H6.5656L11.1994 19.6328C11.9822 20.4156 13.3333 19.8656 13.3333 18.7489V1.25109C13.3333 0.132867 11.9812 -0.414526 11.1994 0.366721ZM17.6161 5.99586C17.013 5.66618 16.252 5.88337 15.9176 6.48805C15.5848 7.09274 15.8051 7.85263 16.4098 8.18648C17.0822 8.55627 17.4999 9.25106 17.4999 10C17.4999 10.749 17.0822 11.4438 16.4103 11.813C15.8057 12.1469 15.5854 12.9068 15.9182 13.5115C16.2531 14.1187 17.0145 14.3344 17.6166 14.0036C19.0869 13.1938 20.0004 11.6599 20.0004 9.99949C20.0004 8.33908 19.0869 6.80576 17.6161 5.99586Z" fill="#FFE4C4"/>
</svg>

`;
	const volume = `<svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.95916 2.29384L5.25225 5.99991H0.999953C0.447479 5.99991 0 6.44739 0 6.99986V12.9996C0 13.5516 0.447479 13.9995 0.999953 13.9995H5.25225L8.95916 17.7056C9.58538 18.3318 10.6662 17.8919 10.6662 16.9986V3.00089C10.6662 2.10676 9.58455 1.66845 8.95916 2.29384ZM18.6804 0.165602C18.215 -0.1398 17.5896 -0.0110563 17.2842 0.455172C16.9784 0.920567 17.1084 1.54595 17.5738 1.85136C20.3349 3.66335 21.9827 6.70946 21.9827 10.0001C21.9827 13.2908 20.3349 16.3369 17.5738 18.1489C17.1084 18.4539 16.9784 19.0797 17.2842 19.5447C17.5775 19.9909 18.1979 20.1513 18.6804 19.8343C22.0102 17.6485 23.9989 13.9716 23.9989 9.99972C23.9989 6.02783 22.0102 2.35133 18.6804 0.165602ZM19.9991 9.99972C19.9991 7.35276 18.6633 4.91913 16.4255 3.49003C15.9593 3.19254 15.3409 3.33087 15.0455 3.80085C14.7501 4.27083 14.8881 4.89288 15.3543 5.19078C17.0105 6.24865 17.9992 8.04607 17.9992 9.99972C17.9992 11.9534 17.0105 13.7508 15.3543 14.8087C14.8881 15.1062 14.7501 15.7282 15.0455 16.1986C15.3168 16.6302 15.9255 16.8294 16.4255 16.5094C18.6633 15.0803 19.9991 12.6471 19.9991 9.99972ZM14.0923 6.79696C13.6098 6.53322 13.0011 6.70696 12.7336 7.19069C12.4673 7.67442 12.6436 8.2823 13.1273 8.54937C13.6652 8.84478 13.9993 9.401 13.9993 9.99972C13.9993 10.5989 13.6652 11.1547 13.1277 11.4501C12.644 11.7171 12.4677 12.325 12.734 12.8088C13.0019 13.2946 13.611 13.4671 14.0927 13.2025C15.2689 12.5546 15.9997 11.3276 15.9997 9.99931C15.9997 8.67104 15.2689 7.44443 14.0923 6.79696Z" fill="#FFE4C4"/>
</svg>

`;

	const handleVolumeChange = (e) => {
		const volume = e.target.value;
    setUpdateVolume(e.target.value);
		audioRef.current.volume = volume / 100;
	};

	return (
		<div className="py-2 ">
			<div className="flex justify-between items-center px-3">
				<div className="w-1/4"></div>
				<div className="flex justify-center items-center gap-4 w1/2">
					<span onClick={playPrevious}>
						<svg
							className="w-4 h-4 fill-current text-gray-500 hover:text-gray-700"
							viewBox="0 0 12 12"
							xmlns="http://www.w3.org/2000/svg"
							dangerouslySetInnerHTML={{ __html: previous }}
						/>
					</span>
					{isPlaying ? (
						<span onClick={pauseAudio} className="w-[40px] h-[40px] ">
							<svg
								className=" fill-current text-gray-500 hover:text-gray-700"
								viewBox="0 0 30 30"
								xmlns="http://www.w3.org/2000/svg"
								dangerouslySetInnerHTML={{ __html: pause }}
							/>
						</span>
					) : (
						<span
							onClick={() => playAudio(currentAudioIndex)}
							className="w-[40px] h-[40px] ">
							<svg
								className=" fill-current text-gray-500 hover:text-gray-700"
								viewBox="0 0 30 30"
								xmlns="http://www.w3.org/2000/svg"
								dangerouslySetInnerHTML={{ __html: play }}
							/>
						</span>
					)}
					<span onClick={playNext}>
						<svg
							className="w-4 h-4 fill-current text-gray-500 hover:text-gray-700"
							viewBox="0 0 12 12"
							xmlns="http://www.w3.org/2000/svg"
							dangerouslySetInnerHTML={{ __html: next }}
						/>
					</span>
					<span onClick={resetAudio} className="w-4 h-4 inline-block">
						{/* Applying Tailwind CSS classes to SVG */}
						<svg
							className="w-4 h-4 fill-current text-gray-500 hover:text-gray-700"
							viewBox="0 0 12 12"
							xmlns="http://www.w3.org/2000/svg"
							dangerouslySetInnerHTML={{ __html: reset }}
						/>
					</span>
				</div>

				<div className="flex items-center w-1/4 gap-2">
					<input
						type="range"
						min="0"
						max="100"
						value={updateVolume}
						onChange={handleVolumeChange}
						className="w-20 !bg-[bisque] h-3 rounded-full  range"
						style={{ background: "bisque" }}
					/>
					{/* Volume icons rendering based on volume range */}
					{updateVolume == 0 && (
						<span
							onClick={() => handleVolumeChange({ target: { value: 50 } })} // Adjust this action according to your logic to set volume to a default value other than 0
							className="w-4 h-4 inline-block">
							<svg
								className="fill-current text-gray-500 hover:text-gray-700"
								viewBox="0 0 27 20"
								xmlns="http://www.w3.org/2000/svg"
								dangerouslySetInnerHTML={{ __html: volumeMute }}
							/>
						</span>
					)}
					{updateVolume > 0 && updateVolume < 25 && (
						<span
							onClick={() => handleVolumeChange({ target: { value: 50 } })} // Adjust this action according to your logic to set volume to a specific value
							className="w-4 h-4 inline-block">
							<svg
								className="fill-current text-gray-500 hover:text-gray-700"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
								dangerouslySetInnerHTML={{ __html: volumeLow }}
							/>
						</span>
					)}
					{updateVolume >= 25 && (
						<span
							onClick={() => handleVolumeChange({ target: { value: 0 } })} // Adjust this action according to your logic to set volume to 0
							className="w-4 h-4 inline-block">
							<svg
								className="fill-current text-gray-500 hover:text-gray-700"
								viewBox="0 0 24 20"
								xmlns="http://www.w3.org/2000/svg"
								dangerouslySetInnerHTML={{ __html: volume }}
							/>
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default Player;

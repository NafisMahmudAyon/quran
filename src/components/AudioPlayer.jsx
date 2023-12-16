import React, { useState, useEffect } from "react";

const AudioPlayer = ({ audioSrc }) => {
	const [audio] = useState(new Audio());
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		audio.src = `https://verses.quran.com/${audioSrc}`;
		audio.load();
		audio.addEventListener("ended", handleAudioEnded);
		return () => {
			audio.removeEventListener("ended", handleAudioEnded);
		};
	}, [audioSrc, audio]);

	const handleAudioEnded = () => {
		setIsPlaying(false);
	};

	const togglePlay = () => {
		if (!isPlaying) {
			const playPromise = audio.play();
			if (playPromise !== undefined) {
				playPromise
					.then(() => {
						setIsPlaying(true);
					})
					.catch((error) => {
						console.error("Audio playback error:", error);
					});
			}
		} else {
			audio.pause();
			setIsPlaying(false);
		}
	};

	return (
		<div>
			<button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
		</div>
	);
};

export default AudioPlayer;

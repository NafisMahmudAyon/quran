import { useState, useEffect } from "react";

const SimpleAudioPlayer = ({ audioSrc }) => {
	const [audio, setAudio] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		setAudio(new Audio(audioSrc));
	}, [audioSrc]);

	const togglePlay = () => {
		if (audio) {
			if (isPlaying) {
				audio.pause();
			} else {
				audio.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	useEffect(() => {
		if (audio) {
			audio.addEventListener("ended", () => {
				setIsPlaying(false);
			});

			return () => {
				audio.removeEventListener("ended", () => {
					setIsPlaying(false);
				});
				audio.pause();
				audio.currentTime = 0;
			};
		}
	}, [audio]);

	return (
		<div>
			<button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
		</div>
	);
};

export default SimpleAudioPlayer;

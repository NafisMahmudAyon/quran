// SettingsPanel.js
import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const SettingsPanel = ({
	isOpen,
	togglePanel,
	onFontSizeChange,
	onFontSizeChangeBN,
}) => {
	const [fontSize, setFontSize] = useState(16); // Initial font size for one language
	const [fontSizeBN, setFontSizeBN] = useState(16); // Initial font size for another language

	const handleFontSizeChange = (size) => {
		setFontSize(size);
		onFontSizeChange(size);
	};

	const handleFontSizeChangeBN = (size) => {
		setFontSizeBN(size);
		onFontSizeChangeBN(size);
		// Call another handler for the second language's font size change if needed
	};
	const tipFormatter = (value) => `${value}px`;

	return (
		<div className={`settings-panel ${isOpen ? "open" : ""}`}>
			<h2>Settings</h2>
			{/* Slider for first language */}
			<Slider
				min={10}
				max={50}
				step={2}
				value={fontSize}
				onChange={handleFontSizeChange}
				className="slider-with-value"
			/>
			{/* Slider for second language */}
			<Slider
				min={10}
				max={50}
				step={2}
				value={fontSizeBN}
				onChange={handleFontSizeChangeBN}
				className="slider-with-value"
			/>
			{/* <div className="slider-value">{fontSizeBN}px</div> */}
			{/* ... Other settings */}
		</div>
	);
};

export default SettingsPanel;

// // SettingsPanel.js
// import React from "react";
// import { useFontSize } from "./FontSizeContext";
// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";

// const SettingsPanel = () => {
// 	const { fontSize, fontSizeBN, handleFontSizeChange, handleFontSizeChangeBN } =
// 		useFontSize();

// 	const handleFontSizeChangeFirstLanguage = (size) => {
// 		handleFontSizeChange(size);
// 	};

// 	const handleFontSizeChangeSecondLanguage = (size) => {
// 		handleFontSizeChangeBN(size);
// 	};

// 	const tipFormatter = (value) => `${value}px`;

// 	return (
// 		<div className="settings-panel">
// 			<h2>Settings</h2>
// 			{/* Slider for first language */}
// 			<Slider
// 				min={10}
// 				max={50}
// 				step={2}
// 				value={fontSize}
// 				onChange={handleFontSizeChangeFirstLanguage}
// 				tipFormatter={tipFormatter}
// 				className="slider-with-value"
// 			/>
// 			{/* Slider for second language */}
// 			<Slider
// 				min={10}
// 				max={50}
// 				step={2}
// 				value={fontSizeBN}
// 				onChange={handleFontSizeChangeSecondLanguage}
// 				tipFormatter={tipFormatter}
// 				className="slider-with-value"
// 			/>
// 			{/* ... Other settings */}
// 		</div>
// 	);
// };

// export default SettingsPanel;

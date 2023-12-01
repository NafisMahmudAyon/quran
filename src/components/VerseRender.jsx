import React, { useState, useEffect } from "react";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import SettingsPanel from "./SettingPanel";

const VerseRenderer = ({
	// fontSize,
	// fontSizeBN,
	surahNumber,
	versesData,
	verseCount,
}) => {
	const [translations, setTranslations] = useState([]);

	const [font, setFont] = useState(20); // Initial font 
	const [fontBN, setFontBN] = useState(20); // Initial font 
	console.log(translations);

  const handleFontSizeChange = (size) => {
		setFont(size);
	};
  const handleFontSizeChangeBN = (size) => {
		setFontBN(size);
	};

	useEffect(() => {
		const fetchTranslations = async () => {
			const translations = [];
			for (let i = 1; i <= verseCount; i++) {
				const verseKey = `${i}`;
				const apiUrl = `https://api.quran.com/api/v4/quran/translations/161?verse_key=${surahNumber}:${verseKey}`;

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
		};

		fetchTranslations();
	}, [verseCount]);

	// const handleFontSizeChange = (value) => {
	// 	setFontSize(value);
	// };
	// const handleFontSizeChangeBN = (value) => {
	// 	setFontSizeBN(value);
	// };

	const verseStyle = {
		fontSize: `${font}px`,
		lineHeight: `${font * 1.6}px`,
	};
	const meaningStyle = {
		fontSize: `${fontBN}px`,
		lineHeight: `${fontBN * 1.6}px`,
	};
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const toggleSettings = () => {
		setIsSettingsOpen(!isSettingsOpen);
	};

	return (
		<div>
			<h2>Rendered Verses with Translation</h2>
			<div>
				{versesData.slice(0, verseCount).map((verse, index) => (
					<div key={verse.id}>
						<p>Verse {verse.verse_key}</p>
						<p style={verseStyle}>{verse.text_indopak}</p>
						{translations[index] && (
							<p style={meaningStyle}>
								Translation: {translations[index].translations[0].text}
							</p>
						)}
					</div>
				))}
			</div>
      <div className=" h-6 w-6 bg-red-500 " 
      onClick={()=> setIsSettingsOpen(!isSettingsOpen)}>

      </div>
			<SettingsPanel
				isOpen={isSettingsOpen}
				togglePanel={toggleSettings}
				onFontSizeChange={handleFontSizeChange}
				onFontSizeChangeBN={handleFontSizeChangeBN}
			/>
		</div>
	);
};

export default VerseRenderer;

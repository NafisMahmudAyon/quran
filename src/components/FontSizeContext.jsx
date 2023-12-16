// FontSizeContext.js
import React, { createContext, useContext, useState } from "react";

const FontSizeContext = createContext();

export const useFontSize = () => {
	return useContext(FontSizeContext);
};

export const FontSizeProvider = ({ children }) => {
	const [fontSize, setFontSize] = useState(16);
	const [fontSizeBN, setFontSizeBN] = useState(16);

	const handleFontSizeChange = (size) => {
		setFontSize(size);
		// Perform any other actions needed globally on font size change for first language
	};

	const handleFontSizeChangeBN = (size) => {
		setFontSizeBN(size);
		// Perform any other actions needed globally on font size change for the other language
	};

	return (
		<FontSizeContext.Provider
			value={{
				fontSize,
				fontSizeBN,
				handleFontSizeChange,
				handleFontSizeChangeBN,
			}}>
			{children}
		</FontSizeContext.Provider>
	);
};

export default FontSizeContext;

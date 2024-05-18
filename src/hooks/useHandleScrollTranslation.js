import { useEffect, useState } from "react";

function useHandleScrollTranslation() {
	const [xTranslate, setXTranslate] = useState(0);
	const [yTranslate, setYTranslate] = useState(0);

	useEffect(() => {
		const handleTranslationXY = (event) => {
			if (event.deltaX !== 0) {
				setXTranslate((prevState) => {
					return prevState - event.deltaX;
				});
			}
			if (event.deltaY !== 0) {
				setYTranslate((prevState) => {
					return prevState - event.deltaY;
				});
			}
		};

		document.addEventListener("wheel", handleTranslationXY, {
			passive: false,
		});

		return () => {
			document.removeEventListener("wheel", handleTranslationXY);
		};
	}, []);

	return [xTranslate, yTranslate];
}

export default useHandleScrollTranslation;

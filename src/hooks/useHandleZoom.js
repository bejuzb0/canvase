import { useEffect, useState } from "react";

const MAX_ZOOM = 5;
const MIN_ZOOM = 1;
function useHandleZoom(mousePos, scrollCheck = true, keyboardCheck = true) {
	const [zoom, setZoom] = useState(2.0);
	const [zoomCenter, setZoomCenter] = useState({ x: 0, y: 0 });

	const zoomBasedOnKey = (e) => {
		if (document.activeElement.className === "textbox-textarea") return;
		switch (e.key) {
			case "+":
			case "=":
				setZoomCenter({
					x: mousePos.x / zoom,
					y: mousePos.y / zoom,
				});
				setZoom((prevState) => {
					return Math.min(MAX_ZOOM, prevState + 0.05);
				});

				break;

			case "-":
				setZoomCenter({
					x: mousePos.x / zoom,
					y: mousePos.y / zoom,
				});
				setZoom((prevState) => {
					return Math.max(MIN_ZOOM, prevState - 0.05);
				});
				break;
			default:
				break;
		}
	};
	useEffect(() => {
		const handleKeyboardZoom = (e) => {
			if (document.activeElement.className === "textbox-textarea") return;
			if (
				keyboardCheck &&
				(e.ctrlKey || e.metaKey) &&
				(e.key === "+" || e.key === "-" || e.key === "=")
			) {
				e.preventDefault();
				zoomBasedOnKey(e);
			} else if (e.ctrlKey === false && e.metaKey === false) {
				zoomBasedOnKey(e);
			}
		};

		const handleWheelZoom = (e) => {
			if (scrollCheck && e.ctrlKey) {
				e.preventDefault();
				if (e.deltaY > 0) {
					setZoom((prev) => Math.max(MIN_ZOOM, prev - 0.02));
				} else if (e.deltaY < 0) {
					setZoom((prev) => Math.min(MAX_ZOOM, prev + 0.02));
				}
				if (e.deltaX > 0) {
					setZoom((prev) => Math.max(MIN_ZOOM, prev - 0.02));
				} else if (e.deltaX < 0) {
					setZoom((prev) => Math.min(MAX_ZOOM, prev + 0.02));
				}
			}
		};

		document.addEventListener("keydown", handleKeyboardZoom);
		document.addEventListener("wheel", handleWheelZoom, {
			passive: false,
		});

		return () => {
			document.removeEventListener("keydown", handleKeyboardZoom);
			document.removeEventListener("wheel", handleWheelZoom);
		};
	}, [scrollCheck, keyboardCheck, mousePos, zoom]);

	return [zoom, zoomCenter];
}

export default useHandleZoom;

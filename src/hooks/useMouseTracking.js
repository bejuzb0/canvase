import { useEffect, useState } from "react";

function useMouseTracking(canvasRef) {
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	useEffect(() => {
		const handleMouseTracking = (e) => {
			const bounds = canvasRef.current.getBoundingClientRect();
			let x = e.clientX - bounds.left;
			let y = e.clientY - bounds.top;
			setMousePos({
				x: x,
				y: y,
			});
		};

		document.addEventListener("mousemove", handleMouseTracking);

		return () => {
			document.removeEventListener("mousemove", handleMouseTracking);
		};
	}, [canvasRef]);

	return mousePos;
}

export default useMouseTracking;

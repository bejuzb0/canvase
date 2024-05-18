import React from "react";
import "./Rectangles.css";
import Outline from "../Outline/Outline";
function Rectangles({
	props,
	zoom,
	xTranslate,
	yTranslate,
	selectCallBack,
	index,
}) {
	const handleClick = () => {
		selectCallBack(index);
	};
	return (
		props.coords.endX !== undefined && (
			<div
				className="rectangle-shape"
				onClick={handleClick}
				style={{
					top: (props.coords.startY + yTranslate) * zoom * 1.0 + "px",
					left:
						(props.coords.startX + xTranslate) * zoom * 1.0 + "px",
					height:
						(props.coords.endY - props.coords.startY) * zoom * 1.0 +
						"px",
					width:
						(props.coords.endX - props.coords.startX) * zoom * 1.0 +
						"px",
				}}>
				{props.isSelected && <Outline />}
			</div>
		)
	);
}

export default Rectangles;

import React, { useRef, useEffect } from "react";
import "./Textbox.css";
import Outline from "../Outline/Outline";
function Textbox({
	props,
	zoom,
	xTranslate,
	yTranslate,
	selectCallBack,
	index,
	updateTextCallBack,
}) {
	const textAreaRef = useRef(null);
	const handleClick = () => {
		selectCallBack(index);
	};

	const handleTextAreaChange = (event, zoom) => {
		updateTextCallBack(index, textAreaRef.current.value);
	};

	useEffect(() => {
		//Done to reset height of textarea when text is changed
		textAreaRef.current.style.height = "1px";
		textAreaRef.current.style.height =
			20 + textAreaRef.current.scrollHeight + "px";
	}, [props.text]);

	return (
		props.coords.endX !== undefined && (
			<div
				className="textbox-shape"
				onClick={handleClick}
				style={{
					top: (props.coords.startY + yTranslate) * zoom * 1.0 + "px",
					left:
						(props.coords.startX + xTranslate) * zoom * 1.0 + "px",
					minHeight:
						(props.coords.endY - props.coords.startY) * zoom * 1.0 +
						"px",
					width:
						(props.coords.endX - props.coords.startX) * zoom * 1.0 +
						"px",
				}}>
				{props.isSelected && <Outline />}
				<textarea
					ref={textAreaRef}
					className="textbox-textarea"
					autoFocus={true}
					style={{
						fontSize: 15 * zoom + "px",
					}}
					defaultValue={props.text}
					onChange={(e) => handleTextAreaChange(e, zoom)}></textarea>
			</div>
		)
	);
}

export default Textbox;

import React, { useState, useRef } from "react";
import "./canvas.css";
import ElementFactory from "../DrawingElements/ElementFactory/ElementFactory";
import FloatingToolBox from "../FloatingToolBox/floatingToolBox";
import useHandleZoom from "../../hooks/useHandleZoom";
import useHandleScrollTranslation from "../../hooks/useHandleScrollTranslation";
import useMouseTracking from "../../hooks/useMouseTracking";
import useObjectRenderAndDelete from "../../hooks/useObjectRenderAndDelete";

function Canvas() {
	const [drawElements, setDrawElements] = useState([]);
	const [recordPositions, setRecordPositions] = useState(false);
	const [currentElementType, setCurrentElementType] = useState("RECTANGLE");
	const [drawElementBoxCoord, setDrawElementBoxCoord] = useState({});

	const canvasRef = useRef(null);
	const mousePos = useMouseTracking(canvasRef);

	const [zoom, zoomCenter] = useHandleZoom(mousePos);
	const [xTranslate, yTranslate] = useHandleScrollTranslation();

	useObjectRenderAndDelete(
		setDrawElements,
		currentElementType,
		drawElementBoxCoord
	);

	const updateTextCallbackFn = (elementIndex, text) => {
		setDrawElements((prevState) => {
			let temp = [...prevState];
			temp[elementIndex].text = text;
			return temp;
		});
	};

	const selectObjectCallBackFn = (data) => {
		setDrawElements((prevState) => {
			let temp = [...prevState];
			temp.forEach((element) => {
				element.isSelected = false;
			});
			temp[data].isSelected = true;
			return temp;
		});

		setDrawElements((prevState) => {
			let temp = [...prevState];
			console.log("select callback", temp);
			const removeIndex = temp.findIndex(
				(element) =>
					element.type === "TEXTBOX" &&
					element.isSelected === false &&
					element.text === ""
			);
			if (removeIndex > -1) temp.splice(removeIndex, 1);
			return temp;
		});
	};

	const onDrawingStartCallbackFn = (event) => {
		//event.preventDefault();
		if (recordPositions) {
			// Deselect if anything is already selected
			setDrawElements((prevState) => {
				let temp = [...prevState];
				const selectedIdx = temp.findIndex(
					(element) => element.isSelected
				);
				if (selectedIdx > -1) temp[selectedIdx].isSelected = false;
				return temp;
			});

			let x = mousePos.x;
			let y = mousePos.y;
			x = x / zoom;
			y = y / zoom;
			setDrawElementBoxCoord((prevState) => {
				return {
					...prevState,
					startX: x - xTranslate,
					startY: y - yTranslate,
				};
			});
		}
	};

	const onDrawingEndCallbackFn = (event) => {
		event.preventDefault();
		if (recordPositions) {
			let x = mousePos.x;
			let y = mousePos.y;
			x = x / zoom;
			y = y / zoom;

			if (currentElementType === "TEXTBOX") {
				y = drawElementBoxCoord.startY + 30;
			}

			setDrawElementBoxCoord((prevState) => {
				let coordTemp = Object.assign({}, prevState);

				coordTemp.endX = x - xTranslate;
				coordTemp.endY = y - yTranslate;

				// Needed in case rectangle is drawn from bottom-right to top-left
				if (coordTemp.endX < coordTemp.startX) {
					let tempX = coordTemp.endX;
					coordTemp.endX = coordTemp.startX;
					coordTemp.startX = tempX;
				}
				if (coordTemp.endY < coordTemp.startY) {
					let tempY = coordTemp.endY;
					coordTemp.endY = coordTemp.startY;
					coordTemp.startY = tempY;
				}

				return coordTemp;
			});
			setTimeout(() => {
				setRecordPositions(false);
				setDrawElementBoxCoord({});
			}, 200);
		}
		//console.log(drawElements)
	};

	const canvasOnClickCallbackFn = (event) => {
		console.log(event, "recordPositions");

		if (recordPositions === false && event.target.className === "canvas") {
			setDrawElements((prevState) => {
				console.log(prevState);
				let temp = [...prevState];
				temp.forEach((element) => {
					element.isSelected = false;
				});
				return temp;
			});
			setDrawElements((prevState) => {
				let temp = [...prevState];
				console.log("select callback", temp);
				const removeIndex = temp.findIndex(
					(element) =>
						element.type === "TEXTBOX" &&
						element.isSelected === false &&
						element.text === ""
				);
				if (removeIndex > -1) temp.splice(removeIndex, 1);
				return temp;
			});
		}
	};

	return (
		<div>
			<div
				className="canvas"
				ref={canvasRef}
				onMouseDown={(e) => onDrawingStartCallbackFn(e)}
				onClick={(e) => canvasOnClickCallbackFn(e)}
				onMouseUp={(e) => onDrawingEndCallbackFn(e)}
				style={{
					transform: "scale(" + zoom + ")",
					transformOrigin: `${zoomCenter.x}px ${zoomCenter.y}px`,
				}}>
				{drawElements.map((element, index) => {
					return (
						<ElementFactory
							key={index}
							index={index}
							props={element}
							zoom={1}
							xTranslate={xTranslate}
							yTranslate={yTranslate}
							selectCallBack={selectObjectCallBackFn}
							updateTextCallBack={updateTextCallbackFn}
						/>
					);
				})}
			</div>
			<FloatingToolBox
				setObjectType={(e) => setCurrentElementType(e)}
				setRecording={(e) => setRecordPositions(e)}
			/>
		</div>
	);
}

export default Canvas;

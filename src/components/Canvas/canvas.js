import React, { useState, useRef } from "react";
import "./canvas.css";
import ElementFactory from "../DrawingElements/ElementFactory/ElementFactory";
import FloatingToolBox from "../FloatingToolBox/floatingToolBox";
import useHandleZoom from "../../hooks/useHandleZoom";
import useHandleScrollTranslation from "../../hooks/useHandleScrollTranslation";
import useMouseTracking from "../../hooks/useMouseTracking";
import useObjectRenderAndDelete from "../../hooks/useObjectRenderAndDelete";

function Canvas() {
	const [drawingObjectList, setDrawingObjectList] = useState([]); // List of objects to be drawn on the canvas
	const [recordPositions, setRecordPositions] = useState(false); // Flag to denote if drawing is in progress
	const [currentElementType, setCurrentElementType] = useState("RECTANGLE");
	const [currentObjectBox, setCurrentObjectBox] = useState({}); // To store the type, coordinates, text and selection status of the current object

	const canvasRef = useRef(null);
	const mousePos = useMouseTracking(canvasRef); // Custom hook to track mouse position, used during zoom

	const [zoom, zoomCenter] = useHandleZoom(mousePos); // Custom hook to prevent default zoom on Cmd + "+/-" and pinch and apply custom zoom logic
	const [xTranslate, yTranslate] = useHandleScrollTranslation(); // Custom hook to handle canvas translation on scroll

	useObjectRenderAndDelete(
		setDrawingObjectList,
		currentElementType,
		currentObjectBox
	);

	//Event Handler function to update text for the textbox in list
	const updateTextCallbackFn = (elementIndex, text) => {
		setDrawingObjectList((prevState) => {
			let temp = [...prevState];
			temp[elementIndex].text = text;
			return temp;
		});
	};

	//Event Handler function to select an object in the list and hence "highlight" it
	const selectObjectCallBackFn = (data) => {
		setDrawingObjectList((prevState) => {
			let temp = [...prevState];
			temp.forEach((element) => {
				element.isSelected = false;
			});
			temp[data].isSelected = true;
			return temp;
		});

		setDrawingObjectList((prevState) => {
			let temp = [...prevState];
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

	//Event Handler function to start drawing an object
	const onDrawingStartCallbackFn = (event) => {
		if (recordPositions) {
			// Deselect if anything is already selected
			setDrawingObjectList((prevState) => {
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
			setCurrentObjectBox((prevState) => {
				return {
					...prevState,
					startX: x - xTranslate,
					startY: y - yTranslate,
				};
			});
		}
	};

	//Event handler function to end drawing an object
	const onDrawingEndCallbackFn = (event) => {
		event.preventDefault();
		if (recordPositions) {
			let x = mousePos.x;
			let y = mousePos.y;
			x = x / zoom;
			y = y / zoom;

			// For textbox, the object height is fixed at 30px initially and adjusted later based on text.
			if (currentElementType === "TEXTBOX") {
				y = currentObjectBox.startY + 30;
			}

			setCurrentObjectBox((prevState) => {
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
				setCurrentObjectBox({});
			}, 200);
		}
	};

	//Callback function to handle click on canvas. Deselect any object if clicked outside the object and remove empty textboxes
	const canvasOnClickCallbackFn = (event) => {
		if (recordPositions === false && event.target.className === "canvas") {
			setDrawingObjectList((prevState) => {
				let temp = [...prevState];
				temp.forEach((element) => {
					element.isSelected = false;
				});
				return temp;
			});

			setDrawingObjectList((prevState) => {
				let temp = [...prevState];

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
				{drawingObjectList.map((element, index) => {
					return (
						<ElementFactory
							key={index}
							index={index}
							props={element}
							zoom={1} // Initially this was used to change top, height, width, left of objects based on zoom, later transitioned to canvas scaling based zoom so this is set to 1. (Can be removed )
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

import { useEffect } from "react";

function useObjectRenderAndDelete(
	setDrawingObjectList,
	currentElementType,
	currentObjectBox
) {
	/**
	 * This hook is used only for deleting objects on "Backspace/Delete"(on mac) and Rendering any object once it's been added to the object list
	 * For Callback actiions related to object rendering see Canvas.js
	 */

	const handleObjectDeletion = (event) => {
		if (document.activeElement.className !== "textbox-textarea") {
			switch (event.key) {
				case "Backspace":
				case "Delete":
					setDrawingObjectList((prevState) => {
						let temp = [...prevState];
						const removeIndex = temp.findIndex(
							(element) => element.isSelected
						);
						if (removeIndex > -1) temp.splice(removeIndex, 1);
						return temp;
					});
					break;

				default:
			}
		}
	};
	useEffect(() => {
		window.addEventListener("keydown", handleObjectDeletion);
		return () => {
			window.removeEventListener("keydown", handleObjectDeletion);
		};
	}, []);

	useEffect(() => {
		if (currentObjectBox.endX !== undefined) {
			setDrawingObjectList((prevState) => {
				return [
					...prevState,
					{
						type: currentElementType,
						coords: currentObjectBox,
						text: "",
						isSelected: true,
					},
				];
			});
		}
	}, [currentObjectBox]);
}

export default useObjectRenderAndDelete;

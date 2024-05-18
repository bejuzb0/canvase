import React from "react";
import "./floatingbox.css";
function FloatingToolBox({ setObjectType, setRecording }) {
	const setCurrentObjectType = (e) => {
		setObjectType(e.target.value);
		setRecording(true);
	};

	return (
		<div className="floating-box">
			<div>
				<button onClick={setCurrentObjectType} value="RECTANGLE">
					Rectangle
				</button>
				<button onClick={setCurrentObjectType} value="TEXTBOX">
					Text
				</button>
			</div>
		</div>
	);
}

export default FloatingToolBox;

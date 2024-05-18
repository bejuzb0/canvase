import React from "react";
import Rectangles from "../Rectangles/Rectangles";
import Textbox from "../Textbox/Textbox";

function ElementFactory({
	props,
	zoom,
	xTranslate,
	yTranslate,
	selectCallBack,
	updateTextCallBack,
	index,
}) {
	switch (props.type) {
		case "RECTANGLE":
			return (
				<Rectangles
					props={props}
					zoom={zoom}
					xTranslate={xTranslate}
					yTranslate={yTranslate}
					selectCallBack={selectCallBack}
					index={index}
				/>
			);
		case "TEXTBOX":
			return (
				<Textbox
					props={props}
					zoom={zoom}
					xTranslate={xTranslate}
					yTranslate={yTranslate}
					selectCallBack={selectCallBack}
					updateTextCallBack={updateTextCallBack}
					index={index}
				/>
			);
		default:
			return <></>;
	}
}

export default ElementFactory;

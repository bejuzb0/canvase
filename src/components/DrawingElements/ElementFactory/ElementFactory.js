import React from 'react'
import Rectangles from '../Rectangles/Rectangles'
import Textbox from '../Textbox/Textbox'

function ElementFactory({props, zoom, xTranslate,yTranslate}) {
    switch(props.type) {
        case "RECTANGLE":
            return <Rectangles props={props} zoom = {zoom} xTranslate={xTranslate} yTranslate={yTranslate}/>
        case "TEXTBOX":
            return <Textbox props={props} zoom = {zoom}  xTranslate={xTranslate} yTranslate={yTranslate}/>
        default: return <></>
    }
  
}

export default ElementFactory
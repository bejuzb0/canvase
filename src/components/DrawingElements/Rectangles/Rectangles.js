import React from 'react'
import './Rectangles.css'
function Rectangles({props, zoom,  xTranslate,yTranslate}) {
    console.log(zoom, "zoomrec")
  return (
    props.coords.endX !== undefined &&
    <div className='rectangle-shape' style={{
        top:((props.coords.startY+yTranslate)/zoom*1.0)+"px",
        left: ((props.coords.startX+xTranslate)/zoom*1.0)+"px",
        height: (props.coords.endY-props.coords.startY)/zoom*1.0+"px",
        width:(props.coords.endX-props.coords.startX)/zoom*1.0+"px",
        backgroundColor:  "red"
    }}></div>
  )
}

export default Rectangles
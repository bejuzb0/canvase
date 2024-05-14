import React, { useEffect, useState } from 'react'
import './canvas.css'
import ElementFactory from '../DrawingElements/ElementFactory/ElementFactory';
import FloatingToolBox from '../FloatingToolBox/floatingToolBox';




function Canvas() {
  const [drawElements, setDrawElements] = useState([]);
  const [recordPositions, setRecordPositions] = useState(false);
  const [currentElementType, setCurrentElementType] = useState("RECTANGLE");
  const [drawElementBoxCoord, setDrawElementBoxCoord] = useState({});
  const [zoom, setZoom] = useState(1.0);
  const [xTranslate, setXTranslate] = useState(50)
  const [yTranslate, setYTranslate] = useState(0)
  useEffect(()=> {
    if(drawElementBoxCoord.endX != undefined) {
      console.log(drawElementBoxCoord, "in useEffect")
      setDrawElements(prevState => {
        return [...prevState, {type:currentElementType, coords: drawElementBoxCoord, text: ""}]
      });
    }
  }, [drawElementBoxCoord])

  const rectangleBtnClick = () => {
    console.log("REcctange clicked")
    setRecordPositions(true);
    setCurrentElementType("RECTANGLE");
    setDrawElementBoxCoord({})
  }

  const textBoxBtnClick = () => {
    console.log("Textbox clicked")
    setRecordPositions(true);
    setCurrentElementType("TEXTBOX");
  } 
  const onDragStartFn = (event) => {
    console.log("Mouse down")
    if(recordPositions) {
      const bounds = event.target.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      setDrawElementBoxCoord(prevState => {
        return {...prevState, startX : x, startY: y};
      });
    }
  }

  const handleSroll = (event) => {
    console.log(event)

  }
  
  const onDragEndFn = (event) => {
    //setRecordPositions(false)
    if(recordPositions) {
      const bounds = event.target.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      console.log(x, y, "mouse up")
      setDrawElementBoxCoord(prevState => {
        let coordTemp = Object.assign({}, prevState)
        console.log("prev state", coordTemp)

        coordTemp.endX = x;
        coordTemp.endY = y;
        console.log("After set", coordTemp)
        return coordTemp;
        
      });
      setRecordPositions(false)
    
      
    }
    //console.log(drawElements)
  }

  
  return (
    <div>
      <div className='canvas' onMouseDown={(e) => onDragStartFn(e)} onMouseUp={(e) => onDragEndFn(e)} onWheel={(e) => handleSroll(e)}>
        {
        drawElements.map((element, index) => {
          return <ElementFactory key={index} props={element} zoom={zoom} xTranslate = {xTranslate} yTranslate= {yTranslate}/>
        })
        }
      </div>
      <FloatingToolBox rectangleCallback={rectangleBtnClick} textBoxCallback={textBoxBtnClick}/>
    </div>
  )
}

export default Canvas
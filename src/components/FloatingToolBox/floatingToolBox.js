import React from 'react'
import './floatingbox.css'
function FloatingToolBox({rectangleCallback, textBoxCallback}) {
  return (
    <div className='floating-box'>
        <div>
            <button onClick={rectangleCallback}>Rectangle</button>
            <button onClick={textBoxCallback}>Text</button>
        </div>
    </div>
  )
}

export default FloatingToolBox
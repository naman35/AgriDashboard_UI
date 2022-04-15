import React from 'react'
import './Popup.css'
import IndiaMap from "./IndiaMap";
function IndiaMapPopup(props){

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                    {console.log("YEP",props)}
                <IndiaMap callTrigger = {props.trigger}/>
            </div>

        </div>) : "" ;
}

export default IndiaMapPopup;
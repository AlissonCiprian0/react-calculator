import React, { useContext } from 'react';
import { CalcContext } from '../providers/calc';
import "./Display.css";

const Display = () => {
    const {display} = useContext(CalcContext);
    
    return (
        <div className='Display'>{display}</div>
    );
}
 
export default Display;
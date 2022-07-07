import { createContext, useEffect, useState } from "react";

export const CalcContext = createContext([]);

const Parser = require('expr-eval').Parser;

export function CalcProvider({ children }) {
    const [display, setDisplay] = useState('0');

    function clean() {
        setDisplay('0');
    }

    function calculate() {
        let expression = Parser.parse(display);
        let result = expression.evaluate({ x: 1 });

        setDisplay(result + '');
    }

    function input(buttonValue) {
        if (buttonValue === 'AC') clean();
        else if (buttonValue === '=') calculate();
        else if (buttonValue === '+' || buttonValue === '-' ||
                 buttonValue === '*' || buttonValue === '/') {
            if ((display.length === 1 && display !== '0') || (display.length > 1)) {
                if (display.slice(-1) !== ' ') {
                    // Update display values
                    setDisplay(display + ' ' + buttonValue + ' ');
                }
            }
        }
        else {
            if (display.length === 1 && display === '0') {
                setDisplay(buttonValue + '');
            }
            else {
                setDisplay(display + buttonValue);
            }
        }
    }

    return (
        <CalcContext.Provider value={{ display, input }}>
            {children}
        </CalcContext.Provider>
    );
}
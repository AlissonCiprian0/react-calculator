import { createContext, useEffect, useState } from "react";

export const CalcContext = createContext([]);

const Parser = require('expr-eval').Parser;

export function CalcProvider({ children }) {
    const [value, setValue] = useState([]);
    const [display, setDisplay] = useState('0');

    const aux = {
        breakChunks: (str, size) => {
            const numChunks = Math.ceil(str.length / size)
            const chunks = new Array(numChunks);
            
            for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
                chunks[i] = str.substr(o, size);
            }
            
            return chunks;
        }
    }

    function log() {
        console.log(value);
    }

    function clean() {
        setValue([]);
        setDisplay('0');
    }

    function calculate() {
        let expression = Parser.parse(display);
        let result = expression.evaluate({ x: 1 });

        setDisplay(result + '');
    }

    const legacy = {
        structure: () => {
            // 1 - Separate equation groups in the values
            for (let i = 0; i <= value.length; i++) {
                if (value[i] === "/" || value[i] === "*") {
                    value[i - 1] = {conjunto: {valores: [value[i-1], value[i+1]]}, operador: value[i]}
                    value.splice(i, 2);   
                }
            }

            // 2 - Verify which positions are conjuncts
            let conjuncts = [];

            value.map((element, i) => {
                if (typeof element === 'object') conjuncts.push(i);
            });

            // 3 - Execute needed calcs in conjuncts
            //  Make a full copy of the items
            let items = [...value];

            if (conjuncts.length > 0) {
                conjuncts.map((position, i) => {
                    //  Make a copy of the item you want to mutate
                    let item = items[position];
    
                    //  Update de element
                    if (item.operador === '/')
                        item = calculate.divide(item.conjunto.valores[0], item.conjunto.valores[1]);
                    else if (item.operador === '*')
                        item = calculate.multiply(item.conjunto.valores[0], item.conjunto.valores[1]);
    
                    items[position] = item;
                });
            }
        },
        divide: (a, b) => {
            return a / b;
        },
        multiply: (a, b) => {
            return a * b;
        },
        sum: (a, b) => {
            return a + b;
        },
        sub: (a, b) => {
            return a - b;
        }
    }

    function input(buttonValue) {
        if (buttonValue === 'AC') clean();
        // Legacy
        // else if (buttonValue === '=') calculate.structure();
        else if (buttonValue === '=') calculate();
        else if (buttonValue === '+' || buttonValue === '-' || buttonValue === '*' || buttonValue === '/') {
            if ((display.length === 1 && display !== '0') || (display.length > 1)) {
                if (display.slice(-1) !== ' ') {
                    // Update display values
                    setDisplay(display + ' ' + buttonValue + ' ');

                    // Insert value
                    value.push(buttonValue);
                }
            }
        }
        else {
            if (display.length === 1 && display === '0') {
                setDisplay(buttonValue + '');
                // setValue([...value, parseInt(buttonValue)]);
                value.push(parseInt(buttonValue));
            }
            else {
                // if its a math sign
                if (display.slice(-1) === ' ') {
                    value.push(parseInt(buttonValue));
                }
                // if its a number
                else {
                    let lastItem = value[value.length - 1];
                    value.pop();

                    value.push(parseInt(lastItem + '' + buttonValue));
                }

                setDisplay(display + buttonValue);
            }
        }
    }

    useEffect(() => {
        if (value.length > 0)
            log();
    }, [value]);

    return (
        <CalcContext.Provider value={{ value, display, input }}>
            {children}
        </CalcContext.Provider>
    );
}
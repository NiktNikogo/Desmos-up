
import { MutableRefObject, useEffect, useRef, useState } from 'react';
//import * as Desmos from 'desmos';

interface CalcProps {
    width: string,
    height: string,
}

function DesmosCalculator({width, height}: CalcProps) {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const [desmos, setDesmos] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Desmos) {
      const calculator = (window as typeof window & { Desmos: typeof Desmos }).Desmos.GraphingCalculator(
        calculatorRef.current!,
        { folders: true, invertedColors: true, notes: true }
      );
      if (calculator) {
        setDesmos(calculator);
        calculator.setExpression({ latex: 'y=x^2' });
      }
    }
  }, []);
  const callback = () => {
    console.log(desmos);
    desmos.setExpression({id:'chuj', latex: 'y=x'});
    console.log(desmos.getState());
    if (desmos) {
      desmos.setExpression({ latex: 'y=x^3' });
      console.log("chujs");
    }
  }
  return (
    <div>
      <button onClick={callback} >chuj</button>
      <div ref={calculatorRef} style={{ width: width, height: height }}></div>
    </div>
  );
}

export default DesmosCalculator;
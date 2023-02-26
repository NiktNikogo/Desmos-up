
import { MutableRefObject, useEffect, useRef, useState } from 'react';
//import * as Desmos from 'desmos';

interface CalcProps {
    width: string,
    height: string,
    onCalculatorLoad: (calculator: Desmos.Calculator) => void
}

function DesmosCalculator({width, height, onCalculatorLoad}: CalcProps) {
  let calculatorRef = useRef<HTMLDivElement>(null);
  const [desmos, setDesmos] = useState<Desmos.Calculator>();
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Desmos ) {
      
      let calculator = (window as typeof window & { Desmos: typeof Desmos }).Desmos.GraphingCalculator(
        calculatorRef.current!,
        { folders: true, invertedColors: true, notes: true }
      );
      if (calculator) {
        setDesmos(calculator);
        calculator.setExpression({ latex: 'y=x^2' });
        onCalculatorLoad(calculator);
      }
      if (calculatorRef.current!.childElementCount > 1) {
        calculatorRef.current!.removeChild(calculatorRef.current!.firstChild!);
      }
      
    }
 
  }, []);
  return (
    <div>
      <div ref={calculatorRef} style={{ width: width, height: height }}></div>
    </div>
  );
}

export default DesmosCalculator;
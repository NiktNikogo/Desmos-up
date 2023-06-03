import {useEffect, useRef, useState } from 'react';

interface CalcProps {
    width: string,
    height: string,
    onCalculatorLoad: (calculator: any) => void
}

function DesmosCalculator({width, height, onCalculatorLoad}: CalcProps) {
  let calculatorRef = useRef<HTMLDivElement>(null);
  const [desmos, setDesmos] = useState<any>();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      
      let calculator = (window as typeof window & { Desmos: any }).Desmos.GraphingCalculator(
        calculatorRef.current!,
        { folders: true, invertedColors: false, notes: true}
      );
      if (calculator) {
        setDesmos(calculator);
        calculator.setExpression({ latex: 'y=x^2', });
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
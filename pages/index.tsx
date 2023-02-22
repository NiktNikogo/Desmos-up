
import { useEffect, useState } from "react";
import DesmosCalculator from "../components/DesmosCalculator"
import * as Desmos from 'desmos';

function Home() {
  const [height, setHeight] = useState<string>("400px");
  const [calculator, setCalculator] = useState<any>(null);

  useEffect( ()=> {
    const updateHeight = ()=> {
      setHeight(`${window.innerHeight}px`);
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [])
  const callback = () => {
    console.log("chuj");
    calculator.setExpresion('y=x^(-1)')
  }
  return (
    <div>
      <DesmosCalculator  width="60%" height={height}/>
    </div>
  );
}

export default Home;
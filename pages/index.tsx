
import { useEffect, useRef, useState } from "react";
import DesmosCalculator from "../components/DesmosCalculator"
import CodeTab from "../components/CodeTab"
import TabsManager from "../components/TabsManager";
import Image from "next/image";

//import * as Desmos from 'desmos';

function Home() {
  const [height, setHeight] = useState<string>("400px");
  const [calculator, setCalculator] = useState<Desmos.Calculator>();
  const [width, setWidth] = useState<string>("60vw");
  useEffect(() => {
    const updateHeight = () => {
      setHeight(`${window.innerHeight}px`);
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [])
  return (
    <div style={{ display: "flex" }}>
      <DesmosCalculator onCalculatorLoad={(calculator) => setCalculator(calculator)} width={width} height={height} />
      <div style={{position: "relative"}}>
        <div style={{display: "inline"}}>
          <TabsManager calculator={calculator!}/>
        </div>
        <button style={{
           position: 'absolute', 
           left: '-44px', 
           top: '180px', 
           zIndex: '999' 
        }} onClick={ () => {
          if(width == "60vw") {
            setWidth("100vw");
          } else {
            setWidth("60vw");
          }
        }}>
          <Image src={"/button.png"} alt="guzor" width={37} height={37}/>
        </button>
      </div>
    </div>
  );
}

export default Home;
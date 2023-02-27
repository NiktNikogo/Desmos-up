
import { useEffect, useRef, useState } from "react";
import DesmosCalculator from "../components/DesmosCalculator"
import CodeTab from "../components/CodeTab"
import TabsManager from "../components/TabsManager";
//import * as Desmos from 'desmos';

function Home() {
  const [height, setHeight] = useState<string>("400px");
  const [calculator, setCalculator] = useState<Desmos.Calculator>();

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
      <DesmosCalculator onCalculatorLoad={(calculator) => setCalculator(calculator)} width="60vw" height={height} />
      {/* <CodeTab tab_id="101" calculator={calculator!}/> */}
      <TabsManager calculator={calculator!}/>
    </div>
  );
}

export default Home;
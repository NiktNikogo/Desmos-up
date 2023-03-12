
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
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleBtn = () => {
    const btn = document.getElementById("my-hide-button");
    const calcDiv = document.getElementById("calc-div");
    if (btn && calcDiv) {
      setCollapsed(!collapsed);
    }
  }

  useEffect(() => {
    const updateHeight = () => {
      setHeight(`${window.innerHeight}px`);
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [])
  useEffect(() => {
    setWidth(collapsed ? "60vw" : "100vw");
  }, [collapsed])

  return (
    <div style={{ display: "flex" }}>
      <div id="calc-div">
        <DesmosCalculator onCalculatorLoad={(calculator) => setCalculator(calculator)} width={width} height={height} />
      </div>
      <div id="script-div" style={{ position: "relative" }} >
        <div style={{ display: "inline" }}>
          <TabsManager calculator={calculator!} />
        </div>
        <div style={{
          position: 'absolute',
          left: '-42px',
          top: '180px',
          zIndex: '999',
          textAlign: "center",
          background: "#121212",
          width: "37px",
          height: "37px",
          borderRadius: "5px",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: "1px",
          borderStyle: "solid",
          boxShadow: "0 0 5px rgb(0 0 0 / 15%)"
        }}
          className="dcg-tooltip-hit-area-container"
          onClick={() => {
            toggleBtn();
          }}>
          <div id="my-hide-button" className={collapsed ? "rotate-clockwise" : "rotate-anticlockwise"}>
            <label style={{ color: "#999" }}>
              ☛
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
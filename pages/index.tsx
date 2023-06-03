/// <reference types="@types/desmos" />
import Console from "@/components/Console";
import { useEffect, useState } from "react";
import DesmosCalculator from "../components/DesmosCalculator"
import TabsManager from "../components/TabsManager";
import Toggle from "../components/Toggle"

function Home() {
  const [height, setHeight] = useState<string>("400px");
  const [calculator, setCalculator] = useState<Desmos.Calculator>();
  const [width, setWidth] = useState<string>("60vw");
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [lightMode, setLightMode] = useState<boolean>(true);
  const [consoleOpen, setConsoleOpen] = useState<boolean>(false);

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

  const showConsole = () => {
    setConsoleOpen(!consoleOpen);
    const btnlabel = document.getElementById("show-console");
    if (btnlabel) {
      if(btnlabel.textContent?.includes("🐞")) {
        btnlabel.textContent = "🖥️";
      }
    }
    //🐞
  }
  
  return (
    <div style={{ display: "flex" }}>
      <div id="calc-div">
        <DesmosCalculator onCalculatorLoad={(calculator) => setCalculator(calculator)} width={width} height={height} />
      </div>
      <div className={lightMode ? "light-mode" : "dark-mode"}>
        <div id="script-div" style={{ position: "relative" }} >
          <div /*style={{ display: "inline" }}*/ className="tab_container">
            <TabsManager calculator={calculator!} lightMode={lightMode}
              codeHeight={consoleOpen ? "40vh" : "81vh"} />
            <Console show={consoleOpen} />
          </div>

          <div className="collumn_container" style={{ width: "37px", height: "37px", left: "-42px", top: "230px", position: "absolute" }}>
            <Toggle label_id ="hide-code" onChange={() => { setCollapsed(!collapsed) }} content="☛"
              classChanged="rotate-anticlockwise" classDefault="rotate-clockwise" />
            <Toggle label_id ="color-mode" onChange={() => { setLightMode(!lightMode); }} content="💡"
              classChanged="lightMode" classDefault="darkMode" />
            <Toggle label_id ="show-console" onChange={() => { showConsole() }} content="🖥️"
              classChanged="" classDefault="" />
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
/// <reference types="@types/desmos" />
import { useEffect, useState } from "react";
import DesmosCalculator from "../components/DesmosCalculator"
import TabsManager from "../components/TabsManager";


function Home() {
  const [height, setHeight] = useState<string>("400px");
  const [calculator, setCalculator] = useState<Desmos.Calculator>();
  const [width, setWidth] = useState<string>("60vw");
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [lightMode, setLightMode] = useState<boolean>(false);

  const toggleHide = () => {
    setCollapsed(!collapsed);
  }
  const toggleMode = () => {
    setLightMode(!lightMode);
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
      <div className={lightMode ? "light-mode" : "dark-mode"}>
        <div id="script-div" style={{ position: "relative" }} >
          <div style={{ display: "inline" }}>
            <TabsManager calculator={calculator!} lightMode={lightMode} />
          </div>
          <div className="util-button"
            style={{ left: "-42px", top: "230px", width: "37px", height: "37px", position: "absolute"}}
            onClick={() => {
              toggleHide();
            }}>
            <div id="my-hide-button" className={collapsed ? "rotate-clockwise" : "rotate-anticlockwise"}>
              <label style={{ cursor: "pointer" }}>
                ☛
            </label>
            </div>
          </div>
          <div className="util-button"
            style={{ left: "-42px", top: "273px", width: "37px", height: "37px", position: "absolute" }}
            onClick={() => {
              toggleMode()
            }}>
            <div id="change-light-mode" className={lightMode ? "lightMode" : "darkMode"}>
              <label style={{ cursor: "pointer" }}>
                💡
            </label>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
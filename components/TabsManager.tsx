import { useEffect, useRef, useState } from "react";
import CodeTab from "../components/CodeTab"
import styles from './TabsManager.module.css';
import ReactDOM from "react-dom";

interface TabsManagerProps {
    calculator: Desmos.Calculator;
}

function TabsManager({ calculator }: TabsManagerProps) {
    const [activeTab, setActiveTab] = useState<string>("tab_1");
    const counterRef = useRef<number>(1);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        for (let i = 0; i < counterRef.current; i++) {
            let tabContent = document.getElementById(`tab_${i}`);
            let tab = document.getElementById(`tab_${i}_check`);
            if (`tab_${i}` === tabId) {
                tabContent?.setAttribute("class", "");
                tabContent?.classList.add(`${styles.tab_content_active}`);
                tab?.setAttribute("class", "");
                tab?.classList.add(`${styles.tab_item_active}`);
            } else {
                tabContent?.setAttribute("class", "");
                tabContent?.classList.add(`${styles.tab_content}`);
                tab?.setAttribute("class", "");
                tab?.classList.add(`${styles.tab_item}`);
            }
        }
    }
    const handleAddingTab = () => {
        const tabList = document.getElementById("tab-list");
        const tabContentList = document.getElementById("tab-content-list");
        const name = `Tab ${counterRef.current}`;
        const id = `tab_${counterRef.current}`;
        setActiveTab(id);

        const newTab = document.createElement("li");
        newTab.id = `tab_${counterRef.current}_check`
        newTab.className = `${styles.tab_item}`;
        newTab.dataset.tab = id;
        newTab.textContent += name;
        newTab.addEventListener("click", () => {
            handleTabClick(id)
        })

        const newButton = document.createElement("button");
        newButton.id = `tab_${counterRef.current}_remove`
        newButton.className = `${styles.rmvBtn}`;
        newButton.onclick = () => { handleRemove(id) };
        newButton.textContent = "remove";
        
        const newDiv = document.createElement("div");
        newDiv.id = `tab_${counterRef.current}_div`;
        newDiv.className = `${styles.myContainer}`;

        newDiv?.appendChild(newTab);
        newDiv.appendChild(newButton);
        tabList?.appendChild(newDiv);

        const newContent = document.createElement("div");
        newContent.id = id;
        newContent.className = `${styles.tab_content}`;
        ReactDOM.render(<CodeTab calculator={calculator} tab_id={id} />, newContent);
        tabContentList?.append(newContent);
        counterRef.current += 1;

    }
    const handleRemove = (id: string) => {
        console.log(id);
        const tabList = document.getElementById("tab-list");
        const tabListChild = document.getElementById(id + "_div");
        console.log(tabList);
        console.log(tabListChild);
        console.log(tabList?.children);
        if (tabListChild)
            tabList?.removeChild(tabListChild);
        const tabContentList = document.getElementById("tab-content-list");
        const tabContentChild = document.getElementById(id);
        if (tabContentChild)
            tabContentList?.removeChild(tabContentChild);
    }
    return (
        <div className={styles.tab_container}>
            <div className={styles.tab_list_container}>
                <ul id="tab-list" className={styles.tab_list}>
                    <button className={styles.myBtn} onClick={handleAddingTab}>New tab</button>
                    <div id="tab_0_div" style={{ display: "flex", flexDirection: "column"}}>
                        <li id="tab_0_check" className={styles.tab_item_active} onClick={() => handleTabClick('tab_0')} data-tab="tab_0">Tab 0 </li>
                        <button id="tab_0_remove" className={styles.rmvBtn} onClick={() => handleRemove("tab_0")}>remove</button>
                    </div>
                </ul>
            </div>
            <div id="tab-content-list" className={styles.tab_content_container}>
                <div id="tab_0" className={styles.tab_content_active}>
                    <CodeTab calculator={calculator} tab_id="tab_0" />
                </div>
            </div>
        </div>
    )
}

export default TabsManager;
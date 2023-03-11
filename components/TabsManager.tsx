import { MutableRefObject, useEffect, useRef, useState } from "react";
import CodeTab from "../components/CodeTab"
import styles from './TabsManager.module.css';
import ReactDOM from "react-dom";

interface TabsManagerProps {
    calculator: Desmos.Calculator;
}
function TabsManager({ calculator }: TabsManagerProps) {
    const [activeTab, setActiveTab] = useState<string>("tab_1");
    const [usedTabs, setUsedTabs] = useState<[string]>(["tab_1"]);
    const counterRef = useRef<number>(1);
    const checkRef = useRef<boolean>(false);
    const handleLocalTabs = () => {
        if (!checkRef.current) {
            if (!localStorage.getItem("tabs")) {
                localStorage.setItem("tabs", JSON.stringify({}));
            }
            const localTabs = localStorage.getItem("tabs");
            const tempTabs = usedTabs;
    
            if (localTabs) {
                const tabsObj = JSON.parse(localTabs);
                for (const [key, value] of Object.entries(tabsObj)) {
                    if (activeTab.indexOf(key) == -1) {
                        tempTabs.push(key);
                    }
                }
            }
            setUsedTabs(tempTabs);
        }
        checkRef.current = true;
    }
    useEffect(() => {
        handleLocalTabs();
    }, []);

    const handleAddingTab = (new_idx = -1) => {
        if (new_idx != -1) {
            counterRef.current = new_idx;
        }
        do {
            counterRef.current++;
        } while (usedTabs.indexOf(`tab_${counterRef.current}`) != -1);
        const id = `tab_${counterRef.current}`;
        const tempTabs = usedTabs;
        tempTabs.push(id);
        setUsedTabs(tempTabs);
        setActiveTab(id);
    }
    const handleGraphRemoving = (id: string) => {
        let to_delete = [];
        for (const expr of calculator.getExpressions()) {
            if (expr.id?.includes(id)) {
                to_delete.push({ id: expr.id });
            }
        }
        calculator.removeExpressions(to_delete);
    }
    const handleRemove = (id: string) => {
        const tabList = document.getElementById("tab-list");
        const tabListChild = document.getElementById(id + "_div");
        if (tabListChild)
            tabList?.removeChild(tabListChild);
        const tabContentList = document.getElementById("tab-content-list");
        const tabContentChild = document.getElementById(id);
        if (tabContentChild)
            tabContentList?.removeChild(tabContentChild);
        localStorage.removeItem(id);
        handleGraphRemoving(id);
    }
    return (
        <div>
            <div className={styles.tab_container}>
                <div className={styles.tab_list_container}>
                    <ul id="tab-list" className={styles.tab_list}>
                        <button className={styles.myBtn} onClick={() => { handleAddingTab() }}>New tab</button>
                        {usedTabs.map((tab_id) => {
                            return (
                                <div key={tab_id} id={`${tab_id}_div`} style={{ display: "flex", flexDirection: "column" }}>
                                    <li id={`${tab_id}_check`} className={tab_id === activeTab ? styles.tab_item_active : styles.tab_item}
                                        onClick={() => { setActiveTab(tab_id) }} data-tab={tab_id}>{tab_id} </li>
                                    <button id={`${tab_id}_remove`} className={styles.rmvBtn} onClick={() => handleRemove(tab_id)}>remove</button>
                                </div>
                            );
                        })
                        }
                    </ul>
                </div>
                <div id="tab-content-list" className={styles.tab_content_container}>
                    {usedTabs.map((tab_id) => {
                        return (
                            <div key={tab_id} className={tab_id === activeTab ? styles.tab_content_active : styles.tab_content} id={tab_id}>
                                <CodeTab calculator={calculator} tab_id={tab_id} />
                            </div>);
                    })
                    }
                </div>
            </div>
        </div>
    )
}

export default TabsManager;
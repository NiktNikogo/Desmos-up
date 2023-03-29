import { MutableRefObject, useEffect, useRef, useState } from "react";
import CodeTab from "../components/CodeTab"
import styles from './TabsManager.module.css';
import ReactDOM from "react-dom";

interface TabsManagerProps {
    calculator: Desmos.Calculator;
}
function TabsManager({ calculator }: TabsManagerProps) {
    const [activeTab, setActiveTab] = useState<string>("tab_1");
    const [usedTabs, setUsedTabs] = useState<Set<string>>(new Set(["tab_1"]));
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
                        tempTabs.add(key)
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
    const handleAddingTab = (new_idx: string | number = -1) => {
        
        let id = "";
        if (typeof (new_idx) == "number") {
            if (new_idx != -1) {
                counterRef.current = new_idx;
            }
            do {
                counterRef.current++;
            } while (usedTabs.has(`tab_${counterRef.current}`));
            id = `tab_${counterRef.current}`;
        }
        else {
            id = new_idx;
        }
        console.log(typeof(new_idx))
        const tempTabs = usedTabs;
        tempTabs.add(id);
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
        const local = localStorage.getItem("tabs");
        if (local) {
            let localObj = JSON.parse(local);
            delete localObj[id];
            localStorage.setItem("tabs", JSON.stringify(localObj));
        }
        handleGraphRemoving(id);
    }
    const handleRenameTab = (oldName: string, newName: string) => {
        let tempTabs = usedTabs;
        tempTabs.delete(oldName);
        const local = localStorage.getItem("tabs");
        if (local) {
            const jsonLocal = JSON.parse(local);
            const localCode = jsonLocal[oldName];
            if (localCode) {
                jsonLocal[newName] = localCode;
                delete jsonLocal[oldName]
                localStorage.setItem("tabs", JSON.stringify(jsonLocal));

            }
        }
        setUsedTabs(tempTabs);
        handleAddingTab(newName);
    }
    return (
        <div>
            <div className={styles.tab_container}>
                <div className={styles.tab_list_container}>
                    <ul id="tab-list" className={styles.tab_list}>
                        <button className={styles.myBtn} onClick={() => { handleAddingTab() }}>New tab</button>
                        {
                            Array.from(usedTabs).map((tab_id) => {
                                return (
                                    <div key={tab_id} id={`${tab_id}_div`} style={{ display: "flex", flexDirection: "column" }}>
                                        <div className={tab_id === activeTab ? styles.tab_item_active : styles.tab_item}>
                                            <div style={{ display: "flex", flexDirection: "row", width: "100%" }} >
                                                <li id={`${tab_id}_check`}
                                                    onClick={() => { setActiveTab(tab_id) }} data-tab={tab_id}>{tab_id}
                                                </li>
                                                <button className={styles.desmosBtn} onClick={() => {
                                                    const newName = prompt(`Rename ${tab_id} to: `);
                                                    if (newName) {
                                                        handleRenameTab(tab_id, newName);
                                                    }
                                                }}> 🖊️ </button>
                                            </div>
                                            <div id={`${tab_id}_remove`} style={{ width: "100", marginTop: "4px" }} className={styles.desmosBtn} onClick={() => handleRemove(tab_id)}> remove </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </ul>
                </div>
                <div id="tab-content-list" className={styles.tab_content_container}>
                    {
                        Array.from(usedTabs).map((tab_id) => {
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
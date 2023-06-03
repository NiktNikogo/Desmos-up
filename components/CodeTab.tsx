import React, { useRef, useCallback, useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { bbedit } from "@uiw/codemirror-theme-bbedit"
import { langs } from "@uiw/codemirror-extensions-langs";
import RunSandboxCode from "../components/MySandbox";
import { addFolderWithMembers } from '../lib/desmosUtils'
import { clearConsole, writeFailure } from "@/lib/consoleUtils";

interface CodeTabProps {
    calculator: any,
    tab_id: string,
    lightMode: boolean,
    height: string
}
function deleteAllMentions(calc: any, id: string) {
    calc.removeExpression({id: id});
    console.log(calc.getState());
}
function genAllowedFunctions(calc: any) {
    const allowed_functions = {
        __makeExpr: (obj: Object, id: string): any => {
            let finalObj = {latex: "", color: "", secret: false, hidden: false, id: id}
            if ("x" in obj || "y" in obj) {
                const x = "x" in obj ? obj["x"] as string : "0";
                const y = "y" in obj ? obj["y"] as string : "0";
                finalObj["latex"] = String.raw`\left( ${x}, ${y} \right)`;
            } else  {
                finalObj["latex"] = "expr" in obj ? obj["expr"] as string : "";
            }
            finalObj["color"] = "color" in obj ? obj["color"] as string : "#DEAD00";
            finalObj["secret"] = "secret" in obj ? obj["secret"] as boolean : false;
            finalObj["hidden"] = "hidden" in obj ? obj["hidden"] as boolean : false;
            return finalObj
        },
        __gatherExpressions: (exprs: any[], id: string) => {
            addFolderWithMembers(id, id, calc, exprs);
        }
    }
    return allowed_functions;
}
function CodeTab({ calculator, tab_id, lightMode, height }: CodeTabProps) {

    const editorRef = useRef<HTMLDivElement>(null);
    const [id, setId] = useState<string>(tab_id);
    const [startingCode, setStartingCode] = useState<string>(
        `const next_y = (x) => {
    return x * x;
}
let x = 1;
let y = 1;
let start = -2;
let end = 2;
for (i = start; i <= end; i++) {
    x = i
    y = next_y(x);
    yield {x:x, y:y, c:"#DEAD00"};
}`
    );
    const editorCodeValueRef = useRef<string>(startingCode);
    const ids: Array<string> = [];
    useEffect(() => {
        const local = localStorage.getItem("tabs");
        if (local) {
            const localCode = JSON.parse(local)[tab_id];
            if (localCode) {
                setStartingCode(localCode);
                editorCodeValueRef.current = localCode;
            }
        } else {

        }
    }, []);
    const runCode = () => {
        deleteAllMentions(calculator, tab_id);
        const err = RunSandboxCode(
            {
                code: editorCodeValueRef.current,
                timeout: 1000,
                global_functions: genAllowedFunctions(calculator),
                run_from_id: id,
            }
        );
        if (err) {
            writeFailure(`@${tab_id}: ${err}`)
            console.log(`error @${tab_id}:\n ${err}`)
            const btnLabel = document.getElementById("show-console");
            if(btnLabel) {
                btnLabel.textContent = "🐞";
            }
        }
        const tabs = localStorage.getItem("tabs");
        if (tabs) {
            let tabsObj = JSON.parse(tabs);
            tabsObj[tab_id] = editorCodeValueRef.current;
            localStorage.setItem("tabs", JSON.stringify(tabsObj));
        }
    }
    const onChange = useCallback((value: any, viewUpdate: any) => {
        editorCodeValueRef.current = value;
    }, []);
    return (
        <div>
            <button className="change-button" onClick={runCode}> run </button>
            <button className="change-button" onClick={() => { deleteAllMentions(calculator, tab_id) }}> clear </button>
            <button className="change-button" onClick={clearConsole}>clear output</button>
            <div ref={editorRef}>
                <CodeMirror
                    value={startingCode}
                    height={height}
                    width="39vw"
                    theme={lightMode ? bbedit : okaidia}
                    extensions={[langs.javascript()]}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}

export default CodeTab;
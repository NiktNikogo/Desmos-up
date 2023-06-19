import React, { useRef, useCallback, useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { bbedit } from "@uiw/codemirror-theme-bbedit"
import { langs } from "@uiw/codemirror-extensions-langs";
import RunSandboxCode from "../components/MySandbox";
import { addFolderWithMembers, addToTable, createSlider, createTable, ExprObject, getSequenceFromId, Point, Sequence } from '../lib/desmosUtils'
import { clearConsole, writeFailure } from "@/lib/consoleUtils";

interface CodeTabProps {
    calculator: any,
    tab_id: string,
    lightMode: boolean,
    height: string
}
function deleteAllMentions(calc: any, id: string) {
    calc.removeExpression({ id: id });
    console.log(calc.getState());
}

function genAllowedFunctions(calc: any, tab_id: string) {
    const allowed_functions = {
        __makeExpr: (obj: Object, id: string): ExprObject => {
            return ExprObject.makeProper(obj, id);
        },
        __gatherExpressions: (exprs: ExprObject[], id: string) => {
            addFolderWithMembers(id, id, calc, exprs);
        },
        makeSlider: (name: string, initValue: number, min: number, max: number, step: number) => {
            console.log(tab_id, initValue, min, max, step, name);

            createSlider(calc, tab_id, {
                min: min,
                max: max,
                step: step,
                initValue: initValue,
                varName: name,
            });

        },
        getSequence: (tab_id: string): Array<Point> => {
            return getSequenceFromId(calc, tab_id);
        },
        makeTable: (name: string, columns: Array<object> = []) => {
            createTable(calc, name);
            if (columns.length > 0) {
                columns.forEach((column) => {
                    const seq = Sequence.createFromObj(column);
                    addToTable(calc, name, seq.name, seq.values);
                });
            }
        },
        addToTable(name: string, columns: Array<object>) {
            columns.forEach((column) => {
                const seq = Sequence.createFromObj(column);
                addToTable(calc, name, seq.name, seq.values);
            });
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
    yield {x:x, y:y, color:"#DEAD00"};
}`
    );
    const editorCodeValueRef = useRef<string>(startingCode);
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
                global_functions: genAllowedFunctions(calculator, tab_id),
                run_from_id: id,
            }
        );
        if (err) {
            writeFailure(`@${tab_id}: ${err}`)
            console.log(`error @${tab_id}:\n ${err}`)
            const btnLabel = document.getElementById("show-console");
            if (btnLabel) {
                btnLabel.textContent = "🐞";
            }
        }
        const tabs = localStorage.getItem("tabs");
        if (tabs) {
            let tabsObj = JSON.parse(tabs);
            tabsObj[tab_id] = editorCodeValueRef.current;
            localStorage.setItem("tabs", JSON.stringify(tabsObj));
        }
        console.log(calculator.getState())
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
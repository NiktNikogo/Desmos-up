import React, { useRef, useCallback, useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { bbedit } from "@uiw/codemirror-theme-bbedit"
import { langs } from "@uiw/codemirror-extensions-langs";
import RunSandboxCode from "../components/MySandbox";
import { ExprObject } from '../lib/desmosUtils'
import { clearConsole, writeFailure } from "@/lib/consoleUtils";

interface CodeTabProps {
    calculator: Desmos.Calculator,
    tab_id: string,
    lightMode: boolean,
    height: string
}
function deleteAllMentions(calc: Desmos.Calculator, toDelete: ExprObject[]) {
    let allExprs = toDelete.length;
    for (let i = 0; i < allExprs; i++) {
        let new_expr = toDelete[i]
        new_expr.hidden = true;
        calc.setExpression(new_expr); // this is somehow faster?
        //calc.removeExpression(new_expr);
    }
    toDelete = [];
}
function genAllowedFunctions(savedExpressions: ExprObject[], calc: Desmos.Calculator) {
    const allowed_functions = {
        __point: (x: string, y: string, color: string, id: string, secret = false, hidden = false): Object => {
            return { latex: String.raw`\left( ${x}, ${y} \right)`, color: color, id: id, secret: secret, hidden: hidden };
        },
        __expression: (expr: string, color: string, id: string, secret = false, hidden = false): Object => {
            return { latex: expr, color: color, id: id, secret: secret, hidden: hidden };
        },
        __gatherExpressions: (exprs: ExprObject[]) => {
            let allExprs = exprs.length;
            for (let i = 0; i < allExprs; i++) {
                savedExpressions.push(exprs[i]);
                calc.setExpression(exprs[i]);
            }

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
for (i= start; i <= end; i++) {
    x = i
    y = next_y(x);
    yield [x, y, "#DEAD00"];
}`
    );
    const editorCodeValueRef = useRef<string>(startingCode);
    const ids: Array<ExprObject> = [];
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
    const callback = () => {
        deleteAllMentions(calculator, ids);
        const err = RunSandboxCode(
            {
                code: editorCodeValueRef.current,
                timeout: 1000,
                global_functions: genAllowedFunctions(ids, calculator),
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
            <button className="change-button" onClick={callback}> run </button>
            <button className="change-button" onClick={() => { deleteAllMentions(calculator, ids) }}> clear </button>
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
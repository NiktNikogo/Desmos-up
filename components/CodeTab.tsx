import React, { useRef, useCallback, useState, ButtonHTMLAttributes, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { langNames, langs } from "@uiw/codemirror-extensions-langs";
import RunSandboxCode from "../components/MySandbox";
import styles from './CodeTab.module.css';

interface CodeTabProps {
    calculator: Desmos.Calculator,
    tab_id: string,
}
interface ExprObject {
    latex: string,
}
function deleteAllMentions(calc: Desmos.Calculator, id: string) {
    let to_delete = [];
    for (const expr of calc.getExpressions()) {
        if (expr.id?.includes(id)) {
            to_delete.push({ id: expr.id });
        }
    }
    calc.removeExpressions(to_delete);
}

function genAllowedFunctions(calc: Desmos.Calculator) {
    const allowed_functions = {
        __point: (x: string, y: string, color: string, id: string, secret = false): Object => {
            return { latex: String.raw`\left( ${x}, ${y} \right)`, color: color, id: id, secret: secret };
        },
        __expression: (expr: string, color: string, id: string, secret = false): Object => {
            return {latex: expr, color: color, id: id, secret: secret};
        },
        __gatherExpressins: (exprs: [ExprObject]) => {
            for(const expr in exprs) {
                console.log(exprs[expr].latex)
            }
            calc.setExpressions(exprs);
        }
    }
    return allowed_functions;
}
function CodeTab({ calculator, tab_id, }: CodeTabProps) {
    
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
    
    useEffect( () => {
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
        deleteAllMentions(calculator, id);
        const res = RunSandboxCode(
            {
                code: editorCodeValueRef.current,
                timeout: 1000,
                global_functions: genAllowedFunctions(calculator),
                run_from_id: id,
            }
        );
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
            <button className={styles.myBtn} onClick={callback}> run </button>
            <button className={styles.myBtn} onClick={() => {deleteAllMentions(calculator, id)}}> clear </button>
            <div ref={editorRef}>
                <CodeMirror
                    value={startingCode}
                    height="100vh"
                    width="40vw"
                    theme={okaidia}
                    extensions={[langs.javascript()]}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}

export default CodeTab;
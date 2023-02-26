import { useRef, useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import {langNames, langs} from "@uiw/codemirror-extensions-langs";
import RunSandboxCode from "../components/MySandbox";
import exp from "constants";

interface CodeTabProps {
    calculator: Desmos.Calculator,
    tab_id: string,
}
function deleteAllMentions(calc: Desmos.Calculator, id: string) {
    let to_delete = [];
    for (const expr of calc.getExpressions()) {
        if (expr.id?.includes(id)) {
            to_delete.push({id: expr.id});
        }
    }
    calc.removeExpressions(to_delete);
}
function genAllowedFunctions(calc: Desmos.Calculator){
    const allowed_functions = {
        point: (x:string, y:string, color:string, id:string, secret = false) => {
            calc.setExpression({latex: String.raw`\left( ${x}, ${y} \right)`, color: color, id: id, secret: secret});
        },
        set_point_with_color: (x: string,y: string, color: string) =>{
            calc.setExpression({latex: String.raw`\left( ${x}, ${y} \right)`, color: color})
        },
        set_point: (x: string, y: string) => {
            calc.setExpression({latex: String.raw`\left( ${x}, ${y} \right)`})
        },
        set_table: (xs: string[], ys:string[]) => {
            calc.setExpression({
                type:"table",
                columns: [
                    {
                        latex:"x",
                        values: xs
                    },
                    {
                        latex:"y",
                        values: ys
                    }
                ]
            });
        }
    }
    return allowed_functions;
}
function CodeTab({ calculator, tab_id, }: CodeTabProps) {
    const [id, setId] = useState<string>(tab_id);
    const defaultCode = `const next_y = (x) => {
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
}`;
    const editorCodeValueRef = useRef<string>(defaultCode);
    const callback = () => {
        deleteAllMentions(calculator, id);
        console.log("Code run");
        const res = RunSandboxCode(
            {
                code: editorCodeValueRef.current,
                timeout: 1000,
                global_functions: genAllowedFunctions(calculator),
                run_from_id: id,
            }
        );
        if (res) {
            console.log(res);
        }
    }
    const onChange = useCallback((value: any, viewUpdate: any) => {
        editorCodeValueRef.current = value;
    }, []);

    return (
        <div>
            <button style={{background: "#272822", color: "#9effff"}} onClick={callback}> run </button>
            <CodeMirror
                value={defaultCode}
                height="100vh"
                width="40vw"
                theme={okaidia}
                extensions={[langs.javascript()]}
                onChange={onChange}
            />
        </div>
    )
}

export default CodeTab;
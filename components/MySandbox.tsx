import vm from "vm-browserify"
import {writeInformation, writeSucces, writeToConsoleWithColor} from "../lib/consoleUtils"

export interface sandboxProps {
    timeout: number,
    code: string,
    global_functions: object,
    run_from_id: string;
}
function RunSandboxCode({ code, timeout, global_functions, run_from_id}: sandboxProps) {
    let sandbox = {
        console_log: (...args: any[]) => {
            console.log("@vm: ", ...args);
            writeToConsoleWithColor(`@${run_from_id}: ${args}\n`, "white");
        }
        
    }
    const sandbox_allowed = {...sandbox, ...global_functions};
    const options = {
        timeout: timeout
    };
    const code_to_run = 
`const __main = function *() {
     console.log = console_log;
    
` +    
    code +
`}
let __expressions = [];
let __i = 0
for (const __val of __main()) {
    const __expr = __makeExpr(__val, "${run_from_id}" + "$" + __i.toString())
    __expressions.push(__expr);
    __i += 1;
}
__gatherExpressions(__expressions, "${run_from_id}");
        `;
    writeInformation(`Attempting to run code from @${run_from_id}`);
    try {
        vm.runInNewContext(code_to_run, sandbox_allowed, options);
    } catch (error){
        return error
    }
    writeSucces(`Code from @${run_from_id} ran successfully`)
}

export default RunSandboxCode;
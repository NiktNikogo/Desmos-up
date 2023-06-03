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
__expressions = [];
for (const __val of __main()) {
    if(__val.length === 3) { 
        const __expr = __point(__val[0].toString(), __val[1].toString(), __val[2].toString(), "${run_from_id}" + "_" + __val[0].toString() + "_" + __val[1].toString(), secret=true, hidden=false)
        __expressions.push(__expr);
    }
    else if(__val.length === 2) {
        const __expr = __expression(__val[0].toString(), __val[1].toString(), "${run_from_id}" + "_" + __val[0].toString(), secret=false, hidden=false)
        __expressions.push(__expr);
    }
}
__gatherExpressions(__expressions);
        `;
    //console.log("code -> vm: ", code_to_run);
    writeInformation(`Attempting to run code from @${run_from_id}`);
    try {
        vm.runInNewContext(code_to_run, sandbox_allowed, options);
    } catch (error){
        return error
    }
    writeSucces(`Code from @${run_from_id} run successfully`)
}

export default RunSandboxCode;
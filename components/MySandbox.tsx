import vm from "vm-browserify"

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
        }
    }
    const sandbox_allowed = {...sandbox, ...global_functions};
    const options = {
        timeout: timeout
    };
    const code_to_run = 
`const __main = function *() {` +    
    code +
`}
__expressions = [];
for (const __val of __main()) {
    if(__val.length === 3) { 
        const __expr = __point(__val[0].toString(), __val[1].toString(), __val[2].toString(), "${run_from_id}" + "_" + __val[0].toString() + "_" + __val[1].toString(), secret=true)
        __expressions.push(__expr);
    }
    else if(__val.length === 2) {
        const __expr = __expression(__val[0].toString(), __val[1].toString(), "${run_from_id}" + "_" + __val[0].toString(), secret=false)
        __expressions.push(__expr);
    }
}
__gatherExpressins(__expressions);
        `;
    //console.log("code -> vm: ", code_to_run);
    
    const res =vm.runInNewContext(code_to_run, sandbox_allowed, options);
    return res;
}

export default RunSandboxCode;
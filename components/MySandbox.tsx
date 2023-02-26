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
`const main = function *() {` +    
    code +
`}
for (const val of main()) {
    point(val[0].toString(), val[1].toString(), val[2].toString(), ${run_from_id} + "_" + val[0].toString(), secret=true)
} 
        `;
    console.log(code_to_run);
    
    const res =vm.runInNewContext(code_to_run, sandbox_allowed, options);
    return res;
}

export default RunSandboxCode;
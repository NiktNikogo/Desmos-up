interface ConsoleProps {
    show: boolean
}

function Console({ show }: ConsoleProps) {

    return <div id="console" style={{ display: show ? "block" : "none"}} />
    
}

export default Console;
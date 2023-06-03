function writeToConsole(msg: string) {
    const console = document.getElementById("console");
    if(console) {
        console.innerHTML += msg + "<br>";
    }
} 
function clearConsole() {
    const console = document.getElementById("console");
    if(console){
        console.innerHTML= "";
    }
}
function writeToConsoleWithColor(msg: string, color: string) {
    writeToConsole(`<span style="color: ${color};">${msg}</span>`);
}
function writeFailure(msg: string) {
    writeToConsoleWithColor(msg, "red");
}
function writeWarning(msg: string) {
    writeToConsoleWithColor(msg, "yellow");
}
function writeSucces(msg: string) {
    writeToConsoleWithColor(msg, "green");
}
function writeInformation(msg: string) {
    writeToConsoleWithColor(msg, "blue");
}
 
export {
    writeToConsole,
    writeToConsoleWithColor,
    writeFailure,
    writeWarning,
    writeSucces,
    writeInformation,
    clearConsole,
}
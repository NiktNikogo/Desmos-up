function addFolderWithMembers(folderId: string, folderTitle: string, calc: any, members: Array<ExprObject>) {
    let state = calc.getState();
    console.log(state);
    let expressions = state["expressions"];
    expressions["list"].push({
        type: "folder", id: folderId, hidden: false,
        secret: true, title: folderTitle
    });
    let accInX = 0;
    let accInY = 0;
    members.map((expr) => {
        if (expr.sequenctialInX && expr["y"]) {
            accInX += 1;
            expr.setCoords(accInX.toString(), expr["y"]);
            expr.latex = expr.getLatexFromCoords();
        } else if (expr.sequenctialInY && expr["x"]) {
            accInY += 1;
            expr.setCoords(expr["x"], accInY.toString());
            expr.latex = expr.getLatexFromCoords();
        }
        expressions["list"].push({ ...expr, type: "expression", folderId: folderId });
    });
    state["expressions"] = expressions;
    calc.setState(state);
}

interface SliderConfig {
    min: number,
    max: number,
    step: number,
    initValue: number,
    varName: string
}

function createSlider(calc: any, tab_id: string, { initValue, min, max, step, varName }: SliderConfig) {
    calc.setExpression({
        id: tab_id+"$slider$"+varName,
        latex: `${varName} = ${initValue.toString()}`,
        sliderBounds: { min: min, max: max, step: step}
    })
}

interface ExprProps {
    latex: string,
    color?: string,
    id?: string,
    secret?: boolean,
    hidden?: boolean
}

class ExprObject {
    latex: string;
    color?: string;
    id?: string;
    secret?: boolean = true;
    hidden?: boolean = true;
    sequenctialInX: boolean = false;
    sequenctialInY: boolean = false;
    x?: string;
    y?: string;
    constructor({ latex, color, id, secret, hidden }: ExprProps) {
        this.latex = latex;
        this.color = color;
        this.id = id;
        this.secret = secret;
        this.hidden = hidden;
    }
    setCoords(newX: string, newY: string) {
        if (this.sequenctialInX || this.sequenctialInY) {
            this.x = newX
            this.y = newY
        }
    }
    getLatexFromCoords(): string {
        if (this.x && this.y) {
            return String.raw`\left( ${this.x}, ${this.y} \right)`;
        } else {
            return this.latex;
        }
    }
    static makeProper(obj: Object, id: string): ExprObject {
        let finalObj = new ExprObject({ latex: "", id: id });
        if ("x" in obj || "y" in obj) {
            finalObj.x = "x" in obj ? obj["x"] as string : "0";
            finalObj.sequenctialInX = "x" in obj ? false : true;

            finalObj.y = "y" in obj ? obj["y"] as string : "0";
            finalObj.sequenctialInY = "y" in obj ? false : true;

            finalObj.latex = String.raw`\left( ${finalObj.x}, ${finalObj.y} \right)`;
        } else {
            finalObj.latex = "expr" in obj ? obj["expr"] as string : "";
        }
        finalObj.color = "color" in obj ? obj["color"] as string : "#DEAD00";
        finalObj.secret = "secret" in obj ? obj["secret"] as boolean : false;
        finalObj.hidden = "hidden" in obj ? obj["hidden"] as boolean : false;
        return finalObj
    }
}

function getSequenceFromId(calc: any, tab_id: string) {
    const re = new RegExp(String.raw`^${tab_id}\$[0-9]+`);
    const exprs: Array<any> = calc.getExpressions();
    const fromTab = exprs.filter( (expr) => {
        const id: string = expr["id"];
        return re.test(id);
    })
    console.log(fromTab);
}

export { addFolderWithMembers, ExprObject, createSlider, getSequenceFromId };

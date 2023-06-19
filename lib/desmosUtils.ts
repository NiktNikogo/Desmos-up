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
        id: tab_id + "$slider$" + varName,
        latex: `${varName} = ${initValue.toString()}`,
        sliderBounds: { min: min, max: max, step: step }
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

class Point {
    x: string | number;
    y: string | number;
    constructor(x: string | number, y: string | number) {
        this.x = x;
        this.y = y;
    }
}

function getSequenceFromId(calc: any, tab_id: string, parse: boolean = true): Array<Point> {
    const re = new RegExp(String.raw`^${tab_id}\$[0-9]+`);
    const exprs: Array<any> = calc.getExpressions();
    const fromTab = exprs.filter((expr) => {
        const id: string = expr["id"];
        return re.test(id);
    })
    const points: Array<Point> = [];
    fromTab.forEach((expr: ExprObject) => {
        const latex = expr.latex;
        const x = latex.slice(latex.indexOf("left") + 6, latex.indexOf(","));
        const y = latex.slice(latex.indexOf(",") + 2, latex.indexOf("rigth") - 7);
        if (parse) {
            points.push(new Point(Number(x), Number(y)))
        }
    })
    return points;
}

function createTable(calc: any, tableId: string) {
    calc.setExpression({ type: "table", id: tableId, columns: [] });
}

function addToTable(calc: any, tableId: string, columnName: string, columnValues: Array<string>) {
    let exprs = calc.getExpressions();
    let table = exprs.filter((expr: object) => {
        if ("id" in expr)
            return expr["id"] === tableId
    })[0];
    const id = tableId.split("$")[0];
    console.log(columnValues);
    console.log(id)
    table.columns.push({
        latex: columnName, values: columnValues,
        secret: true, hidden: true, folderId: tableId.split("$")[0]
    })
    console.log(table);
    calc.setExpression(table);
}

class Sequence {
    name: string;
    values: Array<string>;
    color: string = "#DEAD00";
    constructor(name: string, values: Array<string> = [], color: string = "#DEAD00") {
        this.name = name;
        this.values = values;
        this.color = color;
    }
    public addValue(value: string) {
        this.values.push(value);
    }
    static createFromObj(obj: Object): Sequence {
        let name: string = "";
        if ("name" in obj) {
            name =  (obj.name as string);
        }
        let data: Array<string> = [];
        if ("values" in obj) {
            data = (obj.values as string[]);
        }
        let color: string = "#DEAD00";
        if ("color" in obj) {
            color =(obj.color as string); 
        }
        return new Sequence(name, data, color);
    }
    public makeDesmosColumn(): object {
        return {latex: this.name, values: this.values, color:this.color};
    }

}

export {
    addFolderWithMembers, ExprObject,
    createSlider, getSequenceFromId,
    createTable, addToTable, Point,
    Sequence
};

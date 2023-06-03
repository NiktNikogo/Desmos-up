function addFolderWithMembers(folderId: string, folderTitle: string, calc: any, members: Array<any>) {
    let state = calc.getState();
    console.log(state);
    let expressions = state["expressions"];
    expressions["list"].push({ type: "folder", id: folderId, hidden: false, 
        secret: true, title: folderTitle});
    members.map( (expr) => {
        expressions["list"].push({...expr, type:"expression", folderId: folderId});
    });
    state["expressions"] = expressions;
    calc.setState(state);
}

interface ExprObject {
    latex: string,
    color: string,
    id: string,
    secret: boolean,
    hidden: boolean,
}

export { addFolderWithMembers };
export type { ExprObject };

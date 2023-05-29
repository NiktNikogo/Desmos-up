/// <reference types="@types/desmos" />

function deleteAllWithMention(calc: Desmos.Calculator, mention: string) {

}
function deleteFromCalc(calc: Desmos.Calculator, toDelete: [string]) {

}
interface ExprObject {
    latex: string,
    color: string,
    id: string,
    secret: boolean,
    hidden: boolean,
}

export { deleteAllWithMention, deleteFromCalc };
export type { ExprObject };

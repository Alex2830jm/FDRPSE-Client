export interface QuestionsOptionsSchema {
    id: string,
    questions_id: string,
    opcion: string
}

export class QuestionsOptions implements QuestionsOptionsSchema {
    readonly id;
    readonly questions_id;
    readonly opcion;

    constructor(id: string, questions_id: string, opcion: string) {
        this.id = id;
        this.questions_id = questions_id;
        this.opcion = opcion;
    }
}
import { QuestionsInsideSection } from "../../infraestructure/http/dto/questions/QuestionsBySectionResponse";


interface QuestionsField {
    [key: string]: string;
}
export const createFieldQuestion = (questions: Array<QuestionsInsideSection>): QuestionsField => {

    return questions?.reduce((prev, curr) => {
        //prev = { ...prev, [`question_id_${curr.id}`]: ''}
        if(curr.type_question === 'closed') {
            prev = { ...prev, [`question_closed_id_${curr.id}`]: ''}
        } else {
            prev = { ...prev, [`question_id_${curr.id}`]: ''}
        }
        return prev;
    }, {}) || {};
}
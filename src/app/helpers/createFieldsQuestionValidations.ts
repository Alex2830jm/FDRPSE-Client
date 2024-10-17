import { QuestionsInsideSection } from '../../infraestructure/http/dto/questions/QuestionsBySectionResponse';

import * as Yup from 'yup';

export interface QuestionsField {
    [key: string]: string;
}

export const createFieldQuestionValidations = (questions: Array<QuestionsInsideSection>) => {
    return questions?.reduce((prev, curr) => {
        //prev = { ...prev, [`question_id_${curr.id}`]: Yup.string().required('Selecciona una opción') };
        prev = { ...prev, [`question_closed_id_${curr.id}`]: Yup.string().required('Selecciona una opción') };
        /* if(curr.type_question === 'closed') {
            prev = { ...prev, [`question_closed_id_${curr.id}`]: Yup.string().required('Selecciona una opción') };
        } else {
            prev = { ...prev, [`question_id_${curr.id}`]: Yup.string().required('Selecciona una opción') };
        } */
        return prev;
    }, {}) || {};
}
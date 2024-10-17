export interface SaveUserQuestionDto {
    "questions": Array<UserQuestion>
}

interface UserQuestion {
    question_id: string;
    qualification?: number | boolean;
    type: TypeSaveAnswer | string;
    //Se añadio como tipo de dato para guardar las respuestas opcionales
    option?: string;
    type_question?: string;
    fecha?: Date;
}

export type TypeSaveAnswer = 'section' | 'question';
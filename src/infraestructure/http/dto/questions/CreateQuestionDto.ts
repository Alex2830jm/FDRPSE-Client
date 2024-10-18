import { TypeQuestion } from '../../../../domain/models/SectionQuestions';
import { QuestionOptionResponseDto } from '../options';

export interface CreateQuestionDto {
    name                 : string;
    type                 : TypeQuestion;
    type_question       ?: string;
    category            ?: CommonQualificationItem;
    domain              ?: CommonQualificationItem;
    dimension_id        ?: string;
    qualification_id    ?: string;
    section_id           : number;
    question_options    ?: Array<QuestionOptionResponseDto>;
}


export interface CommonQualificationItem {
    id: number;
    qualification_id?: number;
}
import { TypeQuestion } from '../../../../domain/models/SectionQuestions';
import { CategoryResponseDto } from '../categories';
import { DimensionResponseDto } from '../dimensions';
import { DomainResponseDto } from '../domains';
import { QuestionOptionResponseDto } from '../options';
import { QualificationResponseDto } from '../qualifications';
import { SectionResponseDto } from '../sections';

export interface CommonQuestionResponseDto {
    id               : string;
    name             : string;
    type             : TypeQuestion;
    type_question   ?: string;
    question_options?: Array<QuestionOptionResponseDto>;
    created_at       : string;
    updated_at       : string;
    section         ?: SectionResponseDto,
    category        ?: CategoryResponseDto,
    qualification   ?: QualificationResponseDto,
    dimension        ?: DimensionResponseDto,
    domain          ?: DomainResponseDto
}

export interface QuestionResponseDto {
    question: CommonQuestionResponseDto
}
import { Category, Dimension, Domain, Qualification, QuestionsOptions, Section } from './';
import { SectionResponseDto } from '../../infraestructure/http/dto/sections';
import { CategoryResponseDto } from '../../infraestructure/http/dto/categories';
import { QualificationResponseDto } from '../../infraestructure/http/dto/qualifications';
import { DimensionResponseDto } from '../../infraestructure/http/dto/dimensions';
import { DomainResponseDto } from '../../infraestructure/http/dto/domains';
import { TypeQuestion } from './SectionQuestions';
import { QuestionOptionResponseDto } from '../../infraestructure/http/dto/options';

export interface QuestionSchema {
    id: string;
    name: string;
    type: TypeQuestion;
    type_question: string | null;
    question_options: Array<QuestionsOptions> | null;
    section: Section | null;
    category: Category | null;
    qualification: Qualification | null;
    dimension: Dimension | null;
    domain: Domain | null;
    createdAt: Date;
    updatedAt: Date;
}

export class Question implements QuestionSchema {

    readonly id;
    readonly name;
    readonly type;
    readonly type_question;
    readonly question_options;
    readonly section;
    readonly category;
    readonly qualification;
    readonly dimension;
    readonly domain;
    readonly createdAt;
    readonly updatedAt;

    constructor(
        id: string, 
        name: string, 
        type: TypeQuestion, 
        createdAt: string, 
        updatedAt: string,
        type_question?: string, 
        question_options?: Array<QuestionOptionResponseDto>,
        section?: SectionResponseDto, 
        category?: CategoryResponseDto, 
        qualification?: QualificationResponseDto, 
        dimension?: DimensionResponseDto, 
        domain?: DomainResponseDto
    ) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.type_question = type_question || null;
        this.question_options = question_options 
            ? question_options.map(({id, questions_id, opcion}) => new QuestionsOptions(id, questions_id, opcion))
            : null;
        this.section = section ? new Section(section.id, section.name, section.question, section.binary, section.questions_count, section.can_finish_guide, section.type, section.created_at, section.updated_at) : null;
        this.category = category ? new Category(category.id, category.name, category.created_at, category.updated_at) : null;
        this.qualification = qualification ? new Qualification(qualification.id, qualification.name, qualification.always_op, qualification.almost_alwyas_op, qualification.sometimes_op, qualification.almost_never_op, qualification.never_op, qualification.created_at, qualification.updated_at) : null;
        this.dimension = dimension ? new Dimension(dimension?.id, dimension?.name, dimension?.created_at, dimension?.updated_at) : null;
        this.domain = domain ? new Domain(domain?.id, domain?.name, domain?.created_at, domain?.updated_at) : null;
        this.createdAt = new Date(createdAt);
        this.updatedAt = new Date(updatedAt);
    }

}
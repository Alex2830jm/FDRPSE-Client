import { http } from '../http/http';
import { Question, QuestionOptions, QuestionPagination, QuestionsOpt } from '../../domain/models';
import { CreateQuestionDto, QuestionPaginationResponseDto, QuestionResponseDto, QuestionsBySectionResponse, QuestionsClosedResponseDto, SaveUserQuestionDto } from '../http/dto/questions';
import { CommonResponseDto } from '../http/dto/CommonResponseDto';
import { errorAlert, succesAlert } from '../alert/alerts';
import { TypeQuestion } from '../../domain/models/SectionQuestions';
import { QuestionOptionsDto } from '../http/dto/options';

export const questionRepository = {

    getQuestions: async (query: string): Promise<QuestionPagination | string> => {
        try {
            const { data, per_page, total } = await http.get<QuestionPaginationResponseDto>(`/auth/questions${query}`);
            return {
                perPage: per_page,
                total: total,
                questions: data.map(({ id, name, type, created_at, updated_at }) => new Question(id, name, type, created_at, updated_at)),
            }
        } catch (error) {
            return error as string;
        }
    },

    createQuestion: async (createQuestionDto: CreateQuestionDto): Promise<CommonResponseDto> => {
        try {
            const { message } = await http.post<CommonResponseDto>('/auth/questions/create', createQuestionDto);
            succesAlert(message);
            return { message, success: true }
        } catch (error) {
            errorAlert(error as string);
            return { message: error as string, success: false }
        }
    },

    getQuestionById: async (questionId: string): Promise<Question | string> => {
        try {
            const { question } = await http.get<QuestionResponseDto>(`/auth/questions/${questionId}`);
            return new Question(question.id, question.name, question.type, question.created_at, question.updated_at, question.type_question!, question.question_options!, question.section!, question.category!, question?.qualification, question?.dimension, question?.domain);
        } catch (error) {
            return error as string;
        }
    },

    getQuestionBySection: async (guideId: number, page: number): Promise<QuestionsBySectionResponse | string> => {
        try {
            const response = await http.get<QuestionsBySectionResponse>(`/auth/questions/section/${guideId}?page=${page}`);
            return {
                ...response,
                section: {
                    ...response.section,
                    canFinishGuide: response.section.can_finish_guide!,
                }
            };
        } catch (error) {
            return error as string;
        }
    },

    saveUserAnswers: async (surveyId: string, guideId: string, saveUserQuestionDto: SaveUserQuestionDto, type: TypeQuestion): Promise<CommonResponseDto> => {
        try {
            const { message } = await http.post<CommonResponseDto>(`/auth/surveys/save-questions/${surveyId}/guide/${guideId}?type=${type}`, saveUserQuestionDto);
            succesAlert(message);
            return { message, success: true }
        } catch (error) {
            errorAlert(error as string);
            return { message: error as string, success: false }
        }
    },


    //Petición que carga la preguntas con sus opciones y realiza el contenio de usuarios
    getOptionsFilterOne: async (surveyId: string, subareaId: string): Promise<Array<QuestionOptions> | string> => {
        try {
            const { options } = await http.get<QuestionOptionsDto>(`/auth/options/filterOne?surveyId=${surveyId}&subareaId=${subareaId}`);
            return options.map(({id, opcion, questions_id, countUsers}) => ({
                id, 
                opcion: opcion,
                questions_id: questions_id,
                countUsers: countUsers,
            }));
        } catch (error) {
            return error as string;
        }
    },

    getQuestionsClosed: async (): Promise<Array<QuestionsOpt> | string> => {
        try {
            const { questionsClosed } = await http.get<QuestionsClosedResponseDto>(`auth/options/questions_closed`);            
            return questionsClosed.map(({id, name}) => ({
                id,
                name: name
            }))
        } catch (error) {
            return error as string;
        }
    },

    getOptionsDifferent: async (option: string): Promise<Array<QuestionOptions> | string> => {
        try {
            const { options } = await http.get<QuestionOptionsDto>(`/auth/options/different?option=${option}`);
            return options.map(({id, opcion, questions_id }) => ({
                id,
                opcion: opcion,
                questions_id: questions_id
            }))
        } catch (error) {
            return error as string;
        }
    },

}
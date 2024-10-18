import { useCallback, useContext, useState } from 'react';
import { QuestionContext } from '../../infraestructure/context/questions';
import { questionRepository } from '../../infraestructure/repositories/question.respository';
import type { CreateQuestionDto, SaveUserQuestionDto } from '../../infraestructure/http/dto/questions';
import { QuestionsField } from '../../app/helpers/createFieldsQuestionValidations';
import { useNavigation } from '../../app/hooks/useNavigation';
import { TypeSaveAnswer } from '../../infraestructure/http/dto/questions/SaveUserQuestionDto';
import { QuestionOptions, QuestionsOpt } from '../models';

export const questionService = () => {

    const { dispatch, questions, question, sectionQuestions, totalQuestions, currentPage, questionsPagination } = useContext(QuestionContext);
    const [options, setOptions] = useState<Array<QuestionOptions>>([]);
    const [optionsD, setOptionsD] = useState<Array<QuestionOptions>>([]);
    const [questionsClosed, setQuestionsClosed] = useState<Array<QuestionsOpt>>([]);

    const [loading, setLoading] = useState(false);
    const { navigate } = useNavigation();

    const toggleLoading = useCallback(() => setLoading(prev => !prev), []);

    const startGetQuestions = async (query: string): Promise<void> => {
        toggleLoading()
        const questions = await questionRepository.getQuestions(query);
        typeof questions !== 'string' && dispatch({ type: 'QUESTION - Load questions', payload: questions });
        toggleLoading()
    }

    const startCreateQuestion = async (createQuestionDto: CreateQuestionDto) => {
        toggleLoading();
        const { success } = await questionRepository.createQuestion(createQuestionDto);
        if (success) return navigate(-1);
        toggleLoading();
    }

    const startShowQuestion = async (questionId: string) => {
        toggleLoading();
        const question = await questionRepository.getQuestionById(questionId);
        typeof question !== 'string' && dispatch({ type: 'QUESTION - Load question', payload: question });
        toggleLoading();
    }


    const startGetQuestionsBySection = async (guideId: number, page = 1) => {
        const sectionQuestions = await questionRepository.getQuestionBySection(guideId, page);
        typeof sectionQuestions !== 'string' && dispatch({ type: 'QUESTION - Get Question to user', payload: sectionQuestions });
    };

    const clearQuestionBySection = () => dispatch({ type: 'QUESTION - Clear Question Cache' });

    const createBodyRequest = (formQuestionData: QuestionsField): SaveUserQuestionDto => {
        const body = Object.entries(formQuestionData).map(([key, value]) => {
            const question_id = key.split("_").pop();
            const type_question = key.split("_").includes('closed') ? 'closed' : '';
           if( type_question === 'closed' ){
            return {
                question_id: question_id!,
                option: JSON.parse(value),
                type: key.split("_").includes('section') ? 'section' : 'question' as TypeSaveAnswer,
                type_question: type_question,
            }
           } else {
             return {
                question_id: question_id!,
                qualification: JSON.parse(value),
                type: key.split("_").includes('section') ? 'section' : 'question' as TypeSaveAnswer, 
             }
           }
        });

        return { questions: body }
    }
      

    const saveQuestionUser = async (surveyId: string, guideId: string, questions: QuestionsField) => {
        const formQuestionData = createBodyRequest(questions!);
        const { success } = await questionRepository.saveUserAnswers(surveyId, guideId, formQuestionData, 'gradable');
        if (!success) return navigate('/auth/')

    }

    const saveQuestionNongradableUser = async (surveyId: string, guideId: string, questions: QuestionsField) => {
        const formQuestionData = createBodyRequest(questions);
        //console.log(formQuestionData)
        const { success } = await questionRepository.saveUserAnswers(surveyId, guideId, formQuestionData, 'nongradable');
        if (!success) return navigate('/auth/')
    }

    const clearNewQuestionCache = () => dispatch({ type: 'QUESTION - Clear new Question Cache' });


    const starLoadOptionsFilterOne = async (surveyId: string, subareaId: string) => {
        const options = await questionRepository.getOptionsFilterOne(surveyId, subareaId);
        typeof options !== 'string' && setOptions(options);
    }

    const startLoadOptionsDifferent = async (option: string) => {
        const optionsD = await questionRepository.getOptionsDifferent(option);
        typeof optionsD !== 'string' && setOptionsD(optionsD);        
    }

    const starLoadQuestionsClosed = async () => {   
        const questionsClosed = await questionRepository.getQuestionsClosed();
        typeof questionsClosed !== 'string' && setQuestionsClosed(questionsClosed)
        
    }

    return {
        loading,
        questions,
        question,
        sectionQuestions,
        questionsPagination,
        totalQuestions,
        currentPage,
        options,
        optionsD,
        questionsClosed,
        toggleLoading,
        startGetQuestions,
        startCreateQuestion,
        startShowQuestion,
        clearQuestionBySection,
        saveQuestionUser,
        saveQuestionNongradableUser,
        startGetQuestionsBySection,
        clearNewQuestionCache,
        starLoadOptionsFilterOne,
        startLoadOptionsDifferent,
        starLoadQuestionsClosed
    }
}

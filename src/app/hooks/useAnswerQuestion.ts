import { useCallback, useState } from 'react';
export const useAnswerQuestion = () => {

    const [step, setStep] = useState(1);

    const handlePreviousStep = useCallback(() => setStep(step => step <= 1 ? step : step - 1), []);
    const handleNextStep = useCallback(() => setStep(step => step + 1), []);

    const handleChangeOptionValue = (formik: any, value: number | string, questionId: string, type_question:string) => {
        //formik.setFieldValue(`question_id_${questionId}`, value, true);
        if( type_question === 'closed') {
            formik.setFieldValue(`question_closed_id_${questionId}`, value, true);
        } else {
            formik.setFieldValue(`question_id_${questionId}`, value, true);
        }
    }

    return {
        step,
        handleNextStep,
        handlePreviousStep,
        handleChangeOptionValue,
    }


}

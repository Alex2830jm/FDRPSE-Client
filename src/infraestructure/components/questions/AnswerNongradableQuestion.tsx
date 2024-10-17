import * as Yup from 'yup';
import { useFormik } from "formik";

import { Radio, RadioGroup } from '@nextui-org/react';
import { FooterControls } from '.';
import { useAnswerQuestion } from '../../../app/hooks/useAnswerQuestion';
import { questionService } from '../../../domain/services/question.service';
import { createFieldQuestion } from '../../../app/helpers/createFiledsQuestion';
import { qustionAnswerValidation } from '../../validations/question.validations';
import { useState } from 'react';
import { surveyService } from '../../../domain/services/survey.service';
import { guideService } from '../../../domain/services/guide.service';
import { QuestionsBySection } from '../../http/dto/questions/QuestionsBySectionResponse';

interface Props {
  section: QuestionsBySection;
  showFooterControls?: boolean;
}

export const AnswerNongradableQuestion = ({ section, showFooterControls = true }: Props) => {

  const { handlePreviousStep, handleChangeOptionValue } = useAnswerQuestion();

  const { endSurveyUser } = surveyService();
  const [isBinary, setIsBinary] = useState(!section.binary);
  const { totalQuestions, currentPage, startGetQuestionsBySection, saveQuestionNongradableUser, clearQuestionBySection } = questionService();

  const { guideUser } = guideService();

  const formik = useFormik({
    initialValues: createFieldQuestion(section.questions!),
    validationSchema: isBinary ? Yup.object(qustionAnswerValidation(section.questions)) : false,
    onSubmit: async (data) => {
      console.log(data);
      clearQuestionBySection();
      if (section.canFinishGuide && !isBinary) {
        await saveQuestionNongradableUser(`${guideUser!.surveyId}`, `${guideUser!.guideId}`, { [`question_section_${section.id}`]: JSON.stringify(isBinary) });
        await endSurveyUser(guideUser!.surveyId,guideUser!.guideId);

      } else if (section.canFinishGuide && isBinary) {
        saveQuestionNongradableUser(`${guideUser!.surveyId}`, `${guideUser!.guideId}`, { [`question_section_${section.id}`]: JSON.stringify(isBinary) }).then(async () => {
          await clearQuestionBySection();
          if ((currentPage) === totalQuestions) return endSurveyUser(guideUser!.surveyId,guideUser!.guideId);
          return await startGetQuestionsBySection(guideUser?.guideId!, currentPage! + 1);
        });
      } else {
        if (section.binary) {
          isBinary ?
            await saveQuestionNongradableUser(`${guideUser!.surveyId}`, `${guideUser!.guideId}`, { [`question_section_${section.id}`]: JSON.stringify(isBinary), ...data }).then(() => clearQuestionBySection())
            : await saveQuestionNongradableUser(`${guideUser!.surveyId}`, `${guideUser!.guideId}`, { [`question_section_${section.id}`]: JSON.stringify(isBinary) }).then(() => clearQuestionBySection())
        } else {
          await saveQuestionNongradableUser(`${guideUser!.surveyId}`, `${guideUser!.guideId}`, data).then(() => clearQuestionBySection())
        }
        if ((currentPage) === totalQuestions) return endSurveyUser(guideUser!.surveyId,guideUser!.guideId);
        return await startGetQuestionsBySection(guideUser?.guideId!, currentPage! + 1);
      }

    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {section.binary && (
        <>
          <h3 className="mb-2 font-bold capitalize text-sm md:text-base lg:text-lg">
            {section.question}
          </h3>
          <RadioGroup
            defaultValue="false"
            orientation="horizontal"
            className="w-full flex items-center justify-center py-4"
            onValueChange={(value) => setIsBinary(JSON.parse(value))}
          >
            <Radio value="false">No</Radio>
            <Radio value="true">Si</Radio>
          </RadioGroup>
        </>
      )}
      {section.type === "nongradable" &&
        isBinary &&
        section.questions?.map(
          ({ id, name, type_question, question_options }) => (
            <div
              className="my-10 text-center items-center justify-center"
              key={id}
            >
              <p className="font-bold">{name}</p>
              <span>
              <RadioGroup
                color="primary"
                orientation="horizontal"
                className="w-full items-center justify-between py-4"
                onValueChange={(value: string) => handleChangeOptionValue(formik, value, id, type_question )}
                name={ type_question != 'closed' ? `question_id_${id}` : `question_closed_id_${id}`}
                isInvalid={formik.touched[type_question != 'closed' ? `question_id_${id}` : `question_closed_id_${id}`] && formik.errors[type_question != 'closed' ? `question_id_${id}` : `question_closed_id_${id}`] ? true : false}
                errorMessage={formik.touched[type_question != 'closed' ? `question_id_${id}` : `question_closed_id_${id}`] && formik.errors[type_question != 'closed' ? `question_id_${id}` : `question_closed_id_${id}`] && formik.errors[type_question != 'closed' ? `question_id_${id}` : `question_closed_id_${id}`]}
                value={formik.values[type_question != 'closed' ? `question_id_${id}` : `question_closed_id_${id}`]}
                isRequired
              >
                  <div className="grid justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {type_question === "closed" &&
                      question_options?.map(({ id, opcion }) => (
                        <div key={id} className="flex justify-center">
                          <Radio value={id} className="flex justify-center">
                            {opcion}
                          </Radio>
                        </div>
                      ))}
                    {type_question === "open" && (
                      <div className="flex justify-center">
                        <Radio value="true">Sí</Radio>
                        <Radio value="false">No</Radio>
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </span>
            </div>
          )
        )}

      {showFooterControls && (
        <FooterControls
          handlePreviousStep={handlePreviousStep}
          currentPage={
            section.canFinishGuide && !isBinary ? totalQuestions! : currentPage!
          }
          totalItems={totalQuestions!}
        />
      )}
    </form>
  );
}

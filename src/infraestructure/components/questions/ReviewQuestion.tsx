import { ForwardedRef, Fragment, forwardRef, useImperativeHandle, useState } from 'react';
import { ValidateStep } from '../../../app/utils/questionSteps';
import { useQuestion } from '../../../app/hooks/useQuestion';
import { CardQuestion } from '.';
import { ListOptionIcon, QuestionIcon } from '../icons';
import { questionService } from '../../../domain/services/question.service';
import { CreateQuestionDto } from '../../http/dto/questions';
import { LoadingScreen } from '../ui';


export const ReviewQuestion = forwardRef<ValidateStep>((__, ref: ForwardedRef<ValidateStep>) => {

  const { question, qualifications } = useQuestion();
  const { startCreateQuestion } = questionService();
  const [loading, setLoading] = useState(false);
  
  const handleCreateQuestion = (): CreateQuestionDto => ({
    name: question!.name,
    type: question!.type,
    type_question: question!.type_question || undefined,
    question_options: question?.question_options || undefined,
    section_id: question!.section!.id,
    category: qualifications?.category || undefined,
    domain: qualifications?.domain || undefined,
    dimension_id: question?.dimension?.id,
    qualification_id: question?.qualification?.id,
  })

  const canContinue = async () => {
    setLoading(true)
    await startCreateQuestion(handleCreateQuestion());
    setLoading(false)
    return false;
  }

  useImperativeHandle(ref, () => ({
    canContinue,
  }));

  return (
    <CardQuestion
      question={question!}
      showOptionQualification={false}
      renderContent={() => (
        <Fragment>
          {loading && <LoadingScreen />}
          {
            (question?.type === 'nongradable' && question?.type_question === 'closed') && (
              <div>
                <h2>Opciones de la pregunta:</h2>
                <div className="flex items-center [&>svg]:mr-2 relative my-2 shadow-lg py-6 rounded-lg w-full min-h-[8rem]">
                  <span className="absolute -left-3 w-14 h-10 bg-emerald-600 inset-y-1/3 shadow-xl flex items-center justify-center text-white rounded-lg"><ListOptionIcon /></span>
                  <div className="flex flex-col justify-center ml-14 w-full">
                    {question?.question_options?.map(( opcion, index ) => (
                      <span key={index}>{opcion}</span>
                    ))}
                  </div>
                </div>
              </div>
            )
          }
          <h2>Sección:</h2>
          <div className="flex items-center [&>svg]:mr-2 relative my-2 shadow-lg py-6 rounded-lg w-full min-h-[8rem]">
            <span className="absolute -left-3 w-14 h-10 bg-emerald-600 inset-y-1/3 shadow-xl flex items-center justify-center text-white rounded-lg"><QuestionIcon /></span>
            <div className="flex flex-col justify-center ml-14 w-full">
              <h3 className="font-bold">{question?.section?.name}</h3>
              {
                question?.section?.binary && (
                  <>
                    <span>{question?.section?.question}:</span> <span className="text-sm">Si / No</span>
                  </>
                )
              }
            </div>
          </div>
        </Fragment>
      )}
    />
  )
});

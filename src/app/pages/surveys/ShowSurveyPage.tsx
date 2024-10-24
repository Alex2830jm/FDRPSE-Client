import { Fragment, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AlertConfirm, PageLayout } from '../../../infraestructure/components/ui';
import { surveyService } from '../../../domain/services/survey.service';
import { Button, Chip, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@nextui-org/react';
import { ChartIcon, CheckIcon, CircleCheck, EyeIcon, FileDescription, InfoCircle, PausePlayer, PlayerPlay, StarsIcon, StarsOff, StatisticsIcon, StatisticsPieIcon, XIcon } from '../../../infraestructure/components/icons';
import { Modal } from '../../../infraestructure/components/ui/Modal';

import { useNavigation } from '../../hooks/useNavigation';
import { Guide, StatusGuide } from '../../../domain/models';
import { StatisticsPie } from '../../../infraestructure/components/charts';

export const ShowSurveyPage = () => {

  const { id } = useParams();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isOpenStatistics, onOpen: onOpenStatistics, onOpenChange: onOpenChangeStatistics } = useDisclosure();

  const { startShowSurvey, survey, startPausedOrContinueGuide, loading, startFinalizeGuideSurvey, clearCacheForAvailableSurvey, startGuide, startFinalizeSurvey } = surveyService();

  const { navigate } = useNavigation();

  const guideRef = useRef<Guide>();

  useEffect(() => {
    startShowSurvey(id!);
    return () => {
      clearCacheForAvailableSurvey()
    }
  }, []);

  return (
    <PageLayout title="Detalle de cuestionario">
      <span className="mb-5 block col-span-3">
        <span className="flex items-center [&>svg]:text-emerald-600 mt-1 [&>svg]:border-2 [&>svg]:rounded-full [&>svg]:p-1 [&>svg]:mr-2">
          <FileDescription width={35} height={35} strokeWidth={1.5} />
          <p className="font-bold">Lista de cuestionarios</p>
        </span>
        <p className="text-gray-500 font-bold text-xs pl-10">Aquí se muestran la serie de cuestionarios que se aplican</p>
      </span>
      <Fragment>
        {
          survey?.guides && (
            <div className="flex justify-end my-4">
              <Button
                onClick={() => startFinalizeSurvey(`${id}`)}
                className="bg-slate-800 text-white py-6 px-8 font-bold"
                endContent={
                  <span className="text-white rounded-full flex justify-center items-center">
                    <CircleCheck />
                  </span>
                }>
                Finalizar Serie de cuestionarios
              </Button>
            </div>
          )
        }
        {
          survey?.guides && (
            <Table
              aria-label="Surveys data list"
            >
              <TableHeader>
                <TableColumn>#</TableColumn>
                <TableColumn>Nombre</TableColumn>
                <TableColumn>Fecha de inicio</TableColumn>
                <TableColumn>Estatus</TableColumn>
                <TableColumn>Tipo de cuestionario</TableColumn>
                <TableColumn>Acciones </TableColumn>
              </TableHeader>
              <TableBody loadingContent={<Spinner color="success" />} isLoading={loading}>
                {
                  survey?.guides?.map((guide, index) => (
                    <TableRow key={`date-key-${index}`}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="text-xs">
                        {guide.name}
                        {guide.gradable && (
                          <Button onClick={() => {onOpenStatistics()}}
                            className='bg-sky-500 text-white text-sx'
                            isLoading={loading}
                            endContent={
                              <StatisticsPieIcon width={15} height={15} strokeWidth={2.5} />
                            }
                        />
                        )}
                      </TableCell>
                      <TableCell>{guide.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          className="capitalize"
                          color={guide.status === 0 ? 'default' : (guide.status === StatusGuide.inProgress) ? 'warning' : (guide.status === StatusGuide.paused) ? 'primary' : 'success'} size="sm" variant="flat"
                        >
                          {guide.status === StatusGuide.noInitialized ? 'No iniciado' : (guide.status === StatusGuide.inProgress) ? 'En proceso' : (guide.status === StatusGuide.paused) ? 'En pausa' : 'Finalizado'}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip className="capitalize"
                          startContent={
                            guide.gradable ?
                              <span className="text-green-600 bg-green-300/20 rounded-full p-[2px] flex items-center justify-center">
                                <StarsIcon width={15} height={15} />
                              </span> :
                              <span className="text-yellow-600 bg-yellow-300/20 rounded-full p-[2px] flex items-center justify-center">
                                <StarsOff width={15} height={15} />
                              </span>
                          }
                          classNames={{
                            base: `${guide.gradable ? 'bg-green-500/10' : 'bg-yellow-500/10'}`,
                            content: 'font-bold text-xs'
                          }}
                          size="sm" variant="solid">
                          {guide.gradable ? 'Evaluativo' : 'Informativo'}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="relative flex items-center gap-2">
                          <Button 
                            onClick={() => navigate(`detail/${guide.id}/`)}
                            className='bg-slate-800 w-40 text-white text-xs h-9 font-bold'
                            isLoading={loading}
                            endContent={
                              guide.gradable ? (
                                <span className='bg-white text-slate-800 rounded p-[1.2px]'>
                                  <StatisticsIcon
                                    width={15}
                                    height={15}
                                    strokeWidth={2}
                                  />
                                </span>
                              ) : (
                                <span className='bg-white text-slate-800 rounded p-[1.2px]'>
                                  <EyeIcon width={15} height={15} strokeWidth={2} />
                                </span>
                              )}
                          > {`Ver ${guide.gradable ? 'Promedios' : 'Detalles'}`} </Button>
                          {( guide.status === StatusGuide.inProgress) && (
                            <Fragment>
                              <Button
                                onClick={() => { guideRef.current = guide; onOpen() }}
                                className="bg-amber-600 text-white text-xs h-9 font-bold"
                                isLoading={loading}
                                endContent={
                                  <span className="bg-white text-amber-600 rounded-full p-[1.2px]">
                                    <PausePlayer width={15} height={15} strokeWidth={2.5} />
                                  </span>
                              }> Pausar </Button>
                              <Button onClick={() => startFinalizeGuideSurvey(id!, `${guide.id}`)}
                                className="bg-emerald-600 text-white text-xs h-9 font-bold"
                                endContent={
                                  <span className="bg-white text-emerald-600 rounded-full p-[1.2px]">
                                    <CheckIcon width={15} height={15} strokeWidth={2.5} />
                                  </span>
                              }> Terminar </Button>
                            </Fragment>
                          )}
                          {(guide.status === StatusGuide.paused) && (
                            <Button
                              onClick={() => { guideRef.current = guide; onOpen(); }}
                              className="bg-amber-600 text-white text-xs h-9 font-bold"
                              isLoading={loading}
                              endContent={
                                <span className="bg-white text-amber-600 rounded-full p-[1.2px]">
                                  <PlayerPlay width={15} height={15} strokeWidth={2.5} />
                                </span>
                            }> Continuar </Button>
                          )}
                          {
                            (guide.status === 0) && (
                              
                                <Button onClick={() => { guideRef.current = guide; onOpen() }}
                                  className="bg-emerald-600 text-white text-xs h-9 font-bold"
                                  endContent={
                                    <span className="bg-white text-emerald-600 rounded-full p-[1.2px]">
                                      <CheckIcon width={15} height={15} strokeWidth={2.5} />
                                    </span>}>
                                  Comenzar
                                </Button>
                            )
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          )
        }

        <AlertConfirm
          isOpen={isOpen}
          isOpenChange={onOpenChange}
          confirmButtonColor="emerald-600"
          subtitle={
            <span className={`flex flex-col items-center [&>svg]:text-warning
                     mt-1 [&>svg]:border-2 [&>svg]:rounded-full [&>svg]:p-1 [&>svg]:mr-2 text-xs text-center py-4 [&>svg]:mb-2`}>
              <InfoCircle width={50} height={50} strokeWidth={2} />
              {
                guideRef.current?.status === StatusGuide.inProgress ?
                  (

                    <p className="font-bold text-xs">
                      El cuestionario <b className="text-emerald-600">{guideRef.current?.name}</b> será  pausado y no estara disponible para los usurios.
                    </p>
                  ) : guideRef.current?.status === StatusGuide.paused ? (
                    <p className="font-bold text-xs">
                      El cuestionario <b className="text-emerald-600">{guideRef.current?.name}</b> continuara y estara disponible para los usuarios.
                    </p>
                  ) : (
                    <p className="font-bold text-xs">
                      Al continuar, el cuestionario <b className="text-emerald-600">{guideRef.current?.name}</b> comenzará y estará disponible para todos los usuarios.
                    </p>
                  )
              }
            </span>
          }
          title={
            guideRef.current?.status === StatusGuide.inProgress ?
              (
                "¿Estas seguro que deseas pausar el cuestionario?"
              ) : guideRef.current?.status === StatusGuide.paused ? (
                "¿Estas seguro que deseas continuar el cuestionario?"
              ) : (
                "¿Estas seguro que deseas comenzar el cuestionario?"
              )
          }
          callback={
            async () => {
              if (guideRef.current?.status === StatusGuide.inProgress) {
                return startPausedOrContinueGuide(id!, `${guideRef.current.id}`, StatusGuide.paused)
              }
              if (guideRef.current?.status === StatusGuide.paused) {
                return startPausedOrContinueGuide(id!, `${guideRef.current.id}`, StatusGuide.inProgress)
              }
              if (guideRef.current?.status === StatusGuide.noInitialized) {
                return startGuide(id!, guideRef.current?.id)
              }
            }
          }
        />

        <Modal
          title=""
          isOpen={isOpenStatistics}
          onChange={onOpenChangeStatistics}
          size="5xl"
          hideCloseButton
          renderContent={(onClose) => (
            <Fragment>
                <header className='flex items-center justify-between -mt-6 py-1 border-b-2'>
                  <div className='flex items-center font-bold [&>svg]:text-emerald-600 text-xl [&>svg]:mr-1 pt-4 [&>svg]:border-2 [&>svg]:rounded-full [&>svg]:p1'>
                    <StatisticsPieIcon width={45} height={45} strokeWidth={1.5} />
                    <h1>Estadisticas del cuestionario</h1>
                  </div>
                  <Button isIconOnly className="border-2 bg-transparent" onClick={onClose}>
                    <XIcon />
                  </Button>
                </header>
                <section className='items-center justify-center text-center'>
                  <StatisticsPie/>
                </section>
            </Fragment>
          )}
        />
      </Fragment>
    </PageLayout >
  )
}

import { Fragment, useEffect, useMemo, useState } from 'react';
import { surveyService } from '../../../domain/services/survey.service';
import { LoadingScreen, PageLayout } from '../../../infraestructure/components/ui';
import { useParams } from 'react-router-dom';
import { Autocomplete, AutocompleteItem, AutocompleteSection, Button, Chip, Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User, useDisclosure } from '@nextui-org/react';
import { BuildingComunity, ChartIcon, ClearAllIcon, DownloadIcon, EyeIcon, FileSpreadSheet, XIcon } from '../../../infraestructure/components/icons';
import { areaService } from '../../../domain/services/area.service';
import { guideService } from '../../../domain/services/guide.service';
import { useDebounce } from '../../hooks/useDebounce';
import { Modal } from '../../../infraestructure/components/ui/Modal';
import { UserDetails } from '../../../infraestructure/components/survey/UserDetails';
import { questionService } from '../../../domain/services/question.service';
import { getNameOfQualification } from '../../helpers/transformDataToBarChart';

export const SurveyGuideDetailAverage = () => {

  const { id, guideId } = useParams();
  const [query, setQuery] = useState('');
  const [queryArea, setQueryArea] = useState('')
  const [querySubArea, setQuerySubArea] = useState('')
  const [ queryOption1, setQueryOption1 ] = useState('')
  const [ queryOption2, setQueryOption2 ] = useState('')
  const [userId, setUserId] = useState('');

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { startSearchGuideSurveyUserDetailOption, guideUserSurvey, getAverageSurveyGuide, average, loading, startDownloadReportBy, startDownloadReportByOptions } = surveyService();
  const { startLoadAreasFilter, areas, startLoadSubAreasFilter, subareas } = areaService();
  const { starLoadOptionsFilterOne, options, startLoadOptionsDifferent, optionsD, starLoadQuestionsClosed, questionsClosed } = questionService();
  const { startGetGuideBySurvey, guide, clearGuide } = guideService();

  const debounce = useDebounce(query, 500);

  useEffect(() => {
    Promise.all([
      startGetGuideBySurvey(id!, guideId!),
      startLoadAreasFilter(id!, guideId!),
      starLoadQuestionsClosed(),
    ])
    return () => {
      clearGuide();
    }
  }, []);

  useEffect(() => {
    const fetchAverage = async () => {
      try {
        await getAverageSurveyGuide(id!, guideId!);
      } catch ( error ) {
        console.log('Error al mostrar promeido', error);
      }
    };

    fetchAverage();
  });

  useEffect(() => {
    startSearchGuideSurveyUserDetailOption(id!, guideId!, queryArea, querySubArea, queryOption1, queryOption2);
  }, [queryArea, querySubArea, queryOption1, queryOption2, debounce])

  const handleSearchChangeArea = async (areaId: string) => {
    setQueryArea(areaId);
    setQuerySubArea('');
    await startLoadSubAreasFilter(areaId, id!, guideId!);
    if(subareas.length <= 0) {
      await starLoadOptionsFilterOne(id!, areaId);
    }
  }

  const handleSearchChangeOption = async (subareaId: string) => {
    setQuerySubArea(subareaId);
    setQueryOption1('');

    await starLoadOptionsFilterOne(id!, subareaId);
  }

  const handleSearchChangeOptions = async (option: string) => {
    setQueryOption1(option);
    setQueryOption2('');
    await startLoadOptionsDifferent(option)
  }

  const handleClearSearch = () => {
    setQuery('');
    setQueryOption2('')
    setQueryOption1('');
    setQuerySubArea('')
    setQueryArea('');
  }
  
  const promedioFiltrado = () => {
    return guideUserSurvey?.length > 0
      ? Number((guideUserSurvey.reduce((acc, { total }) => acc + total, 0) / guideUserSurvey?.length).toFixed(2))
      : 0;
  };

  console.log(areas)

    
  const getAverage= useMemo(() => {
    return getNameOfQualification ({
      despicable: guide?.qualification?.despicable!,
      low: guide?.qualification?.low!,
      middle: guide?.qualification?.middle!,
      high: guide?.qualification?.high!,
      value: average!
    })
  }, [average, guide?.qualification]);
  
  const getNameByAverage = {
    ['Despreciable o nulo']   : 'text-cyan-200',
    ['Bajo']                  : 'text-green-300',
    ['Medio']                 : 'text-yellow-200',
    ['Alto']                  : 'text-orange-300',
    ['Muy alto']              : 'text-red-400',
    ['NA']                    : 'text-gray-600'
  }

  const getAverageFilter = useMemo(() =>{
    return getNameOfQualification ({
      despicable: guide?.qualification?.despicable!,
      low: guide?.qualification?.low!,
      middle: guide?.qualification?.middle!,
      high: guide?.qualification?.high!,
      value: promedioFiltrado()!
    })
  }, [promedioFiltrado(), guide?.qualification])

  const getNameByAverageFilter = {
    ['Despreciable o nulo']      : 'bg-cyan-200 border-cyan-400',
    ['Bajo']      : 'bg-green-300 border-green-500',
    ['Medio']     : 'bg-yellow-200 border-yellow-400',
    ['Alto']      : 'bg-orange-300 border-orange-500',
    ['Muy alto']  : 'bg-red-400 border-red-600',
    ['NA']        : 'bg-gray-600'
  }

  // Se empiezan a validar ciertos errores
  const parentNode = document.getElementById('parentElement');
  const newNode = document.createElement('div');
  const existingNode = document.getElementById('existingNode');

  if (existingNode?.parentNode === parentNode) {
    parentNode?.insertBefore(newNode, existingNode);
  } else {
    console.error("Los nodos no comparten el mismo padre o 'existingNode' no está en el DOM");
  }

  return (
    <PageLayout title="Detalle de cuestionario">
      <Fragment>
        <Modal
          title=""
          isOpen={isOpen}
          onChange={onOpenChange}
          size="full"
          hideCloseButton
          renderContent={(onClose) => (
            <Fragment>
              <header className="flex items-center justify-between -mt-6 py-1 border-b-2 ">
                <div className="flex items-center font-bold [&>svg]:text-emerald-600 text-xl [&>svg]:mr-1 pt-4 [&>svg]:border-2 [&>svg]:rounded-full [&>svg]:p-1">
                  <ChartIcon width={35} height={35} strokeWidth={1.5} />
                  <h1>Detalle del usuario</h1>
                </div>
                <Button isIconOnly className="border-2 bg-transparent" onClick={onClose}>
                  <XIcon />
                </Button>
              </header>
              <UserDetails
                surveyId={id!}
                userId={userId!}
                guide={guide!}
                guideId={guideId!}
              />
            </Fragment>
          )}
        />
        { loading && (<LoadingScreen title="Cargando" />) }
        { guide ? (
          <h2 className="bg-gradient-to-r from-primary via-emerald-600 to-emerald-600 inline-block text-transparent lg:py-5 bg-clip-text text-xl lg:text-5xl font-bold">
            {guide?.name}
              {guide.gradable ? (
                <label className={`${getNameByAverage[getAverage]} inline-block text-transparent lg:py-5 bg-clip-text text-xl lg:text-5xl font-bold`}
              >: GPA { average } - 100 % </label>
              ): null}
            </h2>
          ) : (
            <div className="mt-10 w-full h-[10rem]">
              <Skeleton className="w-full h-10 rounded-full my-2" />
              <Skeleton className="w-9/12 h-7 rounded-full my-2" />
            </div>
          )
        }
        
        <div className="grid gap-y-3 lg:gap-y-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 py-5 text-emerald-600">
          {guide?.gradable ? (
            <div className="w-full">
              <div 
                className={ `${getNameByAverageFilter[getAverageFilter]} border-t-4 rounded-b text-teal-900 px-4 py-1 shadow-md`} role="alert"
              >
                <div className="flex justify-center">
                  <p className="font-bold">Promedio por filtrado - { getAverageFilter }
                    <label className='bg-white text-black rounded-full flex justify-center items-center'>
                      { promedioFiltrado() }
                    </label>
                  </p>
                </div>
              </div>
            </div>
          ):null}
          <Button className="bg-slate-800 text-white w-full"
            onClick={handleClearSearch}
            endContent={
              <span className="w-[1.5rem] h-[1.5rem] bg-white text-black rounded-full flex justify-center items-center">
                <ClearAllIcon width={20} height={15} />
              </span>
            }>Limpiar
          </Button>
          {queryArea && (
            <Button className="bg-slate-800 text-white z-0"
              onClick={ async () => {
                await startDownloadReportByOptions(id!, guideId!, queryArea, querySubArea, queryOption1, queryOption2);
              }}
              isLoading={loading}
              endContent={
                <span className="w-[1.5rem] h-[1.5rem] bg-white text-black rounded-full flex justify-center items-center">
                  <DownloadIcon width={18} height={18} />
                </span>
              }
            > Descargar reporte por filtros </Button>
          )}
        </div>

        <div className="grid gap-y-3 lg:gap-y-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 py-5 text-emerald-600 items-center">
          <Autocomplete
            label="Buscar por área"
            className="z-0"
            startContent={<BuildingComunity />}
            onSelectionChange={(key) => handleSearchChangeArea(key as string || '')}        
            selectedKey={queryArea}
          >
            {areas?.map(({ id, name, percentage }) => ( guide?.gradable ? (
              <AutocompleteItem 
                key={id}
                value={id}
                textValue={name}
                startContent={
                  <Chip isDisabled size='md' variant='solid' className='bg-black text-white'>{percentage}%</Chip>
                }
              >{name}</AutocompleteItem>
            ) : ( <AutocompleteItem key={id} value={id}>{name}</AutocompleteItem> )))}
          </Autocomplete>
          {queryArea && subareas?.length > 0 && (
            <Autocomplete
              label="Buscar por área"
              className="z-0 md:col-span-2 lg:col-span-1"
              startContent={<BuildingComunity />}
              onSelectionChange={(key) => handleSearchChangeOption(key as string)}
              selectedKey={querySubArea}
            >
              {subareas.map(({ id, name, percentage }) => (
                guide?.gradable ? (
                  <AutocompleteItem 
                    key={id} 
                    value={id}
                    startContent={
                      <Chip isDisabled size='md' variant='solid' className='bg-black text-white'>
                        {percentage}%
                      </Chip>
                    }
                  >
                    {name}
                  </AutocompleteItem>
                ) : (
                  <AutocompleteItem key={id} value={id}>
                    {name}
                  </AutocompleteItem>
                )
              ))}
            </Autocomplete>
          )}

          {((queryArea && subareas.length === 0) || (queryArea && querySubArea)) && ( 
            <Autocomplete
              label="Sexo"
              className='z-0'
              startContent={<BuildingComunity/>}
              onSelectionChange={(key) => handleSearchChangeOptions(key as string || '')}
              selectedKey={queryOption1}
            >
              {options?.map(({id, opcion, countUsers}) => (
                <AutocompleteItem
                  key={id}
                  value={id}
                  startContent={
                    <Chip isDisabled size='sm' variant='solid' className='bg-black text-white'>{countUsers}</Chip>
                  }
                >{opcion}</AutocompleteItem>
              ))}
            </Autocomplete>              
          )}
          {(queryOption1 && optionsD.length > 0) && (
            <Autocomplete
              label="Filtro de Trabajadores"
              className='z-0 md:col-span-2 lg:col-span-1'
              startContent={<BuildingComunity />}
              onSelectionChange={(key) => setQueryOption2(key as string || '')}
              selectedKey={queryOption2}
            >
              {questionsClosed?.filter(question => question.name !== 'Selecciona tu sexo')?.map(({id, name}) =>
                <AutocompleteSection showDivider key={id} title={name}>
                  {optionsD.filter(optionsD => optionsD.questions_id === id).map(({id, opcion}) => (
                    <AutocompleteItem key={id} value={id}>
                      {opcion}
                    </AutocompleteItem>
                  ))}
                </AutocompleteSection>
              )}
            </Autocomplete>
          )}
        </div>



        <Table
          aria-label="Surveys data list"
        >
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>Apellidos</TableColumn>
            <TableColumn>Área</TableColumn>
            <TableColumn>Total</TableColumn>
            <TableColumn>Estatus</TableColumn>
            <TableColumn> </TableColumn>
          </TableHeader>
          <TableBody>
            {guideUserSurvey?.map(({ user, total, status }, index) => (
                <TableRow key={`date-key-${user?.id}`}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <User
                      avatarProps={{ radius: "lg", src: `https://ui-avatars.com/api?name=${user?.name + user?.lastName}&background=EAFAF5&color=059669` }}
                      name={`${user.name}`}
                      className="text-sm"
                    >
                    </User>
                  </TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.area.name} </TableCell>
                  <TableCell>{guide?.gradable ? (status ? total : '') : 'NA'} </TableCell>
                  <TableCell>
                    <Chip className="capitalize" color={status ? "success" : "warning"} size="sm" variant="flat">
                      {status ? 'Finalizado' : 'En proceso'}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {
                      status &&
                      <span className="flex items-center">
                        <Button
                          onClick={() => { onOpen(); setUserId(`${user.id}`) }}
                          className="bg-slate-800 text-white text-xs h-7 font-bold mx-1"
                          endContent={
                            <span className="bg-white text-slate-800 rounded-full p-[1.2px]">
                              <EyeIcon width={15} height={15} />
                            </span>}>
                          Ver
                        </Button>
                        <Tooltip content="Descargar reporte del usuario" className="p-2" color="foreground" delay={500} closeDelay={0}>
                          <Button
                            onClick={() => startDownloadReportBy(id!, `${guide!.id}`, `${user.id}`, 'user')}
                            className="bg-emerald-600 text-white text-xs h-7 font-bold mx-1"
                            isIconOnly
                          >
                            <FileSpreadSheet width={15} height={15} />
                          </Button>
                        </Tooltip>
                      </span>
                    }
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>


      </Fragment>
    </PageLayout >
  )
}

import { http } from '../http/http';
import { errorAlert, succesAlert } from '../alert/alerts';

import { Survey, Pagination, GuideUserSurvey, Area, GuideSurveyUserDetail, StatusGuide, ChangeStatusGuide, FinalizeGuideAndStartNextGuide, GuideUser } from '../../domain/models';
import { CommonResponseDto } from '../http/dto/CommonResponseDto';
import { FinalizeCurrentGuideResponseDto, GuideUserSurveyResponseDto, StartNewSurveyDto, StartNewSurveyResonseDto, SurveyResponseDto, SurveysPaginationResponseDto, TotalUsersResponseDto } from '../http/dto/surveys';
import { AreasResponseDto } from '../http/dto/areas';
import { GuideSurveyUserDetailDto, GuideUserResponseDto, OneGuideResponseDto } from '../http/dto/guide';
import { TotalSurveyResponseDto } from '../http/dto/surveys/TotalSurveyResponseDto';

export const surveyRepository = {
    startGetSurveys: async (page = 1): Promise<Pagination | string> => {
        try {
            const { data, per_page, total } = await http.get<SurveysPaginationResponseDto>(`/auth/surveys?page=${page}`);
            return {
                perPage: per_page,
                total: total,
                surveys: data.map(({ start_date, created_at, updated_at, ...rest }) =>
                    ({ startDate: new Date(start_date), endDate: rest.end_date, createdAt: new Date(created_at), updatedAt: new Date(updated_at), ...rest })),
            }

        } catch (error) {
            return error as string;
        }
    },

    //Petición para obtener el promedio de un cuestionario
    averageGuide: async (surveyId: string, guideId: string): Promise<number | string> => {
        try {
            const { average } = await http.get<TotalSurveyResponseDto>(`/auth/surveys/${surveyId}/guide/${guideId}/average`);
            return average;
        } catch ( error ) {
            return error as string;
        }
    },

    showSurvey: async (surveyId: string): Promise<Survey | string> => {
        try {
            const { survey } = await http.get<SurveyResponseDto>(`/auth/surveys/show/${surveyId}`);
            return {
                ...survey,
                startDate: new Date(survey.start_date),
                endDate: survey.end_date ? new Date(survey.end_date) : null,
                createdAt: new Date(survey.created_at),
                updatedAt: new Date(survey.updated_at),
                guides: survey.guides.map(({ created_at, updated_at, survey_id, status, ...rest }) =>
                    ({ surveyId: survey_id, createdAt: new Date(created_at), updatedAt: new Date(updated_at), status: rest.pivot.status, ...rest })),
            }

        } catch (error) {
            return error as string;
        }
    },

    startNewSurvey: async (startNewSurveyDto: StartNewSurveyDto): Promise<Survey | string> => {
        try {
            const { survey, message } = await http.post<StartNewSurveyResonseDto>('/auth/surveys/start', startNewSurveyDto);
            succesAlert(message);
            return {
                id: survey.id,
                startDate: new Date(survey.start_date),
                createdAt: new Date(survey.created_at),
                updatedAt: new Date(survey.updated_at),
                status: survey.status,
                total: survey.total,
                endDate: survey?.end_date && new Date(survey.end_date),
            }
        } catch (error) {
            errorAlert(error as string);
            return error as string;
        }
    },

    startSurveyByUser: async (surveyId: number, guideId: number): Promise<CommonResponseDto> => {
        try {
            return await http.post<CommonResponseDto>(`/auth/surveys/start-user/${surveyId}/guide/${guideId}`, {});
        } catch (error) {
            errorAlert(error as string);
            return { message: error as string, success: false }
        }
    },

    endSurveyByUser: async (surveyId: number, guideId: number): Promise<GuideUser | string | null> => {
        try {
            const response = await http.post<CommonResponseDto & GuideUserResponseDto | null>(`/auth/surveys/end-user/${surveyId}/guide/${guideId}`, {});
            response?.message && succesAlert(response.message);
            return response?.guide ? {
                success: true,
                id: response.guide.id,
                ...(response.guide.guide && {
                    guide: {
                        id: response.guide.guide?.id,
                        name: response.guide.guide?.name,
                        gradable: response.guide.guide?.gradable,
                        status: response.guide.guide?.status,
                    }
                }),
                guideId: response.guide.guide_id,
                total: response.guide?.total || 0,
                createdAt: new Date(response.guide.created_at),
                updatedAt: new Date(response.guide.updated_at),
                status: response.guide.status,
                surveyId: response.guide.survey_id,
                userId: response.guide.user_id
            }: null
        } catch (error) {
            errorAlert(error as string);
            return error as string;
        }
    },

    searchInGuideSurveyUserDetail: async (surveyId: string, guideId: string, name = '', areaId = '', subareaId = ''): Promise<Array<GuideUserSurvey> | string> => {
        try {
            const { survey } = await http.get<GuideUserSurveyResponseDto>(`/auth/surveys/${surveyId}/guide/${guideId}/find-by?name=${name}&area=${areaId}&subarea=${subareaId}`);
            return survey.map((guide) => ({
                ...guide,
                createdAt: new Date(guide.created_at),
                updatedAt: new Date(guide.updated_at),
                userId: guide.user_id,
                guideId: guide.guide_id,
                surveyId: guide.survey_id,
                user: {
                    id: guide.user.id,
                    name: guide.user.nombre,
                    lastName: `${guide.user.apellidoP} ${guide.user.apellidoM}`,
                    area: {
                        id: guide.user.area.id,
                        name: guide.user.area.nombreArea,
                    }
                }
            }));
        } catch (error) {
            return error as string;
        }
    },

    //Petición que muestra a los usuarios de los respectivos filtros de búsqueda
    searchInGuideSurveyUserDetailOptions: async (surveyId: string, guideId: string, areaId = '', subareaId = '', option1 = '', option2 = '', ): Promise<Array<GuideUserSurvey> | string> => {
        try {
            const { survey } = await http.get<GuideUserSurveyResponseDto>(`/auth/surveys/${surveyId}/guide/${guideId}/options?areaId=${areaId}&subareaId=${subareaId}&option1=${option1}&option2=${option2}`);
            return survey.map((guide) => ({
                ...guide,
                createdAt: new Date(guide.created_at),
                updatedAt: new Date(guide.updated_at),
                userId: guide.user_id,
                guideId: guide.guide_id,
                surveyId: guide.survey_id,
                user: {
                    id: guide.user.id,
                    name: guide.user.nombre,
                    lastName: `${guide.user.apellidoP} ${guide.user.apellidoM}`,
                    area: {
                        id: guide.user.area.id,
                        name: guide.user.area.nombreArea
                    }
                }
            }));
        } catch (error) {
            return error as string;
        }
    },

    getAreas: async (): Promise<Array<Area> | string> => {
        try {
            const { areas } = await http.get<AreasResponseDto>(`/auth/areas`);
            return areas.map(({ id, nombreArea, area_nivel, area_padre, users_count, }) => ({
                id,
                level: area_nivel,
                pather: area_padre,
                usersCount: users_count,
                name: nombreArea,
            }))
        } catch (error) {
            return error as string;
        }
    },

    getTotalUsers: async (): Promise<number | string> => {
        try {
            const { users } = await http.get<TotalUsersResponseDto>(`/auth/surveys/total-users`);
            return users;
        } catch (error) {
            return error as string;
        }
    },

    getUserDetail: async (surveyId: string, userId: string, guideId: string): Promise<GuideSurveyUserDetail | string> => {
        try {
            const { guide_user } = await http.get<GuideSurveyUserDetailDto>(`/auth/surveys/details/${surveyId}/${guideId}/${userId}`);

            return {
                ...guide_user,
                userId: guide_user.user_id,
                user: {
                    name: guide_user.user.nombre,
                    lastName: `${guide_user.user.apellidoP} ${guide_user.user.apellidoM}`,
                    areaId: guide_user.user.id_area,
                    area: {
                        id: guide_user.user.area.id,
                        name: guide_user.user.area.nombreArea,
                    },
                    id: guide_user.user.id,
                },
                answers: guide_user.answers.map((answer) => ({
                    ...answer,
                    questionId: answer.question_id,
                    name: answer.name,
                    category: {
                        ...answer.category,
                        qualification: {
                            ...answer.category?.qualification,
                            veryHigh: answer?.category?.qualification?.very_high,
                        }
                    },
                    domain: {
                        ...answer.domain,
                        qualification: {
                            ...answer.domain?.qualification,
                            veryHigh: answer?.domain?.qualification?.very_high,
                        }
                    },
                    qualificationData: {
                        alwaysOp: answer?.qualification_data?.always_op,
                        almostAlwyasOp: answer?.qualification_data?.almost_alwyas_op,
                        sometimesOp: answer?.qualification_data?.sometimes_op,
                        almostNeverOp: answer?.qualification_data?.almost_never_op,
                        neverOp: answer?.qualification_data?.never_op,
                    }
                }))
            }
        } catch (error) {
            return error as string;
        }
    },

    finalizeSurvey: async (surveyId: string): Promise<Survey | string> => {
        try {
            const { message, survey } = await http.post<CommonResponseDto & SurveyResponseDto>(`/auth/surveys/finalize-survey/${surveyId}`, {});
            succesAlert(message);
            return {
                id: survey.id,
                startDate: new Date(survey.start_date),
                endDate: new Date(survey.end_date!),
                status: survey.status,
                createdAt: new Date(survey.created_at),
                updatedAt: new Date(survey.updated_at),
                total: survey.total,
                guides: undefined,
            }
        } catch (error) {
            errorAlert(error as string);
            return error as string;
        }
    },

    changeSurveyGuideStatus: async (surveyId: string, guideId: string, status: StatusGuide.inProgress | StatusGuide.paused): Promise<ChangeStatusGuide | string> => {
        try {
            const { guide } = await http.patch<OneGuideResponseDto>(`/auth/surveys/${surveyId}/guide/${guideId}/change-status?status=${status}`, {});
            succesAlert('La guía se actualizo correctamente');
            return {
                guide: {
                    id: guide.id,
                    status: guide.surveys[0].pivot.status,
                }
            };
        } catch (error) {
            errorAlert(error as string);
            return error as string;
        }
    },


    finalizeGuideSurveyAndStartNextGuide: async (surveyId: string, guideId: string): Promise<FinalizeGuideAndStartNextGuide | string> => {
        try {
            const { current_guide, next_guide } = await http.patch<FinalizeCurrentGuideResponseDto>(`/auth/surveys/${surveyId}/guide/${guideId}/finalized`, {});
            succesAlert('La guía se actualizo correctamente');
            return {
                currentGuide: {
                    id: current_guide.guide_id,
                    status: current_guide.status,
                },
                nextGuide: (next_guide) ? {
                    id: next_guide.guide_id,
                    status: next_guide?.status,
                } : null,
            }
        } catch (error) {
            errorAlert(error as string);
            return error as string;
        }
    },

    startGuideAndPauseOtherGuides: async (surveyId: string, guideId: string): Promise<CommonResponseDto> => {
        try {
            const { message } = await http.post<CommonResponseDto>(`/auth/surveys/${surveyId}/start-guide/${guideId}`, {});
            succesAlert(message);
            return {
                message, success: true
            }
        } catch (error) {
            errorAlert(error as string);
            return {
                message: error as string,
                success: false,
            }
        }
    },

    downloadSurveyUserResume: async (): Promise<CommonResponseDto> => {
        try {
            await http.download(`/auth/surveys/report`);
            return { success: true, message: '' };
        } catch (error) {
            errorAlert(error as string);
            return { success: false, message: error as string };
        }
    },

    downloadSurveyGuideUserResume: async (surveyId: string, guideId: string, userId: string, type: string): Promise<CommonResponseDto> => {
        try {
            await http.download(`/auth/surveys/${surveyId}/guide/${guideId}/report/${userId}?type=${type}`)
            return { success: true, message: '' };
        } catch (error) {
            errorAlert(error as string);
            return { success: false, message: error as string };
        }
    },
    
    downloadSurveyGuideOptions: async (surveyId: string, guideId: string, userId: string, subareaId = '', option1 = '', option2 = ''): Promise<CommonResponseDto> => {
        try {
            await http.download(`/auth/surveys/${surveyId}/guide/${guideId}/report_average/${userId}?subareaId=${subareaId}&option1=${option1}&option2=${option2}`)
            return { success: true, message: '' };
        } catch (error) {
            errorAlert(error as string);
            return { success: false, message: error as string };
        }
    },

}
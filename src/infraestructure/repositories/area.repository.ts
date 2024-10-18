import { http } from '../http/http';
import { AreasResponseDto } from '../http/dto/areas';
import { Area } from '../../domain/models';


export const areaRepository = {

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

    //Petición para obtener las áreas principales con sus % de promedio
    getAreasFilter: async (surveyId: string, guideId: string): Promise<Array<Area> | string> => {
        try {
            const { areas } = await http.get<AreasResponseDto>(`/auth/areas/filter?surveyId=${surveyId}&guideId=${guideId}`);
            return areas.map(({ id, nombreArea, area_nivel, area_padre, users_count, percentage }) => ({
                id,
                level: area_nivel,
                pather: area_padre,
                usersCount: users_count,
                name: nombreArea,
                percentage: percentage,
            }))
        } catch (error) {
            return error as string;
        }
    },

    getSubAreasByArea: async (areaId: string): Promise<Array<Area> | string> => {
        try {
            const { areas } = await http.get<AreasResponseDto>(`/auth/areas/detail/${areaId}`);
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

    //Petición para obtener las subárea de un área principal con sus % de promedio
    getSubAreasByAreaFilter: async (areaId: string, surveyId: string, guideId: string): Promise<Array<Area> | string> => {
        try {
            const { areas } = await http.get<AreasResponseDto>(`/auth/areas/filter/detail/${areaId}?surveyId=${surveyId}&guideId=${guideId}`);
            //console.log(areas)
            return areas.map(({ id, nombreArea, area_nivel, area_padre, users_count, percentage}) => ({
                id,
                level: area_nivel,
                pather: area_padre,
                usersCount: users_count,
                name: nombreArea,
                percentage: percentage,
            }))
        } catch (error) {
            return error as string;
        }
    },

}
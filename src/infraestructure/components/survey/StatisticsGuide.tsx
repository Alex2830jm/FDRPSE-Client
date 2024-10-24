import { Fragment, useEffect, useState } from 'react';
import { areaService } from '../../../domain/services/area.service';
import { guideService } from '../../../domain/services/guide.service';
import { StatisticsPie } from '../charts';
import { AreasResponseDto } from '../../http/dto/areas';

interface Props {
    surveyId: string;
    guideId: string;
}

export const StatisticsGuide = ({ surveyId, guideId }: Props) => {
    const { startGetGuideBySurvey, guide } = guideService();
    const { startLoadAreasFilter, areas } = areaService();

    // Estado inicializado con una estructura que respeta AreasResponseDto
    const [areasData] = useState<AreasResponseDto>({ areas: [] });

    // Transforma los datos al formato requerido por el pie chart
    const transformDataToPieChart = (areasDetail: AreasResponseDto) => {
        return areasDetail.areas.map(({ nombreArea, average }) => {
            return {
                name: nombreArea,
                value: average ?? 0, // Si average es undefined, usar 0
            };
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            startGetGuideBySurvey(surveyId, guideId);
            await startLoadAreasFilter(surveyId, guideId);
    
        };
    
        fetchData();
    }, [surveyId, guideId]);
    

    return (
        <Fragment>
            <div className="flex items-center font-bold [&>svg]:text-emerald-600 text-xl [&>svg]:border-2 [&>svg]:rounded-full [&>svg]:p-1">
                <h3 className='font-bold text-lg'>
                    ESTADISTICAS - {guide?.name}
                </h3>
            </div>
            <Fragment>
                {/* Pasar los datos transformados al pie chart */}
                <StatisticsPie data={transformDataToPieChart(areasData)} />
            </Fragment>
        </Fragment>
    );
};

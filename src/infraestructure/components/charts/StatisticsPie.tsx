/* import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts" */
import { Cell, Pie, PieChart, Tooltip } from "recharts"
import { GhostIcon } from "../icons";

//Datos con los que se representa el grafico
interface Props {
    data: Array<{ name: string, value: number}>
}


const COLORS = ['#e6b0aa', '#f5b7b1', '#d7bde2', '#d2b4de', '#a9cce3', '#aed6f1', '#a3e4d7', '#a2d9ce', '#a9dfbf', '#abebc6'];

const renderCustomizedLabel = ({
    cx, 
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
} : {
    cx: number, 
    cy: number,
    midAngle: number,
    innerRadius: number,
    outerRadius: number,
    percent: number,
}) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text 
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline='central'
        > {`${(percent * 100).toFixed(2)}%`} </text>
    )
}


export const StatisticsPie = ({data}: Props) => {
    return (
        <div>
            {data.length  > 0 ? (
                <PieChart width={700} height={700}>
                    <Pie data={data} dataKey='value' nameKey='name' label={renderCustomizedLabel} labelLine={false}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            ): (
                <div className="w-full flex items-center flex-col justify-center">
                    <GhostIcon height={60} width={60} strokeWidth={2} />
                    <span className="text-xs font-bold text-gray-400">Información no disponible</span>
                </div>                    
            )}
        </div>
    );
}
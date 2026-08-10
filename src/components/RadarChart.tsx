import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { AnchorScores, AnchorCode } from '../types';
import { CAREER_ANCHORS } from '../data/anchors';

interface RadarChartProps {
  scores: AnchorScores;
}

export const RadarChartComponent: React.FC<RadarChartProps> = ({ scores }) => {
  // Ordered 8 anchors for radar
  const anchorOrder: AnchorCode[] = ['TF', 'AU', 'SE', 'EC', 'SV', 'CH', 'LS', 'GM'];

  const chartData = anchorOrder.map((code) => {
    const info = CAREER_ANCHORS[code];
    return {
      code,
      title: info.title,
      score: scores[code] || 0,
      fullMark: 20,
      color: info.color,
    };
  });

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full h-[280px] sm:h-[320px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#e0e3e5" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="code"
              tick={({ x, y, payload }) => {
                const item = chartData.find((d) => d.code === payload.value);
                const color = item ? item.color : '#191c1e';
                const score = item ? item.score : 0;

                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      textAnchor="middle"
                      dy={y > 160 ? 12 : y < 80 ? -6 : 4}
                      fill={color}
                      className="font-['JetBrains_Mono'] text-xs font-bold"
                    >
                      {payload.value} ({score}점)
                    </text>
                  </g>
                );
              }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 20]} stroke="#c3c6d6" tick={false} />
            <Radar
              name="Career Anchor Score"
              dataKey="score"
              stroke="#003d9b"
              fill="#3B82F6"
              fillOpacity={0.35}
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#003d9b', strokeWidth: 1, stroke: '#ffffff' }}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Badge Indicators */}
      <div className="flex flex-wrap justify-center gap-2 mt-4 px-2">
        {chartData.map((item) => (
          <div
            key={item.code}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f7f9fb] border border-[#e0e3e5] text-xs font-['JetBrains_Mono']"
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-medium text-[#191c1e]">
              {item.code}: {item.score}점
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

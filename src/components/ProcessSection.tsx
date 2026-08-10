import React from 'react';
import { ClipboardCheck, BarChart2, FileText } from 'lucide-react';
import { CAREER_ANCHORS } from '../data/anchors';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      icon: ClipboardCheck,
      color: 'text-[#003d9b]',
      bg: 'bg-[#dae2ff]',
      title: '40개 문항 응답',
      desc: '직무 만족도, 커리어 목표, 업무 환경에 대한 4점 척도 설문에 직관적으로 응답하세요.',
    },
    {
      icon: BarChart2,
      color: 'text-[#006a6a]',
      bg: 'bg-[#8cf3f3]',
      title: 'AI 다차원 분석',
      desc: '응답 패턴을 기반으로 8가지 앵커 성향을 계산하고, 개인화된 방사형 차트로 시각화합니다.',
    },
    {
      icon: FileText,
      color: 'text-[#2b29bb]',
      bg: 'bg-[#e1e0ff]',
      title: '맞춤형 리포트',
      desc: '핵심 앵커에 맞는 직무 추천, 경력 개발 방향, 그리고 주의해야 할 커리어 함정을 제안합니다.',
    },
  ];

  return (
    <section className="py-16 px-6 bg-white w-full border-b border-[#e0e3e5]">
      <div className="max-w-[1120px] mx-auto w-full">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="font-['Hanken_Grotesk'] text-2xl md:text-3xl font-bold text-[#191c1e] mb-3">
            단 10분, 40개의 질문
          </h2>
          <p className="font-['Inter'] text-sm md:text-base text-[#434654] leading-relaxed">
            직관적이고 체계적인 평가 시스템을 통해 당신을 움직이는 핵심 가치를 분석합니다. 8가지 커리어 앵커 중 당신의 1, 2순위 앵커를 확인하세요.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#f7f9fb] p-8 rounded-xl border border-[#e0e3e5] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div
                  className={`absolute -right-4 -top-4 w-24 h-24 ${step.bg} rounded-full opacity-40 group-hover:scale-150 transition-transform duration-500 ease-out z-0`}
                />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white rounded-lg border border-[#e0e3e5] flex items-center justify-center shadow-xs mb-5 text-[#003d9b]">
                    <Icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <h3 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#191c1e] mb-2">
                    {step.title}
                  </h3>
                  <p className="font-['Inter'] text-sm text-[#434654] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 8 Anchors Grid Overview */}
        <div className="pt-8 border-t border-[#e0e3e5]">
          <div className="text-center mb-8">
            <h3 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#191c1e]">
              8가지 커리어 앵커 (Career Anchors)
            </h3>
            <p className="font-['Inter'] text-xs text-[#737685] mt-1">
              에드거 샤인이 정의한 개인의 직업적 정체성 및 동기부여 요소
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.values(CAREER_ANCHORS).map((anchor) => (
              <div
                key={anchor.code}
                className="p-4 rounded-xl border border-[#e0e3e5] bg-[#f7f9fb] hover:bg-white transition-all shadow-2xs hover:shadow-sm"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: anchor.color }}
                  />
                  <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#191c1e]">
                    {anchor.code} - {anchor.title}
                  </span>
                </div>
                <p className="font-['Inter'] text-xs text-[#434654] line-clamp-2">
                  {anchor.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

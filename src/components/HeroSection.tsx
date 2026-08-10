import React from 'react';
import { ArrowRight, Sparkles, Anchor, Cpu, Compass, Award } from 'lucide-react';

interface HeroSectionProps {
  onStartDiagnosis: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartDiagnosis }) => {
  return (
    <section className="w-full bg-gradient-to-br from-[#f7f9fb] via-[#e1e0ff]/30 to-[#dae2ff]/40 py-16 md:py-24 px-6 relative overflow-hidden flex items-center min-h-[640px]">
      {/* Decorative Blur Background Circles */}
      <div className="absolute top-12 right-12 w-80 h-80 rounded-full bg-[#dae2ff] opacity-50 blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-64 h-64 rounded-full bg-[#e1e0ff] opacity-40 blur-2xl mix-blend-multiply pointer-events-none" />

      <div className="max-w-[1120px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Column Text Content */}
        <div className="flex flex-col gap-6 items-start text-left">
          <div className="inline-flex items-center gap-2 bg-[#ffffff] text-[#003d9b] border border-[#c3c6d6] px-3.5 py-1.5 rounded-full text-xs font-['JetBrains_Mono'] uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
            Edgar Schein's Career Anchors
          </div>

          <h1 className="font-['Hanken_Grotesk'] text-3xl sm:text-4xl md:text-5xl font-bold text-[#191c1e] leading-[1.25] tracking-tight">
            내 커리어의 중심을 찾는 시간,
            <br />
            <span className="text-[#003d9b]">커리어 앵커 진단</span>
          </h1>

          <p className="font-['Inter'] text-base md:text-lg text-[#434654] leading-relaxed max-w-lg">
            경력의 방향성을 결정하는 가장 깊은 동기와 가치관을 파악하세요. 조직 심리학자 에드거 샤인의 이론에 기반한 40개의 질문이 당신의 진짜 커리어 앵커를 찾아줍니다.
          </p>

          <div className="mt-2 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={onStartDiagnosis}
              className="bg-[#003d9b] text-white px-8 py-4 rounded-xl text-base font-['Inter'] font-semibold shadow-[0px_8px_24px_rgba(0,82,204,0.2)] hover:bg-[#0052cc] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              무료 진단 시작하기
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center gap-6 pt-4 text-xs font-['Inter'] text-[#737685]">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#003d9b]" />
              <span>40개 정밀 검사</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#10B981]" />
              <span>Gemini AI 맞춤 리포트</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#F59E0B]" />
              <span>100% 무료 진단</span>
            </div>
          </div>
        </div>

        {/* Right Column Visual Artwork */}
        <div className="relative h-full min-h-[380px] w-full flex items-center justify-center">
          {/* Main 3D Styled Anchor Card Graphic */}
          <div className="w-full max-w-[460px] bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/60 shadow-[0_20px_50px_rgba(0,61,155,0.08)] relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#3B82F6]/10 rounded-full blur-xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#10B981]/10 rounded-full blur-xl" />

            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#003d9b] to-[#3B82F6] text-white flex items-center justify-center shadow-lg mb-6 transform hover:rotate-6 transition-transform duration-300">
              <Anchor className="w-12 h-12 stroke-[1.75]" />
            </div>

            <h3 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#191c1e] mb-2">
              CAREER PATHWAYS
            </h3>
            <p className="text-xs font-['JetBrains_Mono'] text-[#003d9b] tracking-wider uppercase mb-6">
              Build Your Future • Growth Analytics
            </p>

            {/* Radar / Node Preview SVG */}
            <div className="w-full h-32 relative bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] p-3 flex items-center justify-center">
              <svg className="w-full h-full text-[#3B82F6]" viewBox="0 0 200 100">
                <polygon points="100,10 160,35 150,85 100,90 50,85 40,35" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
                <circle cx="100" cy="10" r="4" fill="#3B82F6" />
                <circle cx="160" cy="35" r="4" fill="#10B981" />
                <circle cx="150" cy="85" r="4" fill="#F59E0B" />
                <circle cx="100" cy="90" r="4" fill="#EC4899" />
                <circle cx="50" cy="85" r="4" fill="#8B5CF6" />
                <circle cx="40" cy="35" r="4" fill="#EF4444" />
              </svg>
            </div>
          </div>

          {/* Floating UI Chip Widget (matches design reference) */}
          <div className="absolute top-4 right-2 bg-white p-3.5 rounded-xl shadow-lg border border-[#e0e3e5] flex items-center gap-3 animate-bounce duration-1000 hidden sm:flex">
            <div className="w-9 h-9 rounded-full bg-[#3B82F6]/15 flex items-center justify-center text-[#3B82F6] font-bold">
              TF
            </div>
            <div>
              <div className="font-['JetBrains_Mono'] text-xs font-semibold text-[#191c1e]">
                Technical / Functional
              </div>
              <div className="h-1.5 w-24 bg-[#e0e3e5] rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-[#3B82F6] w-[85%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { BookOpen, Compass, Award, Shield, Lightbulb, Users, Heart, Zap, Coffee } from 'lucide-react';
import { CAREER_ANCHORS } from '../data/anchors';

export const AboutView: React.FC = () => {
  return (
    <main className="max-w-[1120px] mx-auto px-4 md:px-6 py-12 pt-20 bg-[#f7f9fb]">
      {/* Header */}
      <header className="text-center mb-12">
        <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#003d9b] bg-[#dae2ff] px-3.5 py-1.5 rounded-full border border-[#c3c6d6] inline-block mb-3">
          ORGANIZATIONAL PSYCHOLOGY THEORY
        </span>
        <h1 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-bold text-[#191c1e] mb-3">
          에드거 샤인의 커리어 앵커 이론이란?
        </h1>
        <p className="font-['Inter'] text-sm md:text-base text-[#434654] max-w-2xl mx-auto leading-relaxed">
          커리어 앵커(Career Anchor)는 개인이 직업적 선택을 할 때 결코 포기할 수 없는 '핵심 가치와 동기'의 집합입니다. MIT 슬론 경영대학원의 조직 심리학자 에드거 샤인(Edgar Schein) 교수가 창안했습니다.
        </p>
      </header>

      {/* Theory Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#e0e3e5] mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5]">
            <Compass className="w-6 h-6 text-[#003d9b] mb-2" />
            <h3 className="font-['Hanken_Grotesk'] text-base font-bold text-[#191c1e] mb-1">
              커리어의 나침반
            </h3>
            <p className="text-xs text-[#434654] leading-relaxed">
              배가 거친 파도 속에서도 닻(Anchor)을 내리면 흔들리지 않듯, 커리어 앵커는 변동성 높은 직업 세계에서 나를 지켜주는 중심축 역할을 합니다.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5]">
            <BookOpen className="w-6 h-6 text-[#10B981] mb-2" />
            <h3 className="font-['Hanken_Grotesk'] text-base font-bold text-[#191c1e] mb-1">
              3가지 축의 결합
            </h3>
            <p className="text-xs text-[#434654] leading-relaxed">
              ① 자기 인식된 재능과 능력(Self-perceived talents), ② 핵심 동기와 욕구(Motives), ③ 가치관(Values)이 조화롭게 통합되어 형성됩니다.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5]">
            <Award className="w-6 h-6 text-[#F59E0B] mb-2" />
            <h3 className="font-['Hanken_Grotesk'] text-base font-bold text-[#191c1e] mb-1">
              지속 가능한 성장
            </h3>
            <p className="text-xs text-[#434654] leading-relaxed">
              자신의 앵커와 부합하지 않는 직무로 번아웃이나 이탈을 겪는 일을 방지하고, 나만의 강점을 극대화하는 성장을 도모합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 8 Career Anchors Detail List */}
      <div className="space-y-6">
        <h2 className="font-['Hanken_Grotesk'] text-2xl font-bold text-[#191c1e] mb-6 text-center">
          8가지 커리어 앵커 심층 가이드
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(CAREER_ANCHORS).map((anchor) => (
            <div
              key={anchor.code}
              className="bg-white rounded-2xl p-6 border border-[#e0e3e5] shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                  style={{ backgroundColor: anchor.bgLight, color: anchor.color }}
                >
                  {anchor.code}
                </div>
                <div>
                  <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#191c1e]">
                    {anchor.koreanTitle}
                  </h3>
                  <span className="text-xs font-['JetBrains_Mono'] text-[#737685]">
                    {anchor.englishTitle}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#434654] leading-relaxed mb-4">
                {anchor.description}
              </p>

              <div className="space-y-2 pt-3 border-t border-[#eceef0]">
                <div>
                  <span className="text-2xs font-['JetBrains_Mono'] text-[#737685] font-bold block mb-1">
                    핵심 가치 (KEY VALUES)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {anchor.keyValues.map((v, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-[#f2f4f6] text-2xs text-[#191c1e] font-['Inter']"
                      >
                        #{v}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-2xs font-['JetBrains_Mono'] text-[#737685] font-bold block mb-1">
                    추천 직무 분야 (IDEAL ROLES)
                  </span>
                  <p className="text-xs text-[#003d9b] font-medium">
                    {anchor.idealRoles.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

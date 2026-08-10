import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Check, Sparkles, Loader2 } from 'lucide-react';
import { JobInputData } from '../types';

interface JobInputFormProps {
  onSubmitJobInfo: (jobData: JobInputData) => void;
  isLoadingAI: boolean;
}

export const JobInputForm: React.FC<JobInputFormProps> = ({ onSubmitJobInfo, isLoadingAI }) => {
  const [targetJob, setTargetJob] = useState('');
  const [industry, setIndustry] = useState('');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(['직무 적합성 확인']);

  const quickJobTags = [
    '서비스 기획자',
    '마케터',
    '개발자',
    'PO/PM',
    '데이터 분석가',
    'UX/UI 디자이너',
    '전략 기획자',
    'HR 매니저',
  ];

  const industryOptions = [
    'IT / 인터넷',
    '금융 / 은행',
    '커머스 / 유통',
    '미디어 / 엔터테인먼트',
    '제조 / 화학',
    '바이오 / 헬스케어',
    '스타트업 / 벤처',
    '컨설팅 / 전문직',
  ];

  const concernOptions = [
    '직무 적합성 확인',
    '자기소개서 방향성 설정',
    '면접 준비',
    '이직 타이밍/커리어 패스',
    '업무 만족도 및 동기부여',
  ];

  const handleTagClick = (tag: string) => {
    if (!targetJob.includes(tag)) {
      setTargetJob(targetJob ? `${targetJob}, ${tag}` : tag);
    }
  };

  const handleConcernToggle = (concern: string) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== concern));
    } else {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetJob.trim()) {
      alert('희망 직무를 입력해 주세요!');
      return;
    }
    onSubmitJobInfo({
      targetJob: targetJob.trim(),
      industry,
      concerns: selectedConcerns,
    });
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#f7f9fb] flex items-center justify-center p-4 sm:p-6 pt-20 pb-12">
      <div className="max-w-xl w-full">
        {/* Top Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0052cc] text-white mb-4 shadow-md">
            <CheckCircle2 className="w-10 h-10 stroke-[2]" />
          </div>
          <h1 className="font-['Hanken_Grotesk'] text-2xl sm:text-3xl font-bold text-[#003d9b] mb-2">
            진단이 완료되었습니다!
          </h1>
          <p className="font-['Inter'] text-base text-[#434654]">
            AI 분석을 위한 희망 직무를 입력해 주세요.
          </p>
        </div>

        {/* Input Form Card Surface */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 sm:p-8 border border-[#e0e3e5]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hope Job (Required) */}
            <div>
              <label htmlFor="hope-job" className="block font-['JetBrains_Mono'] text-xs font-semibold text-[#434654] mb-2">
                희망 직무 (필수) <span className="text-[#EF4444]">*</span>
              </label>
              <input
                id="hope-job"
                type="text"
                required
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
                placeholder="예: 서비스 기획자, 프론트엔드 개발자"
                className="w-full px-4 py-3 rounded-xl border border-[#c3c6d6] focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/20 font-['Inter'] text-sm text-[#191c1e] bg-[#f7f9fb] transition-all outline-none"
              />

              {/* Quick Choice Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {quickJobTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] font-['JetBrains_Mono'] text-xs transition-colors cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Industry (Optional) */}
            <div>
              <label htmlFor="industry" className="block font-['JetBrains_Mono'] text-xs font-semibold text-[#434654] mb-2">
                관심 산업군 (선택)
              </label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#c3c6d6] focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/20 font-['Inter'] text-sm text-[#191c1e] bg-[#f7f9fb] transition-all outline-none"
              >
                <option value="">산업군을 선택해주세요</option>
                {industryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Concerns (Multiple checkboxes) */}
            <div>
              <label className="block font-['JetBrains_Mono'] text-xs font-semibold text-[#434654] mb-3">
                현재 주요 고민 (다중 선택 가능)
              </label>
              <div className="space-y-3">
                {concernOptions.map((concern) => {
                  const checked = selectedConcerns.includes(concern);
                  return (
                    <label
                      key={concern}
                      onClick={() => handleConcernToggle(concern)}
                      className="flex items-center gap-3 cursor-pointer group select-none"
                    >
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${
                            checked
                              ? 'bg-[#003d9b] border-[#003d9b]'
                              : 'border-[#c3c6d6] group-hover:border-[#003d9b]'
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </div>
                      </div>
                      <span className="font-['Inter'] text-sm text-[#191c1e] group-hover:text-[#003d9b] transition-colors">
                        {concern}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Action Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoadingAI}
                className="w-full bg-[#003d9b] hover:bg-[#0052cc] text-white font-['Hanken_Grotesk'] text-base font-semibold py-4 px-6 rounded-xl shadow-[0_8px_24px_rgba(0,82,204,0.15)] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isLoadingAI ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Gemini AI 분석 리포트 생성 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span>AI 분석 리포트 확인하기</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

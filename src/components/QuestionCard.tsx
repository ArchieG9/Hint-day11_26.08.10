import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Grid, Sparkles } from 'lucide-react';
import { DIAGNOSTIC_QUESTIONS } from '../data/questions';
import { AnswersState } from '../types';

interface QuestionCardProps {
  currentQuestionIndex: number; // 0 to 39
  answers: AnswersState;
  onAnswerSelect: (questionId: number, score: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onJumpToQuestion: (index: number) => void;
  onComplete: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  currentQuestionIndex,
  answers,
  onAnswerSelect,
  onPrev,
  onNext,
  onJumpToQuestion,
  onComplete,
}) => {
  const [showGridModal, setShowGridModal] = useState(false);
  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentQuestionIndex];
  const currentScore = answers[currentQuestion.id];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / 40) * 100);

  const scaleOptions = [
    { score: 1, label: '전혀 아니다' },
    { score: 2, label: '아니다' },
    { score: 3, label: '그렇다' },
    { score: 4, label: '항상 그렇다' },
  ];

  const isLastQuestion = currentQuestionIndex === DIAGNOSTIC_QUESTIONS.length - 1;
  const allAnswered = answeredCount === 40;

  const handleOptionClick = (score: number) => {
    onAnswerSelect(currentQuestion.id, score);
    // Auto advance after short delay if not last question
    if (currentQuestionIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setTimeout(() => {
        onNext();
      }, 200);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#f7f9fb] flex flex-col items-center justify-center p-4 sm:p-6 pt-20 pb-12">
      {/* Top Fixed Progress Bar */}
      <div className="fixed top-16 left-0 w-full h-2 bg-[#e0e3e5] z-40">
        <div
          className="h-full bg-[#003d9b] transition-all duration-300 ease-out"
          style={{ width: `${((currentQuestionIndex + 1) / 40) * 100}%` }}
        />
      </div>

      <div className="w-full max-w-3xl">
        {/* Top Header Status & Question Grid Modal Trigger */}
        <div className="flex justify-between items-center mb-6 px-1">
          <div className="flex items-center gap-2">
            <span className="font-['JetBrains_Mono'] text-xs font-semibold text-[#003d9b] bg-[#dae2ff] px-3 py-1 rounded-full border border-[#c3c6d6]">
              {currentQuestionIndex + 1} / 40
            </span>
            <span className="text-xs text-[#737685]">
              (응답 완료: {answeredCount}/40)
            </span>
          </div>

          <button
            onClick={() => setShowGridModal(!showGridModal)}
            className="flex items-center gap-1.5 text-xs font-['Inter'] text-[#434654] hover:text-[#003d9b] bg-white px-3 py-1.5 rounded-lg border border-[#c3c6d6] shadow-2xs hover:bg-[#f2f4f6] transition-colors"
          >
            <Grid className="w-3.5 h-3.5" />
            문항 현황보기
          </button>
        </div>

        {/* Question Card Surface */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-[#e0e3e5] text-center mb-8 relative">
          <span className="font-['JetBrains_Mono'] text-xs font-medium text-[#737685] tracking-widest uppercase mb-4 block">
            QUESTION {currentQuestionIndex + 1}
          </span>

          <h1 className="font-['Hanken_Grotesk'] text-xl sm:text-2xl md:text-3xl font-semibold text-[#191c1e] leading-snug mb-10 min-h-[4rem] flex items-center justify-center px-2">
            {currentQuestion.text}
          </h1>

          {/* 4-Point Likert Scale Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {scaleOptions.map((option) => {
              const isSelected = currentScore === option.score;
              return (
                <button
                  key={option.score}
                  onClick={() => handleOptionClick(option.score)}
                  className={`w-full py-4 px-3 rounded-xl border text-sm font-['Inter'] font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-[#003d9b] text-white border-[#003d9b] shadow-[0px_8px_24px_rgba(0,82,204,0.2)] font-semibold scale-[1.02]'
                      : 'bg-[#f7f9fb] text-[#434654] border-[#c3c6d6] hover:border-[#003d9b] hover:text-[#003d9b] hover:bg-white'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Control Buttons */}
        <div className="flex justify-between items-center px-1">
          <button
            onClick={onPrev}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-xl border text-sm font-['Inter'] font-medium flex items-center gap-2 transition-colors ${
              currentQuestionIndex === 0
                ? 'opacity-40 cursor-not-allowed text-[#737685] border-[#e0e3e5]'
                : 'bg-white text-[#434654] border-[#c3c6d6] hover:bg-[#e0e3e5]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            이전
          </button>

          {isLastQuestion ? (
            <button
              onClick={onComplete}
              disabled={!allAnswered}
              className={`px-8 py-3.5 rounded-xl text-sm font-['Inter'] font-bold flex items-center gap-2 transition-all shadow-md ${
                allAnswered
                  ? 'bg-[#10B981] text-white hover:bg-[#059669] active:scale-95 animate-pulse'
                  : 'bg-[#003d9b] text-white hover:bg-[#0052cc]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              진단 완료하기
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-8 py-3 rounded-xl bg-[#003d9b] text-white text-sm font-['Inter'] font-medium hover:bg-[#0052cc] transition-colors flex items-center gap-2 shadow-sm"
            >
              다음
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Question Grid Overview Modal */}
      {showGridModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl border border-[#e0e3e5]">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#e0e3e5]">
              <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#191c1e]">
                전체 문항 응답 상태 ({answeredCount} / 40)
              </h3>
              <button
                onClick={() => setShowGridModal(false)}
                className="text-[#737685] hover:text-[#191c1e] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-8 gap-2 max-h-[320px] overflow-y-auto p-1">
              {DIAGNOSTIC_QUESTIONS.map((q, idx) => {
                const answered = answers[q.id] !== undefined;
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      onJumpToQuestion(idx);
                      setShowGridModal(false);
                    }}
                    className={`h-10 rounded-lg text-xs font-['JetBrains_Mono'] font-bold flex items-center justify-center border transition-all ${
                      isCurrent
                        ? 'ring-2 ring-[#003d9b] ring-offset-1 bg-[#003d9b] text-white'
                        : answered
                        ? 'bg-[#dae2ff] text-[#003d9b] border-[#3B82F6]'
                        : 'bg-[#f2f4f6] text-[#737685] border-[#e0e3e5] hover:bg-[#e0e3e5]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-[#e0e3e5] flex justify-between items-center text-xs text-[#737685]">
              <div className="flex gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-[#dae2ff] border border-[#3B82F6] rounded" /> 응답 완료
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-[#f2f4f6] rounded" /> 미응답
                </span>
              </div>
              <button
                onClick={() => setShowGridModal(false)}
                className="bg-[#003d9b] text-white px-4 py-1.5 rounded-lg text-xs font-medium"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

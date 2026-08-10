import React from 'react';
import { X, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { DiagnosticResult } from '../types';
import { CAREER_ANCHORS } from '../data/anchors';

interface PastHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultsHistory: DiagnosticResult[];
  onSelectResult: (result: DiagnosticResult) => void;
  onClearHistory: () => void;
}

export const PastHistoryModal: React.FC<PastHistoryModalProps> = ({
  isOpen,
  onClose,
  resultsHistory,
  onSelectResult,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#737685] hover:text-[#191c1e] focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#e0e3e5]">
          <h2 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#191c1e]">
            내 커리어 앵커 진단 기록 ({resultsHistory.length})
          </h2>
        </div>

        {resultsHistory.length === 0 ? (
          <div className="py-12 text-center text-[#737685] text-sm">
            저장된 진단 기록이 없습니다.
          </div>
        ) : (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {resultsHistory.map((res) => {
              const primary = CAREER_ANCHORS[res.primaryAnchor];
              const secondary = CAREER_ANCHORS[res.secondaryAnchor];
              const dateStr = new Date(res.timestamp).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={res.id}
                  onClick={() => {
                    onSelectResult(res);
                    onClose();
                  }}
                  className="p-4 rounded-xl border border-[#e0e3e5] bg-[#f7f9fb] hover:bg-white hover:border-[#003d9b] transition-all cursor-pointer flex justify-between items-center group shadow-2xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-2xs font-['JetBrains_Mono'] text-[#737685] mb-1">
                      <Calendar className="w-3 h-3 text-[#003d9b]" />
                      {dateStr}
                    </div>
                    <div className="font-['Hanken_Grotesk'] text-sm font-bold text-[#191c1e]">
                      {primary.title} ({res.primaryAnchor}) / {secondary.title} ({res.secondaryAnchor})
                    </div>
                    {res.jobInput.targetJob && (
                      <div className="text-xs text-[#003d9b] mt-0.5 font-medium">
                        희망 직무: {res.jobInput.targetJob}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#737685] group-hover:text-[#003d9b] group-hover:translate-x-1 transition-all" />
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#e0e3e5] flex justify-between items-center">
          {resultsHistory.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-[#EF4444] hover:underline flex items-center gap-1 font-['Inter']"
            >
              <Trash2 className="w-3.5 h-3.5" /> 전체 기록 삭제
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto bg-[#003d9b] text-white px-5 py-2 rounded-xl text-xs font-semibold"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

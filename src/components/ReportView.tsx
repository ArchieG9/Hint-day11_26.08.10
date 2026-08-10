import React, { useState } from 'react';
import {
  Link,
  Download,
  RotateCcw,
  Bot,
  Target,
  Lightbulb,
  AlertTriangle,
  Briefcase,
  TrendingUp,
  Send,
  MessageSquare,
  Sparkles,
  Check,
  Award,
  FileText,
  Loader2,
} from 'lucide-react';
import { DiagnosticResult, ChatMessage } from '../types';
import { CAREER_ANCHORS } from '../data/anchors';
import { RadarChartComponent } from './RadarChart';

interface ReportViewProps {
  result: DiagnosticResult;
  onRestart: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ result, onRestart }) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `안녕하세요! AI 커리어 코치입니다. 진단 결과 1순위 '${
        CAREER_ANCHORS[result.primaryAnchor].title
      }', 2순위 '${
        CAREER_ANCHORS[result.secondaryAnchor].title
      }'로 확인되었습니다. ${
        result.jobInput.targetJob ? `'${result.jobInput.targetJob}' 직무` : '커리어'
      }에 대해 더 궁금한 점이나 면접/이직 고민을 자유롭게 물어보세요!`,
      timestamp: Date.now(),
    },
  ]);
  const [isSendingChat, setIsSendingChat] = useState(false);

  const primaryInfo = CAREER_ANCHORS[result.primaryAnchor];
  const secondaryInfo = CAREER_ANCHORS[result.secondaryAnchor];
  const aiReport = result.aiReport;

  // Safe formatting for Resume Keywords
  const formattedKeywords = (() => {
    if (aiReport && Array.isArray(aiReport.resumeKeywords) && aiReport.resumeKeywords.length > 0) {
      return aiReport.resumeKeywords.map((item: any, idx: number) => {
        if (typeof item === 'string') {
          return {
            keyword: item,
            englishKeyword: '',
            description: '자기소개서 작성 및 면접 답변 시 이 역량을 입증할 수 있는 직무 프로젝트 경험과 연결하여 어필하세요.',
          };
        }
        return {
          keyword: item.keyword || item.title || item.name || `핵심 역량 ${idx + 1}`,
          englishKeyword: item.englishKeyword || item.english || '',
          description: item.description || item.detail || '구체적인 성과 지표와 사례를 바탕으로 해당 역량을 어필해보세요.',
        };
      });
    }

    return [
      {
        keyword: '전문성 및 스킬',
        englishKeyword: 'Core Competency',
        description: `${primaryInfo.title} 앵커의 강점인 고도화된 역량과 문제 해결 스킬을 프로젝트 사례와 함께 어필하세요.`,
      },
      {
        keyword: '자기주도성',
        englishKeyword: 'Autonomy & Ownership',
        description: `${secondaryInfo.title} 앵커 특성을 바탕으로 주도적으로 목표를 설정하고 달성해 낸 경험을 강조하세요.`,
      },
      {
        keyword: '직무 가치 몰입',
        englishKeyword: 'Value Alignment',
        description: `희망 직무(${result.jobInput.targetJob || '해당 분야'})에서의 직업적 지향점과 조직 성장 기여 방안을 제시하세요.`,
      },
    ];
  })();

  // Safe formatting for Career Caution
  const formattedCaution = (() => {
    if (aiReport && aiReport.careerCaution) {
      if (typeof aiReport.careerCaution === 'string' && aiReport.careerCaution.trim()) {
        return aiReport.careerCaution;
      }
      if (Array.isArray(aiReport.careerCaution)) {
        return (aiReport.careerCaution as string[]).join('\n\n');
      }
    }
    return `1순위(${primaryInfo.title})와 2순위(${secondaryInfo.title}) 앵커 조합은 매우 뛰어난 성과를 창출할 수 있으나, 희망 직무(${result.jobInput.targetJob || '해당 직무'}) 수행 시 과도한 업무 몰입이나 조직 가이드라인과의 마찰로 슬럼프가 올 수 있습니다. 본인의 커리어 우선순위를 주기적으로 점검하고 유연한 소통 태도를 유지하세요.`;
  })();

  const handleCopyLink = () => {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        })
        .catch(() => fallbackCopyTextToClipboard(url));
    } else {
      fallbackCopyTextToClipboard(url);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const reportElement = document.getElementById('report-printable-area');
      if (!reportElement) {
        throw new Error('리포트 출력 영역을 찾을 수 없습니다.');
      }

      // Dynamic import html2pdf.js
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = (html2pdfModule.default || html2pdfModule) as any;

      const dateStr = new Date().toISOString().slice(0, 10);
      const targetJob = result.jobInput.targetJob
        ? result.jobInput.targetJob.replace(/[^a-zA-Z0-9가-힣]/g, '_')
        : 'Career';
      const fileName = `커리어앵커_진단리포트_${targetJob}_${dateStr}.pdf`;

      const options = {
        margin: [10, 10, 10, 10],
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          letterRendering: true,
          windowWidth: 1120,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      await html2pdf().set(options).from(reportElement).save();

      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 3500);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF 생성 중 오류가 발생했습니다. 브라우저에서 Ctrl+P (Cmd+P)를 눌러 PDF로 인쇄/저장하실 수 있습니다.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isSendingChat) return;

    const userMsgText = chatInput.trim();
    const newUserMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: userMsgText,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, newUserMsg]);
    setChatInput('');
    setIsSendingChat(true);

    try {
      const response = await fetch('/api/career-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, newUserMsg],
          userContext: {
            primaryAnchor: `${primaryInfo.title} (${result.primaryAnchor})`,
            secondaryAnchor: `${secondaryInfo.title} (${result.secondaryAnchor})`,
            jobInput: result.jobInput,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.text) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'ai',
            text: data.text,
            timestamp: Date.now(),
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'ai',
            text: '죄송합니다, 대화 생성 중 잠시 오류가 발생했습니다.',
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: '네트워크 연결 상태를 확인해주세요.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <main className="max-w-[1120px] mx-auto px-4 md:px-6 py-12 pt-20 bg-[#f7f9fb] print:p-0 print:bg-white">
      {/* Toast Notifications */}
      {copied && (
        <div className="fixed top-20 right-6 bg-[#10B981] text-white px-4 py-2.5 rounded-xl shadow-lg z-50 flex items-center gap-2 text-xs font-['Inter'] font-semibold animate-bounce">
          <Check className="w-4 h-4" />
          진단 결과 링크가 클립보드에 복사되었습니다!
        </div>
      )}

      {pdfDownloaded && (
        <div className="fixed top-20 right-6 bg-[#003d9b] text-white px-4 py-2.5 rounded-xl shadow-lg z-50 flex items-center gap-2 text-xs font-['Inter'] font-semibold animate-bounce">
          <Download className="w-4 h-4" />
          PDF 리포트 파일이 다운로드 폴더에 저장되었습니다!
        </div>
      )}

      {/* Printable Area Wrapper */}
      <div id="report-printable-area" className="p-2 sm:p-4 rounded-2xl">
        {/* Header Title */}
        <header className="text-center mb-10 print:mb-6">
          <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#003d9b] bg-[#dae2ff] px-3 py-1 rounded-full border border-[#c3c6d6] inline-block mb-3">
            AI-POWERED DIAGNOSIS REPORT
          </span>
          <h1 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-bold text-[#003d9b] mb-2">
            Your Career Profile
          </h1>
          <p className="font-['Inter'] text-sm md:text-base text-[#434654]">
            Analysis complete. Here is your AI-driven career diagnostic report.
          </p>

          {/* User Context Badge */}
          {result.jobInput.targetJob && (
            <div className="mt-4 inline-flex flex-wrap justify-center gap-2 text-xs font-['Inter'] bg-white px-4 py-2 rounded-xl border border-[#e0e3e5] shadow-2xs">
              <span className="text-[#737685]">분석 대상 직무:</span>
              <span className="font-bold text-[#003d9b]">{result.jobInput.targetJob}</span>
              {result.jobInput.industry && (
                <>
                  <span className="text-[#c3c6d6]">|</span>
                  <span className="text-[#737685]">산업군:</span>
                  <span className="font-semibold text-[#191c1e]">{result.jobInput.industry}</span>
                </>
              )}
            </div>
          )}
        </header>

        {/* Grid Layout: Top Anchors & Radar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Section 1: Summary Top Anchors */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 sm:p-8 flex flex-col justify-between border border-[#e0e3e5]">
            <h2 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#191c1e] border-b border-[#e0e3e5] pb-4 mb-6">
              Top Career Anchors
            </h2>

            <div className="flex flex-col gap-6">
              {/* Top 1 Primary Anchor */}
              <div className="flex items-start gap-4">
                <div
                  className="p-3.5 rounded-xl flex items-center justify-center shrink-0 font-bold text-xl"
                  style={{ backgroundColor: primaryInfo.bgLight, color: primaryInfo.color }}
                >
                  ⚓
                </div>
                <div>
                  <span
                    className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider mb-1 font-bold block"
                    style={{ color: primaryInfo.color }}
                  >
                    Primary Anchor (Top 1)
                  </span>
                  <h3 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#191c1e] mb-2">
                    {primaryInfo.title} {result.primaryAnchor} - {result.scores[result.primaryAnchor]}점
                  </h3>
                  <p className="font-['Inter'] text-sm text-[#434654] leading-relaxed">
                    {primaryInfo.summary}
                  </p>
                </div>
              </div>

              {/* Top 2 Secondary Anchor */}
              <div className="flex items-start gap-4 pt-5 border-t border-[#eceef0]">
                <div
                  className="p-3.5 rounded-xl flex items-center justify-center shrink-0 font-bold text-xl"
                  style={{ backgroundColor: secondaryInfo.bgLight, color: secondaryInfo.color }}
                >
                  ✦
                </div>
                <div>
                  <span
                    className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider mb-1 font-bold block"
                    style={{ color: secondaryInfo.color }}
                  >
                    Secondary Anchor (Top 2)
                  </span>
                  <h3 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#191c1e] mb-2">
                    {secondaryInfo.title} {result.secondaryAnchor} - {result.scores[result.secondaryAnchor]}점
                  </h3>
                  <p className="font-['Inter'] text-sm text-[#434654] leading-relaxed">
                    {secondaryInfo.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Radar Chart */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 sm:p-8 flex flex-col items-center border border-[#e0e3e5]">
            <h2 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#191c1e] border-b border-[#e0e3e5] pb-4 mb-6 w-full text-left">
              Anchor Distribution
            </h2>
            <RadarChartComponent scores={result.scores} />
          </div>
        </div>

        {/* Section 3: AI Career Strategy Report */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 sm:p-8 border border-[#e0e3e5] mb-10">
          <div className="flex items-center gap-3 border-b border-[#e0e3e5] pb-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#dae2ff] text-[#003d9b] flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-['Hanken_Grotesk'] text-xl sm:text-2xl font-bold text-[#191c1e]">
                AI Career Strategy Report
              </h2>
              <p className="text-xs text-[#737685]">
                Gemini 3.6 Flash가 생성한 맞춤형 커리어 코칭 리포트
              </p>
            </div>
          </div>

          {aiReport ? (
            <div className="space-y-8">
              {/* Overall Executive Summary */}
              {aiReport.overallSummary && (
                <div className="p-4 rounded-xl bg-[#f2f4f6] border border-[#e0e3e5] text-sm text-[#191c1e] font-['Inter'] leading-relaxed">
                  💡 <span className="font-bold">종합 요약:</span> {aiReport.overallSummary}
                </div>
              )}

              {/* 3 Main Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Job Synergy */}
                <div className="bg-[#f7f9fb] rounded-xl p-6 border border-[#e0e3e5] hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-[#22C55E]" />
                    <h3 className="font-['Hanken_Grotesk'] text-base font-bold text-[#191c1e]">
                      직무 궁합 및 시너지
                    </h3>
                  </div>
                  <p className="font-['Inter'] text-sm text-[#434654] leading-relaxed whitespace-pre-line">
                    {aiReport.jobSynergy}
                  </p>
                </div>

                {/* Card 2: Resume Keywords */}
                <div className="bg-[#f7f9fb] rounded-xl p-6 border border-[#e0e3e5] hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
                    <h3 className="font-['Hanken_Grotesk'] text-base font-bold text-[#191c1e]">
                      자소서 & 면접 필살기 키워드
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {formattedKeywords.map((kw, i) => (
                      <div key={i} className="p-3 bg-white rounded-xl border border-[#e0e3e5] text-xs font-['Inter'] shadow-2xs">
                        <div className="font-bold text-[#003d9b] flex items-center gap-1.5 mb-1 text-xs">
                          <span className="w-2 h-2 rounded-full bg-[#003d9b]" />
                          {kw.keyword} {kw.englishKeyword ? `(${kw.englishKeyword})` : ''}
                        </div>
                        <p className="text-[#434654] pl-3.5 leading-relaxed">{kw.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 3: Career Caution */}
                <div className="bg-[#fff5f5] rounded-xl p-6 border border-[#ffdad6] hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                    <h3 className="font-['Hanken_Grotesk'] text-base font-bold text-[#93000a]">
                      커리어 주의사항
                    </h3>
                  </div>
                  <p className="font-['Inter'] text-xs sm:text-sm text-[#434654] leading-relaxed whitespace-pre-line">
                    {formattedCaution}
                  </p>
                </div>
              </div>

              {/* Sub-section: Recommended Roles & Growth Action Plan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#e0e3e5]">
                {/* Recommended Roles */}
                {aiReport?.recommendedRoles && aiReport.recommendedRoles.length > 0 && (
                  <div className="p-5 rounded-xl border border-[#e0e3e5] bg-[#f7f9fb]">
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="w-4 h-4 text-[#003d9b]" />
                      <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-[#191c1e]">
                        추천 연관 직무
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {aiReport.recommendedRoles.map((role, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-white text-[#003d9b] font-['JetBrains_Mono'] text-xs border border-[#c3c6d6] font-semibold"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Growth Action Plan */}
                {aiReport?.growthActionPlan && aiReport.growthActionPlan.length > 0 && (
                  <div className="p-5 rounded-xl border border-[#e0e3e5] bg-[#f7f9fb]">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-[#10B981]" />
                      <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-[#191c1e]">
                        1~3년 성장 액션 플랜
                      </h4>
                    </div>
                    <ul className="space-y-1.5 text-xs text-[#434654] font-['Inter']">
                      {aiReport.growthActionPlan.map((plan, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-bold text-[#10B981]">{idx + 1}.</span>
                          <span>{plan}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#737685]">AI 리포트 정보를 불러오는 중입니다...</p>
          )}
        </div>
      </div>

      {/* Interactive Feature: AI Career Counselor Chat */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 border border-[#e0e3e5] mb-10 print:hidden">
        <button
          onClick={() => setShowChat(!showChat)}
          className="w-full flex justify-between items-center text-left focus:outline-none cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center font-bold">
              💬
            </div>
            <div>
              <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#191c1e] flex items-center gap-2">
                AI 커리어 코치에게 더 물어보기
                <span className="text-xs bg-[#8B5CF6]/15 text-[#8B5CF6] px-2 py-0.5 rounded-full font-normal">
                  Real-time Q&A
                </span>
              </h3>
              <p className="text-xs text-[#737685]">
                진단 결과나 면접, 이직 고민에 대해 AI 코치와 대화해보세요.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#003d9b]">
            {showChat ? '접기 ▲' : '열기 ▼'}
          </span>
        </button>

        {showChat && (
          <div className="mt-6 pt-4 border-t border-[#e0e3e5] space-y-4">
            <div className="max-h-[320px] overflow-y-auto space-y-3 p-3 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5]">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs font-['Inter'] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#003d9b] text-white rounded-br-none'
                        : 'bg-white text-[#191c1e] border border-[#e0e3e5] rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isSendingChat && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl border border-[#e0e3e5] text-xs text-[#737685] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-[#003d9b]" />
                    AI 코치가 답변을 작성 중입니다...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="예: 제 커리어 앵커에 맞는 면접 1분 자기소개 예시를 만들어줘."
                className="flex-grow px-4 py-2.5 rounded-xl border border-[#c3c6d6] text-xs font-['Inter'] focus:outline-none focus:border-[#003d9b]"
              />
              <button
                type="submit"
                disabled={isSendingChat || !chatInput.trim()}
                className="bg-[#003d9b] hover:bg-[#0052cc] text-white px-5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                전송
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 border-t border-[#e0e3e5] pt-8 print:hidden">
        {/* Direct PDF File Download Button */}
        <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="flex items-center gap-2 px-6 py-3.5 bg-[#003d9b] text-white rounded-xl font-['JetBrains_Mono'] text-xs font-bold hover:bg-[#0052cc] transition-all shadow-[0_8px_24px_rgba(0,82,204,0.18)] active:scale-95 cursor-pointer disabled:opacity-70"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>PDF 파일 저장 중...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>PDF 파일 저장</span>
            </>
          )}
        </button>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-6 py-3.5 bg-white border border-[#c3c6d6] rounded-xl font-['JetBrains_Mono'] text-xs font-semibold text-[#191c1e] hover:bg-[#f2f4f6] transition-colors shadow-2xs active:scale-95 cursor-pointer"
        >
          <Link className="w-4 h-4 text-[#003d9b]" />
          <span>링크 복사</span>
        </button>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3.5 bg-white border border-[#c3c6d6] rounded-xl font-['JetBrains_Mono'] text-xs font-semibold text-[#191c1e] hover:bg-[#f2f4f6] transition-colors shadow-2xs active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#003d9b]" />
          <span>다시 진단하기</span>
        </button>
      </div>
    </main>
  );
};

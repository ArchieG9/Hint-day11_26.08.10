import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { ProcessSection } from './components/ProcessSection';
import { QuestionCard } from './components/QuestionCard';
import { JobInputForm } from './components/JobInputForm';
import { ReportView } from './components/ReportView';
import { AboutView } from './components/AboutView';
import { SignInModal } from './components/SignInModal';
import { PastHistoryModal } from './components/PastHistoryModal';

import { DIAGNOSTIC_QUESTIONS } from './data/questions';
import {
  AnswersState,
  AnchorScores,
  AnchorCode,
  JobInputData,
  DiagnosticResult,
  AIReportData,
} from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'diagnosis' | 'jobInput' | 'results' | 'about'>('home');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});

  // Diagnosis Calculated Result
  const [calculatedScores, setCalculatedScores] = useState<AnchorScores | null>(null);
  const [primaryAnchor, setPrimaryAnchor] = useState<AnchorCode>('TF');
  const [secondaryAnchor, setSecondaryAnchor] = useState<AnchorCode>('AU');

  // AI Loading & Final Diagnostic Result State
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [currentResult, setCurrentResult] = useState<DiagnosticResult | null>(null);

  // History & Sign In
  const [history, setHistory] = useState<DiagnosticResult[]>([]);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // Load past history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('career_anchor_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
      const savedUser = localStorage.getItem('career_anchor_user');
      if (savedUser) {
        setIsSignedIn(true);
        setUserName(savedUser);
      }
    } catch (e) {
      console.error('Failed to parse local history:', e);
    }
  }, []);

  // Save history to localStorage whenever updated
  const saveToHistory = (newResult: DiagnosticResult) => {
    const updated = [newResult, ...history.filter((h) => h.id !== newResult.id)];
    setHistory(updated);
    try {
      localStorage.setItem('career_anchor_history', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Answer handler
  const handleAnswerSelect = (questionId: number, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: score,
    }));
  };

  // Calculate scores on completion of questionnaire
  const calculateResults = (): {
    scores: AnchorScores;
    primary: AnchorCode;
    secondary: AnchorCode;
  } => {
    const scores: AnchorScores = {
      TF: 0,
      GM: 0,
      AU: 0,
      SE: 0,
      EC: 0,
      SV: 0,
      CH: 0,
      LS: 0,
    };

    DIAGNOSTIC_QUESTIONS.forEach((q) => {
      const pts = answers[q.id] || 0;
      scores[q.anchor] += pts;
    });

    const sortedAnchors = (Object.keys(scores) as AnchorCode[]).sort(
      (a, b) => scores[b] - scores[a]
    );

    return {
      scores,
      primary: sortedAnchors[0],
      secondary: sortedAnchors[1],
    };
  };

  const handleFinishQuestionnaire = () => {
    const { scores, primary, secondary } = calculateResults();
    setCalculatedScores(scores);
    setPrimaryAnchor(primary);
    setSecondaryAnchor(secondary);
    setCurrentTab('jobInput');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Job Input Form & call Gemini API
  const handleSubmitJobInfo = async (jobData: JobInputData) => {
    if (!calculatedScores) return;

    setIsLoadingAI(true);

    try {
      const response = await fetch('/api/career-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: calculatedScores,
          primaryAnchor,
          secondaryAnchor,
          jobInput: jobData,
        }),
      });

      const json = await response.json();
      let aiReportData: AIReportData | undefined = undefined;

      if (json.success && json.data) {
        aiReportData = json.data;
      }

      const resultObj: DiagnosticResult = {
        id: `res_${Date.now()}`,
        timestamp: Date.now(),
        scores: calculatedScores,
        primaryAnchor,
        secondaryAnchor,
        jobInput: jobData,
        aiReport: aiReportData,
      };

      setCurrentResult(resultObj);
      saveToHistory(resultObj);
      setCurrentTab('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error generating AI report:', err);
      // Fallback result if API error occurs
      const fallbackResultObj: DiagnosticResult = {
        id: `res_${Date.now()}`,
        timestamp: Date.now(),
        scores: calculatedScores,
        primaryAnchor,
        secondaryAnchor,
        jobInput: jobData,
        aiReport: {
          jobSynergy: `선택하신 ${jobData.targetJob} 직무와 ${primaryAnchor} 및 ${secondaryAnchor} 커리어 앵커는 높은 정렬을 보입니다. 전문성과 자율성을 동시에 추구하며 가치를 창출할 수 있습니다.`,
          resumeKeywords: [
            {
              keyword: '전문성',
              englishKeyword: 'Expertise',
              description: '해당 직무의 고도화된 스킬과 문제 해결 역량을 입증할 수 있는 경험 어필',
            },
            {
              keyword: '자기주도성',
              englishKeyword: 'Autonomy & Ownership',
              description: '목표 달성을 위해 스스로 주도하고 완수해낸 프로젝트 사례 제시',
            },
            {
              keyword: '지속적 성장',
              englishKeyword: 'Continuous Learning',
              description: '변화하는 환경에서 빠르게 트렌드를 학습하고 적용하는 능력 강조',
            },
          ],
          careerCaution: '과도하게 자율성만을 고집할 경우 조직 내 협업 시 마찰이 생길 수 있으므로, 적절한 소통과 동료들과의 조화를 염두에 두세요.',
          recommendedRoles: [jobData.targetJob, '전문 컨설턴트', '프로젝트 리드'],
          growthActionPlan: [
            '핵심 스킬 자격증 또는 포트폴리오 강화',
            '관련 산업 분야 세미나 참석 및 네트워크 형성',
            '리더십 및 커뮤니케이션 역량 보완',
          ],
          overallSummary: '당신의 강점과 앵커 특성을 바탕으로 지속 가능한 독보적 커리어를 구축하세요!',
        },
      };

      setCurrentResult(fallbackResultObj);
      saveToHistory(fallbackResultObj);
      setCurrentTab('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleStartDiagnosis = () => {
    setCurrentQuestionIndex(0);
    setCurrentTab('diagnosis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCalculatedScores(null);
    setCurrentResult(null);
    setCurrentTab('diagnosis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignInSuccess = (name: string) => {
    setIsSignedIn(true);
    setUserName(name);
    localStorage.setItem('career_anchor_user', name);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('career_anchor_history');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] text-[#191c1e] font-['Inter'] antialiased">
      {/* Navigation Header */}
      <Header
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSignIn={() => setIsSignInOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        hasDiagnosis={Boolean(currentResult || history.length > 0)}
        isSignedIn={isSignedIn}
        userName={userName}
      />

      {/* Main Content Area based on route state */}
      <div className="flex-grow">
        {currentTab === 'home' && (
          <main>
            <HeroSection onStartDiagnosis={handleStartDiagnosis} />
            <ProcessSection />
          </main>
        )}

        {currentTab === 'diagnosis' && (
          <QuestionCard
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            onAnswerSelect={handleAnswerSelect}
            onPrev={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            onNext={() =>
              setCurrentQuestionIndex((prev) =>
                Math.min(DIAGNOSTIC_QUESTIONS.length - 1, prev + 1)
              )
            }
            onJumpToQuestion={(index) => setCurrentQuestionIndex(index)}
            onComplete={handleFinishQuestionnaire}
          />
        )}

        {currentTab === 'jobInput' && (
          <JobInputForm
            onSubmitJobInfo={handleSubmitJobInfo}
            isLoadingAI={isLoadingAI}
          />
        )}

        {currentTab === 'results' && currentResult && (
          <ReportView result={currentResult} onRestart={handleRestart} />
        )}

        {currentTab === 'about' && <AboutView />}
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSignInSuccess={handleSignInSuccess}
      />

      <PastHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        resultsHistory={history}
        onSelectResult={(res) => {
          setCurrentResult(res);
          setCurrentTab('results');
        }}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}

export default App;

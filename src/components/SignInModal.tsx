import React, { useState } from 'react';
import { X, Lock, Mail, User, CheckCircle } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: (userName: string) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSignInSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = userName.trim() || email.split('@')[0] || '사용자';
    onSignInSuccess(displayName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#737685] hover:text-[#191c1e] focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#dae2ff] text-[#003d9b] flex items-center justify-center mx-auto mb-3 text-xl font-bold">
            ⚓
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#191c1e]">
            {isSignUp ? '회원가입' : 'Sign In to My Career Anchor'}
          </h2>
          <p className="text-xs text-[#737685] mt-1">
            진단 결과를 저장하고 언제든 재확인하세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-['JetBrains_Mono'] text-[#434654] mb-1">
                이름 / 닉네임
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#737685] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#c3c6d6] text-xs font-['Inter'] focus:outline-none focus:border-[#003d9b] bg-[#f7f9fb]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-['JetBrains_Mono'] text-[#434654] mb-1">
              이메일 주소
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#737685] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@career.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#c3c6d6] text-xs font-['Inter'] focus:outline-none focus:border-[#003d9b] bg-[#f7f9fb]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-['JetBrains_Mono'] text-[#434654] mb-1">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#737685] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#c3c6d6] text-xs font-['Inter'] focus:outline-none focus:border-[#003d9b] bg-[#f7f9fb]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#003d9b] hover:bg-[#0052cc] text-white py-3 rounded-xl font-['Hanken_Grotesk'] text-sm font-bold shadow-md transition-all active:scale-98 mt-2 cursor-pointer"
          >
            {isSignUp ? '가입하기' : '로그인'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-[#e0e3e5] text-center text-xs text-[#737685]">
          {isSignUp ? '이미 계정이 있으신가요?' : '아직 계정이 없으신가요?'}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#003d9b] font-bold hover:underline"
          >
            {isSignUp ? '로그인 하기' : '회원가입 하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

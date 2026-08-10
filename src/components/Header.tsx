import React, { useState } from 'react';
import { Menu, X, UserCheck, History, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'diagnosis' | 'jobInput' | 'results' | 'about';
  onNavigate: (tab: 'home' | 'diagnosis' | 'results' | 'about') => void;
  onOpenSignIn: () => void;
  onOpenHistory: () => void;
  hasDiagnosis: boolean;
  isSignedIn: boolean;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenSignIn,
  onOpenHistory,
  hasDiagnosis,
  isSignedIn,
  userName,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: 'home' | 'diagnosis' | 'results' | 'about'; label: string; disabled?: boolean }> = [
    { id: 'home', label: 'Home' },
    { id: 'diagnosis', label: 'Diagnosis' },
    { id: 'results', label: 'Results', disabled: !hasDiagnosis },
    { id: 'about', label: 'About' },
  ];

  return (
    <nav className="bg-[#ffffff] text-[#003d9b] shadow-sm fixed top-0 left-0 w-full z-50 h-16 border-b border-[#e0e3e5]">
      <div className="max-w-[1120px] mx-auto h-full px-6 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#003d9b] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            ⚓
          </div>
          <span className="font-['Hanken_Grotesk'] text-xl font-bold tracking-tight text-[#003d9b]">
            My Career Anchor
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 h-full">
          {navItems.map((item) => {
            const isActive = currentTab === item.id || (currentTab === 'jobInput' && item.id === 'diagnosis');
            const isDisabled = item.disabled;

            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && onNavigate(item.id)}
                disabled={isDisabled}
                className={`relative h-full flex items-center font-['Inter'] text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#003d9b] font-semibold'
                    : isDisabled
                    ? 'text-[#94a3b8] cursor-not-allowed'
                    : 'text-[#434654] hover:text-[#003d9b]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#003d9b] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {hasDiagnosis && (
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 text-xs font-['JetBrains_Mono'] px-3 py-1.5 rounded-lg border border-[#c3c6d6] text-[#434654] hover:bg-[#f2f4f6] transition-colors"
            >
              <History className="w-3.5 h-3.5 text-[#003d9b]" />
              내 진단 기록
            </button>
          )}

          {isSignedIn ? (
            <div className="flex items-center gap-2 bg-[#f2f4f6] px-3 py-1.5 rounded-lg border border-[#e0e3e5]">
              <UserCheck className="w-4 h-4 text-[#10B981]" />
              <span className="text-xs font-medium text-[#191c1e]">{userName || '회원'}</span>
            </div>
          ) : (
            <button
              onClick={onOpenSignIn}
              className="bg-[#003d9b] text-white hover:bg-[#0052cc] px-4 py-2 rounded-lg text-xs font-['JetBrains_Mono'] font-medium transition-all shadow-sm active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#434654] hover:text-[#003d9b] p-1 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#ffffff] border-b border-[#e0e3e5] px-6 py-4 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (!item.disabled) {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }
              }}
              disabled={item.disabled}
              className={`block w-full text-left py-2 text-base font-medium ${
                currentTab === item.id
                  ? 'text-[#003d9b] font-bold'
                  : item.disabled
                  ? 'text-[#cbd5e1] cursor-not-allowed'
                  : 'text-[#434654]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#e0e3e5] flex flex-col gap-2">
            {hasDiagnosis && (
              <button
                onClick={() => {
                  onOpenHistory();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-['JetBrains_Mono'] border border-[#c3c6d6] rounded-lg text-[#434654]"
              >
                <History className="w-4 h-4 text-[#003d9b]" />
                내 진단 기록
              </button>
            )}
            {!isSignedIn && (
              <button
                onClick={() => {
                  onOpenSignIn();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#003d9b] text-white py-2 rounded-lg text-sm font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

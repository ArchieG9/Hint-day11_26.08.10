import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f2f4f6] text-[#434654] border-t border-[#c3c6d6] w-full py-6 px-6 mt-auto text-sm">
      <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <span className="font-['Hanken_Grotesk'] text-lg font-bold text-[#191c1e] tracking-tight">
            My Career Anchor
          </span>
          <span className="hidden md:inline text-[#737685]">|</span>
          <p className="text-xs text-[#737685]">
            © 2026 My Career Anchor. All rights reserved. Professional Career Coaching & AI Analysis.
          </p>
        </div>

        <nav className="flex gap-6 text-xs text-[#737685]">
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#003d9b] transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-[#003d9b] transition-colors">
            Terms of Service
          </a>
          <a href="#support" onClick={(e) => e.preventDefault()} className="hover:text-[#003d9b] transition-colors">
            Contact Support
          </a>
        </nav>
      </div>
    </footer>
  );
};

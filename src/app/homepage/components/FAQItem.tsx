'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleOpen = () => {
    if (!isHydrated) return;
    setIsOpen(!isOpen);
  };

  if (!isHydrated) {
    return (
      <div className="rounded-xl p-5" style={{ background: '#252830', border: '1px solid rgba(200,205,220,0.14)' }}>
        <div className="h-5 bg-white/10 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl transition-all duration-250"
      style={{ background: '#252830', border: `1px solid ${isOpen ? 'rgba(245,158,11,0.35)' : 'rgba(200,205,220,0.14)'}` }}
    >
      <button
        onClick={toggleOpen}
        className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <h3 className="font-heading font-semibold text-base text-white flex-1">
          {question}
        </h3>
        <Icon
          name="ChevronDownIcon"
          size={20}
          variant="outline"
          className={`text-white/30 flex-shrink-0 transition-transform duration-250 mt-0.5 ${isOpen ? 'rotate-180 text-amber-400' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5">
          <p className="font-body text-sm text-white/50 leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;
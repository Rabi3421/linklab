import FAQItem from './FAQItem';
import Icon from '@/components/ui/AppIcon';

interface FAQ {
  question: string;
  answer: string;
}

const FAQSection = () => {
  const faqs: FAQ[] = [
    {
      question: 'How does LinkLab URL shortener work?',
      answer:
        'LinkLab uses advanced Base62 encoding to convert your long URLs into short, memorable links. Simply paste your URL, and we generate a unique short code that redirects to your original link. You can also create custom aliases for branded links.',
    },
    {
      question: 'Is LinkLab free to use?',
      answer:
        'Yes. LinkLab includes a free tier with 5 new shortened links every month, basic analytics, and custom aliases. If you need higher monthly limits and richer workspace controls, paid plans start at $6 per month.',
    },
    {
      question: 'Can I track clicks on my shortened links?',
      answer:
        'Absolutely! Every shortened link comes with comprehensive analytics including total clicks, geographic location, device types, referral sources, and time-based patterns. You can access these insights from your dashboard anytime.',
    },
    {
      question: 'Are shortened links permanent?',
      answer:
        'Yes, all shortened links are permanent by default and will continue working indefinitely. However, you have full control and can set expiration dates, disable links, or delete them from your dashboard whenever needed.',
    },
    {
      question: 'Can I use custom domains with LinkLab?',
      answer:
        'Custom domain support is available on our Business and Enterprise plans. This allows you to use your own branded domain (e.g., go.yourbrand.com) instead of linklab.io for all your shortened links.',
    },
    {
      question: 'How secure are LinkLab shortened links?',
      answer:
        'Security is our top priority. All links use SSL encryption, we implement spam protection and malware scanning, and maintain 99.9% uptime. We also provide link password protection and expiration options for sensitive content.',
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#1e2129]">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-body text-sm font-semibold text-amber-400 uppercase tracking-widest mb-3">
            FAQ
          </p>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl text-white leading-tight mb-4">
            Common questions
          </h2>
          <p className="font-body text-lg text-white/45">
            Everything you need to know about LinkLab
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="font-body text-base text-white/35 mb-4">Still have questions?</p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 font-body font-medium text-base text-amber-400 transition-all duration-250 hover:text-amber-300 hover:-translate-y-0.5"
          >
            Contact our support team
            <Icon name="ArrowRightIcon" size={16} variant="outline" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

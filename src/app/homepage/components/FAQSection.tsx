import FAQItem from './FAQItem';
import Icon from '@/components/ui/AppIcon';

interface FAQ {
  question: string;
  answer: string;
}

export const homepageFaqs: FAQ[] = [
  {
    question: 'How does LinkLab URL shortener work?',
    answer:
      'LinkLab converts long URLs into short, shareable links using unique short codes. You can create custom aliases, branded short links, and QR-code-ready URLs, then track clicks, locations, devices, and referral sources from one dashboard.',
  },
  {
    question: 'Is LinkLab free to use?',
    answer:
      'Yes. LinkLab includes a free tier with 10 new shortened links every month, basic analytics, and custom aliases. If you need higher monthly limits, branded domains, richer workspace controls, or API workflows, monthly plans start at $1 per month, and no-expiry link credit packs are also available.',
  },
  {
    question: 'What is the cheapest paid plan for a URL shortener?',
    answer:
      'LinkLab offers one of the lowest-cost URL shortener plans available. The Starter plan starts at just $1 per month for 100 shortened links, full click analytics, branded short links, custom aliases, and API access. There is also a free plan with 10 links per month for getting started at no cost.',
  },
  {
    question: 'Can I track clicks on my shortened links?',
    answer:
      'Absolutely. Every shortened link comes with link analytics including total clicks, geographic location, device types, referral sources, and time-based patterns. You can use this short link analytics data to measure campaign performance and optimize traffic sources.',
  },
  {
    question: 'Does LinkLab support QR code generation?',
    answer:
      'Yes. Every short link you create on LinkLab automatically generates a matching QR code. You can download and use the QR code on printed materials, product packaging, event signage, and offline campaigns. QR scan data is tracked the same way as regular link clicks.',
  },
  {
    question: 'Can I use LinkLab\'s URL shortener API to create links programmatically?',
    answer:
      'Yes. LinkLab provides a REST API for creating short links, retrieving click analytics, and managing links programmatically. This is useful for developers who need to automate link generation in their applications, e-commerce platforms, CRM systems, or marketing automation tools. API access is available on paid plans.',
  },
  {
    question: 'Are shortened links permanent?',
    answer:
      'Yes. Shortened links are permanent by default and continue working unless you delete them, disable them, or set an expiration rule. That makes LinkLab suitable for long-term campaigns, printed QR codes, and evergreen branded links.',
  },
  {
    question: 'Can I use custom domains with LinkLab?',
    answer:
      'Yes. Custom domain support is available on Launch plans and above, with higher tiers unlocking more branded domains and advanced controls. This lets you create branded short links such as go.yourbrand.com instead of using the default short-link domain.',
  },
  {
    question: 'What are one-time link credit packs?',
    answer:
      'Link credit packs are a non-subscription option for teams with occasional or seasonal link needs. You buy a fixed number of link credits once — such as 100, 500, 2,000, or 10,000 — and they never expire. Use them whenever you need without a monthly commitment. Packs start at $1.50 for 100 credits.',
  },
  {
    question: 'Can I create bulk short links with LinkLab?',
    answer:
      'Yes. LinkLab supports bulk link creation through the REST API and higher-tier plans. You can generate hundreds or thousands of short links programmatically in a single workflow, making it ideal for agencies, e-commerce platforms, and marketing automation pipelines.',
  },
  {
    question: 'How secure are LinkLab shortened links?',
    answer:
      'Security is a priority. LinkLab uses SSL-protected redirects, spam protection, malware checks, and reliable global infrastructure. Advanced plans can support stronger controls for teams that need enterprise-grade link management.',
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#1e2129]">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-body text-sm font-semibold text-amber-400 uppercase tracking-widest mb-3">
            FAQ
          </p>
          <h2 className="font-heading font-bold text-4xl lg:text-5xl text-white leading-tight mb-4">
            Common URL shortener questions
          </h2>
          <p className="font-body text-lg text-white/45">
            Everything you need to know about branded links, analytics, QR-code-ready short URLs, and LinkLab
          </p>
        </div>

        <div className="space-y-3">
          {homepageFaqs.map((faq, index) => (
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

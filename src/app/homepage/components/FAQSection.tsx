import FAQItem from './FAQItem';
import Icon from '@/components/ui/AppIcon';

interface FAQ {
  question: string;
  answer: string;
}

export const homepageFaqs: FAQ[] = [
  {
    question: 'Can I organize my links by client?',
    answer:
      'Today you organize by naming convention: give every link a client-prefixed custom alias such as linklab.in/acme-diwali or linklab.in/nova-launch, so each client\'s links read clearly in your dashboard and in the link itself. Grouped client workspaces — a folder per client with roll-up totals across their campaigns — are in development and not available yet. Every link already carries its own analytics, so per-campaign numbers are available now.',
  },
  {
    question: 'Can I white-label reports for my clients?',
    answer:
      'Not yet. White-label client reports carrying your agency\'s branding are on the build list, and we would rather say so than imply they exist. What works today: every link has a full analytics view with clicks, QR scans, locations, devices, browsers, referrers, and time patterns, which you can pull the figures from when you assemble a client update. Custom domains on Launch plans and above also let the links themselves carry a branded domain rather than a generic one.',
  },
  {
    question: 'What happens to a client\'s links if they leave?',
    answer:
      'The links keep working and stay in your account, because they belong to your LinkLab account rather than to the client. Nothing breaks or expires when an engagement ends. If a departing client should no longer receive traffic, you can disable or delete those links, or repoint them somewhere else — the short code stays the same, so a QR code already printed on their packaging can be redirected rather than stranded. If you are handing the work to another agency, share the destination URLs and let them recreate the links on their own account.',
  },
  {
    question: 'Can each client have their own domain?',
    answer:
      'Not per client yet. Custom domains are a plan entitlement — one on Launch, three on Growth, ten on Scale — and per-client domain routing, where each client\'s links resolve on their own branded domain, is on the roadmap rather than live. Right now the practical approach is one branded domain for your agency, with client-prefixed aliases distinguishing the campaigns underneath it.',
  },
  {
    question: 'Do you charge per seat like the enterprise tools?',
    answer:
      'No. Plans are priced for the agency, not per user added. Each tier includes a set number of users — one on Free and Starter, two on Launch, five on Growth, ten on Scale — alongside the link volume, so growing your roster does not mean paying an enterprise seat price for every person who needs access. Paid plans start at ₹99 per month, and no-expiry link credit packs cover occasional or seasonal campaign work without a subscription.',
  },
  {
    question: 'Can I repoint a QR code after it has been printed?',
    answer:
      'Yes, and this is the single most useful thing for offline client work. The QR code encodes the short link rather than the final destination, so you can change where that link goes at any time and every code already printed on a client\'s packaging, poster, menu, or standee follows the change. A Diwali offer becomes a New Year offer without a reprint, and the scan data keeps accumulating on the same link.',
  },
  {
    question: 'Does LinkLab work for WhatsApp and Instagram campaigns?',
    answer:
      'Those are the channels it is built around. A short branded link in a WhatsApp broadcast reads as legitimate rather than as spam, and an Instagram bio or story link can be repointed when the campaign changes without editing every post. Clicks from both are tracked the same way as any other link, so you can see how a client\'s WhatsApp list performed against their Instagram audience.',
  },
  {
    question: 'How much does LinkLab cost and is there a free plan?',
    answer:
      'There is a free plan with 10 new links per month, basic analytics, and custom aliases — enough to run a first client campaign end to end. Paid plans start at ₹99 per month for 100 links, 5,000 tracked clicks, and 60-day analytics, and scale up through Launch, Growth, Scale, and Pro as your roster grows. One-time link credit packs start at ₹129 for 100 credits and never expire.',
  },
  {
    question: 'Can I create links in bulk or through an API?',
    answer:
      'Yes. LinkLab provides a REST API for creating short links, retrieving analytics, and managing links programmatically, which is how agencies generate campaign links in batches rather than one at a time. API access is included from the Growth plan upward, with full documentation in the developer docs.',
  },
  {
    question: 'Are the links permanent, and are they secure?',
    answer:
      'Links are permanent by default and keep resolving unless you delete them, disable them, or set an expiry rule — which matters when a client\'s QR code is printed on something with a long shelf life. Every redirect is served over SSL, with spam and malware checks on destinations.',
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
            Questions agencies ask us
          </h2>
          <p className="font-body text-lg text-white/45">
            How client organization, reporting, domains, and pricing actually work — including what is
            not built yet.
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

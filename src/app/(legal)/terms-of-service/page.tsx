import type { Metadata } from 'next';
import SimplePolicyPage from '../components/SimplePolicyPage';

export const metadata: Metadata = {
  title: 'Terms of Service | LinkLab',
  description: 'Terms of service for LinkLab users and visitors.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsOfServicePage() {
  return (
    <SimplePolicyPage
      title="Terms of Service"
      description="This page summarizes expected usage rules for LinkLab. Replace this operational summary with your final lawyer-reviewed terms before launch."
      sections={[
        {
          heading: 'Acceptable use',
          body:
            'Do not use LinkLab to distribute malware, phishing pages, spam, illegal content, deceptive redirects, or content that violates applicable laws or platform policies.',
        },
        {
          heading: 'Accounts and billing',
          body:
            'Users are responsible for maintaining account security, protecting API keys, choosing the correct plan, and complying with any quota or billing limits shown in the product.',
        },
        {
          heading: 'Service changes',
          body:
            'LinkLab may update features, limits, pricing, and abuse-prevention rules to protect reliability and keep the platform useful for legitimate link management workflows.',
        },
      ]}
    />
  );
}


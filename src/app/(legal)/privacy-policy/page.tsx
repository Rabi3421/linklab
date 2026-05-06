import type { Metadata } from 'next';
import SimplePolicyPage from '../components/SimplePolicyPage';

export const metadata: Metadata = {
  title: 'Privacy Policy | LinkLab',
  description: 'Privacy policy for LinkLab users and visitors.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <SimplePolicyPage
      title="Privacy Policy"
      description="This page summarizes how LinkLab handles account, link, and analytics information. Replace this operational summary with your final lawyer-reviewed policy before launch."
      sections={[
        {
          heading: 'Information we process',
          body:
            'LinkLab may process account details, shortened URLs, QR code configuration, billing information, API keys, and link analytics such as click time, referrer, device type, browser, and approximate location signals.',
        },
        {
          heading: 'How the information is used',
          body:
            'Information is used to provide URL shortening, QR generation, analytics, account access, billing, abuse prevention, product reliability, and customer support.',
        },
        {
          heading: 'Contact',
          body:
            'For privacy questions or deletion requests, contact the LinkLab team through the contact page or the support channel configured for your deployment.',
        },
      ]}
    />
  );
}


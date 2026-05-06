import type { Metadata } from 'next';
import SimplePolicyPage from '../components/SimplePolicyPage';

export const metadata: Metadata = {
  title: 'Contact LinkLab | Support, Sales & Partnerships',
  description:
    'Contact LinkLab for support, sales questions, developer API help, custom domains, and URL shortener partnership requests.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return (
    <SimplePolicyPage
      title="Contact LinkLab"
      description="Need help with short links, QR codes, analytics, pricing, custom domains, or API access? Use the account support channel configured for your deployment, or start from the pricing and developer documentation pages."
      sections={[
        {
          heading: 'Support',
          body:
            'For account, billing, API key, or analytics questions, sign in to your LinkLab account and use your configured support workflow.',
        },
        {
          heading: 'Sales and custom domains',
          body:
            'For custom domains, high-volume link creation, team workflows, and enterprise requirements, review pricing and contact the team with your usage needs.',
        },
        {
          heading: 'Developers',
          body:
            'For API workflows, read the developer documentation and confirm your plan includes the endpoints and quotas your integration needs.',
        },
      ]}
    />
  );
}

import type { Metadata } from 'next';
import SimplePolicyPage from '../components/SimplePolicyPage';

export const metadata: Metadata = {
  title: 'Cookie Policy | LinkLab',
  description: 'Cookie policy for LinkLab users and visitors.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function CookiePolicyPage() {
  return (
    <SimplePolicyPage
      title="Cookie Policy"
      description="This page summarizes how cookies and similar storage may be used by LinkLab. Replace this operational summary with your final compliance text before launch."
      sections={[
        {
          heading: 'Essential cookies',
          body:
            'Essential cookies or local storage may be used for authentication, session management, security, and product preferences required for the app to function.',
        },
        {
          heading: 'Analytics',
          body:
            'If analytics is enabled, LinkLab may use measurement tools to understand traffic, diagnose performance, and improve the product experience.',
        },
        {
          heading: 'Managing cookies',
          body:
            'Visitors can control browser storage through their browser settings. Some product features may not work correctly if essential storage is disabled.',
        },
      ]}
    />
  );
}


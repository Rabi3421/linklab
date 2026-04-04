import type { Metadata } from 'next';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import HomepageInteractive from './components/HomepageInteractive';

export const metadata: Metadata = {
  title: 'LinkLab - URL Shortener with Analytics & Custom Links',
  description: 'Create powerful short links with detailed analytics. Track clicks, manage campaigns, and grow your audience with LinkLab\'s professional URL shortening service.',
};

export default function Homepage() {
  return (
    <>
      <AuthenticationAwareHeader isAuthenticated={false} />
      <HomepageInteractive />
    </>
  );
}
import SeoLandingPage from '../components/SeoLandingPage';
import { buildSeoLandingMetadata, getSeoLandingPage } from '@/lib/seo/landing-pages';

const page = getSeoLandingPage('link-management-tool');

export const metadata = buildSeoLandingMetadata(page);

export default function LinkManagementToolPage() {
  return <SeoLandingPage page={page} />;
}


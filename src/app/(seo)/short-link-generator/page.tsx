import SeoLandingPage from '../components/SeoLandingPage';
import { buildSeoLandingMetadata, getSeoLandingPage } from '@/lib/seo/landing-pages';

const page = getSeoLandingPage('short-link-generator');

export const metadata = buildSeoLandingMetadata(page);

export default function ShortLinkGeneratorPage() {
  return <SeoLandingPage page={page} />;
}


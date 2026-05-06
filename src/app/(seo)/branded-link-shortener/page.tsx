import SeoLandingPage from '../components/SeoLandingPage';
import { buildSeoLandingMetadata, getSeoLandingPage } from '@/lib/seo/landing-pages';

const page = getSeoLandingPage('branded-link-shortener');

export const metadata = buildSeoLandingMetadata(page);

export default function BrandedLinkShortenerPage() {
  return <SeoLandingPage page={page} />;
}


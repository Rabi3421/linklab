import SeoLandingPage from '../components/SeoLandingPage';
import { buildSeoLandingMetadata, getSeoLandingPage } from '@/lib/seo/landing-pages';

const page = getSeoLandingPage('custom-url-shortener');

export const metadata = buildSeoLandingMetadata(page);

export default function CustomUrlShortenerPage() {
  return <SeoLandingPage page={page} />;
}


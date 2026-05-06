import SeoLandingPage from '../components/SeoLandingPage';
import { buildSeoLandingMetadata, getSeoLandingPage } from '@/lib/seo/landing-pages';

const page = getSeoLandingPage('free-url-shortener');

export const metadata = buildSeoLandingMetadata(page);

export default function FreeUrlShortenerPage() {
  return <SeoLandingPage page={page} />;
}


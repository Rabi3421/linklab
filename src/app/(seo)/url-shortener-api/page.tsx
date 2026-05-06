import SeoLandingPage from '../components/SeoLandingPage';
import { buildSeoLandingMetadata, getSeoLandingPage } from '@/lib/seo/landing-pages';

const page = getSeoLandingPage('url-shortener-api');

export const metadata = buildSeoLandingMetadata(page);

export default function UrlShortenerApiPage() {
  return <SeoLandingPage page={page} />;
}


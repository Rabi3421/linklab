import SeoLandingPage from '../components/SeoLandingPage';
import { buildSeoLandingMetadata, getSeoLandingPage } from '@/lib/seo/landing-pages';

const page = getSeoLandingPage('url-shortener-with-analytics');

export const metadata = buildSeoLandingMetadata(page);

export default function UrlShortenerWithAnalyticsPage() {
  return <SeoLandingPage page={page} />;
}


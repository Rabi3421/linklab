import SeoLandingPage from '../components/SeoLandingPage';
import { buildSeoLandingMetadata, getSeoLandingPage } from '@/lib/seo/landing-pages';

const page = getSeoLandingPage('website-url-shortener');

export const metadata = buildSeoLandingMetadata(page);

export default function WebsiteUrlShortenerPage() {
  return <SeoLandingPage page={page} />;
}

